// internal crafted imports of sources
import {
  IDelete,
  IUpdateAdmin,
  IUpdateStudent,
  IaddStudent,
  IcreateAdmin,
} from "../Interface/interface";
import { UseRandomAdmin } from "../SeedAdmin";
import { UseRandomStudent } from "../SeedStudents";
import { isAdmin, isAdminLogin } from "../administrator";
import { REDIS_CLIENT } from "../constants";
import {
  FriendsModel,
  PostsModel,
  RegisterModelAdmin,
  RegisterModelStudent,
} from "../models/index";
import { isStudent, isStudentLogin } from "../students";
import { tokenAuth } from "../utils/Auth";
import useNoteLevel from "../utils/NoteLevel";
import { RefreshToken } from "../utils/RefreshToken";
import { sendMail } from "../utils/SendMail";
import {
  AdminLoginValidation,
  AdminRegisterValidation,
  StudentLoginValidation,
  StudentRegisterValidation,
} from "../utils/index";
import { IMail } from "../Interface/Student";
// external imports of ressources
import bcryptjs from "bcryptjs";
import consola from "consola";
import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import __ from "lodash";
import { Types } from "mongoose";
import { promisify } from "util";
import isNil from "lodash/isNil";

const { info, success } = consola;

// generate the salt
const BCRYPT_SALT: (salt?: number) => Promise<unknown> = promisify(
  bcryptjs.genSalt
).bind(bcryptjs);

// get passCode encoded
const BCRYPT_HASH: (
  passCode: string,
  hash: string | number
) => Promise<string> = promisify(bcryptjs.hash).bind(bcryptjs);

const BCRYPT_COMPARE: (
  firstPassCode: string,
  secondPassCode: string
) => Promise<boolean> = promisify(bcryptjs.compare).bind(bcryptjs);

interface IFriends<S> {
  status: string;
  Identifier: string;
  User: Types.ObjectId;
}

interface ISRegister<S> {
  _ID_User: S;
  Firstname: S;
  Lastname: S;
  Email?: S;
  Username?: S;
  Password: S;
  ConfirmPassword: S;
  Image?: S;
  Class?: S;
  ClassName?: S;
  StatusLevel?: S;
  PromoCode?: S;
  SchoolLevel: S;
  NoteLevel: number;
}

interface IEditAccount
  extends Omit<ISRegister<string>, "SchoolLevel" | "NoteLevel" | "Promocode"> {
  _id: Types.ObjectId;
  DOB: string;
}

interface Credentials {
  DataStudent: ISRegister<string>;
  DataAdmin: Omit<ISRegister<string>, "SchoolLevel" | "NoteLevel">;
}

interface IInfoLogin<T> {
  username?: T;
  email?: T;
  password: T;
}

interface ILogin<T> {
  __status: T;
  Data: { username?: T; email?: T; password: T };
}

export const StudentAdminRegister = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      Firstname,
      Lastname,
      Email,
      Username,
      Password,
      ConfirmPassword,
      Image,
      SchoolLevel,
      Class,
      ClassName,
      StatusLevel,
      PromoCode,
    }: ISRegister<string> = await req.body;
    const statusKey: string = await req.params.status;

    // creating a salt of 10 bytes at the maximum for protecting against brute-force attack
    const hash: unknown = await BCRYPT_SALT(10);

    const PasswHash = await BCRYPT_HASH(Password, `${hash}`);

    const ConfirmPasswHash = await BCRYPT_HASH(ConfirmPassword, `${hash}`);

    // using this pattern for generating robust User credentials security for incoming and outcoming data
    const LettersFromFirstname: string = Firstname.substring(0, 3);
    const LettersFromLastname: string = Lastname.substring(Lastname.length - 3);
    // get numbers and some characters at random
    const RandomDigits: number = Math.floor(Math.random() * 100_000);
    const Id_User: string = LettersFromFirstname.concat(
      RandomDigits.toString(),
      LettersFromLastname
    );
    // student average
    const NoteLevel: number = useNoteLevel(10, 100);

    // student credentials
    const credentials: Credentials = {
      DataStudent: {
        _ID_User: Id_User,
        Firstname,
        Lastname,
        Username,
        Email,
        Password: PasswHash,
        ConfirmPassword: ConfirmPasswHash,
        Image,
        SchoolLevel,
        Class,
        ClassName,
        NoteLevel,
      },
      DataAdmin: {
        _ID_User: Id_User,
        Firstname,
        Lastname,
        Username,
        Email,
        Password: PasswHash,
        ConfirmPassword: ConfirmPasswHash,
        PromoCode,
        Image,
        StatusLevel,
      },
    };

    const StudentInfo: ISRegister<string> = credentials["DataStudent"];
    const AdminInfo: Omit<
      ISRegister<string>,
      "NoteLevel" | "SchoolLevel"
    > = credentials["DataAdmin"];

    if (isStudent({ __status: `${statusKey}`, Info: StudentInfo })) {
      const randomStudent = await UseRandomStudent();
      // console.log(randomStudent);

      // validate students credentials
      const Is_valid = await StudentRegisterValidation(
        credentials["DataStudent"]
      );
      // check if fields validation are ok
      if (Is_valid) {
        const { value }: { value?: any } = Is_valid;
        const {
          Firstname,
          Lastname,
          _ID_User,
        }: { Firstname: string; Lastname: string; _ID_User: string } = value;
        // first check if student already exists
        const doc = await RegisterModelStudent.findOne()
          .where({ Firstname, Lastname })
          .select("Password");

        const COMPARE_HASH: boolean = await BCRYPT_COMPARE(
          `${Password}`,
          `${doc?.Password}`
        );
        if (doc && COMPARE_HASH) {
          res.status(200).json({
            message: "sorry! student already exists",
            success: false,
            exists: true,
          });
        } else if (!doc && !COMPARE_HASH) {
          const docCreate = await RegisterModelStudent.create(value);
          await docCreate.save();
          // tokenize students data
          const token = await tokenAuth(
            docCreate.toJSON(),
            `${Firstname} ${Lastname}`
          );
          // Todo: a refresh token is created lest the token gets expired so that it can be regenerated
          const TokenRefresh = await RefreshToken(
            docCreate.toJSON(),
            `${Firstname} ${Lastname}`
          );
          // store refresh token in redis server
          const Refresh_Token: string = "REFRESH_TOKEN";

          await REDIS_CLIENT.SET(Refresh_Token, JSON.stringify(TokenRefresh));

          return res
            .status(200)
            .json({ message: "successfully login", token, success: true });
          next();
        }
      }
    }

    if (isAdmin({ __status: `${statusKey}`, Info: AdminInfo })) {
      // validate students credentials
      const Is_Valid = await AdminRegisterValidation(credentials["DataAdmin"]);

      const randomAdmin = await UseRandomAdmin();
      // console.log(randomAdmin);

      // check whether fields validation is ok
      if (Is_Valid) {
        const { value }: { value?: any } = Is_Valid;

        const {
          Firstname,
          Lastname,
          _ID_User,
        }: { Firstname: string; Lastname: string; _ID_User: string } = value;

        // first check if admin already exists
        const doc = await RegisterModelAdmin.findOne()
          .where({ Firstname, Lastname })
          .select("Password");

        const COMPARE_HASH: boolean = await BCRYPT_COMPARE(
          `${Password}`,
          `${doc?.Password}`
        );

        if (doc && COMPARE_HASH) {
          res.status(200).json({
            message: "sorry! admin already exists",
            success: false,
            exists: true,
          });
        } else if (!__.isEqual("Admin124", PromoCode)) {
          res.status(200).json({
            message: "PROMO CODE is incorrect",
            code: false,
            success: false,
          });
        } else if (!doc && !COMPARE_HASH) {
          const docCreate = await RegisterModelAdmin.create(value);
          await docCreate.save();
          // tokenize the admin data
          const token = await tokenAuth(
            docCreate.toJSON(),
            `${Firstname} ${Lastname}`
          );
          // Todo: a refresh token is created lest the token gets expired so that it can be regenerated
          const TokenRefresh = await RefreshToken(
            docCreate.toJSON(),
            `${Firstname} ${Lastname}`
          );

          const Refresh_Token: string = "REFRESH_TOKEN";

          await REDIS_CLIENT.SET(Refresh_Token, JSON.stringify(TokenRefresh));

          res.status(200).json({
            message: "successfully LogIn",
            token,
            code: true,
            success: true,
          });
          next();
        }
      }
    }
  } catch (error) {
    throw createHttpError.NotFound(`error from the request at ${error}`);
    next(error);
  }
};

export const StudentAdminLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, email, password }: IInfoLogin<string> = await req.body;

    const status = await req.params.status;

    const InfoStudent: ILogin<string> = {
      __status: `${status}`,
      Data: { username, email, password },
    };
    const InfoAdmin: ILogin<string> = {
      __status: `${status}`,
      Data: { username, email, password },
    };

    if (isStudentLogin(InfoStudent)) {
      if (typeof username !== "undefined" && username) {
        const Is_valid = await StudentLoginValidation(password, username);

        const name: string[] | undefined = username?.split(" ");

        if (Is_valid) {
          const doc = await RegisterModelStudent.findOne({
            Firstname: name[0],
            Lastname: name[1],
          }).select("-Chat -Friends -Notifications");

          const Firstname: string = name[0];
          const Lastname: string = name[1];

          const COMPARE_HASH: boolean = await BCRYPT_COMPARE(
            `${password}`,
            `${doc?.Password}`
          );
          const FirstandLastname =
            Firstname === `${doc?.Firstname}` &&
            Lastname === `${doc?.Lastname}`;

          if (doc && COMPARE_HASH && FirstandLastname) {
            // create a token
            const token = await tokenAuth(
              doc.toJSON(),
              `${Firstname}${Lastname}`
            );
            // Todo: a refresh token is created lest the token gets expired so that it can be regenerated
            const TokenRefresh = await RefreshToken(
              doc.toJSON(),
              `${Firstname} ${Lastname}`
            );
            const Refresh_Token: string = "REFRESH_TOKEN";

            // store student refresh token in redis
            REDIS_CLIENT.SET(Refresh_Token, JSON.stringify(TokenRefresh));

            return res.status(200).json({
              message: `successfully login with username ${Firstname} ${doc?.Lastname}`,
              token,
              success: true,
              firstname: doc.Firstname,
              lastname: doc.Lastname,
            });
            next();
          } else {
            return res.status(200).json({
              message: `sorry! username or password is wrong`,
              success: false,
            });
          }
        }
      } else if (typeof email !== "undefined" && email) {
        const Is_valid = await StudentLoginValidation(password, email);

        // const rs = await UseRandomStudent();

        if (Is_valid) {
          const { value }: { value?: string } = Is_valid;
          const doc = await RegisterModelStudent.findOne({
            Email: email,
          }).select("-Chat -Friends -Notifications");

          const COMPARE_HASH: boolean = await BCRYPT_COMPARE(
            `${password}`,
            `${doc?.Password}`
          );

          const Email: boolean = __.isEqual(email, doc?.Email);

          if (doc && COMPARE_HASH && Email) {
            const TokenIssuer = doc?.Email?.match(/([a-zA-Z])+@ /g);
            // create a token
            const token = await tokenAuth(doc.toJSON(), `${TokenIssuer?.[0]}`);
            // Todo: a refresh token is created lest the token gets expired so that it can be regenerated
            const TokenRefresh = await RefreshToken(
              doc.toJSON(),
              `${TokenIssuer?.[0]}`
            );
            const Refresh_Token: string = "REFRESH_TOKEN";
            // store student refresh token in redis
            REDIS_CLIENT.SET(Refresh_Token, JSON.stringify(TokenRefresh));

            return res.status(200).json({
              message: `successfully login with email ${doc?.Email}`,
              token,
              success: true,
              firstname: doc.Firstname,
              lastname: doc.Lastname,
            });
            next();
          } else {
            return res.status(200).json({
              message: `sorry! email or password is wrong`,
              success: false,
            });
          }
        }
      }
    }

    if (isAdminLogin(InfoAdmin)) {
      if (typeof username !== "undefined" && username) {
        const Is_valid = await AdminLoginValidation(password, username);

        const name: string[] = username.split(" ");
        // check if admin fields are validated
        if (Is_valid) {
          // const rs = await UseRandomStudent();
          const doc = await RegisterModelAdmin.findOne({
            Firstname: name[0],
            Lastname: name[1],
          }).select("-Notifications");

          const Firstname: string = name[0];
          const Lastname: string = name[1];

          const COMPARE_HASH: boolean = await BCRYPT_COMPARE(
            `${password}`,
            `${doc?.Password}`
          );
          const FirstandLastname =
            Firstname === `${doc?.Firstname}` &&
            Lastname === `${doc?.Lastname}`;

          if (doc && COMPARE_HASH && FirstandLastname) {
            const token = await tokenAuth(doc.toJSON(), "romeus clarens");
            // Todo: a refresh token is created lest the token gets expired so that it can be regenerated
            const TokenRefresh = await RefreshToken(
              doc.toJSON(),
              `${Firstname} ${Lastname}`
            );
            const Refresh_Token: string = "REFRESH_TOKEN";

            // store student refresh token in redis
            REDIS_CLIENT.SET(Refresh_Token, JSON.stringify(TokenRefresh));

            return res.status(200).json({
              message: `successfully LogIn with username ${doc?.Firstname} ${doc?.Lastname}`,
              token,
              success: true,
              firstname: doc.Firstname,
              lastname: doc.Lastname,
            });
            next();
          } else {
            return res.status(200).json({
              message: `sorry! username or password is wrong`,
              success: false,
            });
          }
        }
      } else if (typeof email !== "undefined" && email) {
        const Is_valid = await AdminLoginValidation(email, password);

        // const rs = await UseRandomStudent();
        // check if admin fields are validated
        if (Is_valid) {
          const doc = await RegisterModelAdmin.findOne({
            Email: email,
          }).select("-Notifications");

          const COMPARE_HASH: boolean = await BCRYPT_COMPARE(
            `${password}`,
            `${doc?.Password}`
          );

          const Email: boolean = __.isEqual(email, doc?.Email);
          if (doc && COMPARE_HASH && Email) {
            const TokenIssuer: RegExpMatchArray | null | undefined =
              doc?.Email?.match(/([a-zA-Z])+@ /g);
            // create a token
            const token = await tokenAuth(doc.toJSON(), `${TokenIssuer?.[0]}`);
            // Todo: a refresh token is created lest the token gets expired so that it can be regenerated
            const TokenRefresh = await RefreshToken(
              doc.toJSON(),
              `${TokenIssuer?.[0]}`
            );
            const Refresh_Token: string = "REFRESH_TOKEN";

            // store student refresh token in redis
            await REDIS_CLIENT.SET(Refresh_Token, JSON.stringify(TokenRefresh));

            return res.status(200).json({
              message: `successfully login with email ${doc?.Email}`,
              token,
              success: true,
              firstname: doc.Firstname,
              lastname: doc.Lastname,
            });
            next();
          } else {
            return res.status(200).json({
              message: `sorry! email or password is wrong`,
              success: false,
            });
          }
        }
      }
    }
  } catch (error) {
    createHttpError.NotFound(`error is because of ${error}`);
    next(error);
  }
};

export const tokenVerification = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  /**
   * Todo ! what to note about the token
   * to retrieve use the token given by the client via the headers method
   */
  try {
    const authHeader = await req.headers["authorization"];
    // check if there's a header provided then cast the string containing the Bearer
    // and the token into an array then get the token at the indice 1 of the array
    const token = authHeader && authHeader.split(" ")[1];
    // check if token is empty
    if (!token) return;

    const decodeToken = await jwt.verify(token, `${process.env.ACCESS_TOKEN}`);
    // if token exist add it to the request to access it through other middlewares
    if (decodeToken) {
      req.user = decodeToken;
      next();
    }
  } catch (error) {
    throw new createHttpError.Conflict(`get errored at ${error}`);
    next(error);
  }
};

export const GetStudent = async (req: Request, res: Response) => {
  try {
    const doc = await RegisterModelStudent.find();
    if (doc) {
      res.status(200).json({ doc });
    }
  } catch (error) {
    createHttpError.NotFound(`${error}`);
  }
};

export const GetStudentInfo = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { id }: { id: string } = await req.params;
    const doc = await RegisterModelStudent.findOne({ _id: id }).select(
      "-Friends -Chat -__v -Notifications"
    );
    if (doc) {
      res.status(200).json({ doc });
    }
  } catch (error) {
    createHttpError.NotFound(`${error}`);
  }
};

export const CreateStudent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      Firstname,
      Lastname,
      Email,
      Password,
      ConfirmPassword,
      Class,
      Image,
      ClassName,
      SchoolLevel,
    }: IaddStudent<string> = await req.body;

    // using this pattern for generating robust User credentials security for incoming and outcoming data
    const LettersFromFirstname: string = Firstname.substring(0, 3);
    const LettersFromLastname: string = Lastname.substring(Lastname.length - 3);
    // get numbers and some characters at random
    const RandomDigits: number = Math.floor(Math.random() * 100_000);
    const Id_User: string = LettersFromFirstname.concat(
      RandomDigits.toString(),
      LettersFromLastname
    );

    // automatically calculating student note or average
    const NoteLevel: number = useNoteLevel(10, 100);

    // generating a salt of 10 bytes
    const hash: unknown = await BCRYPT_SALT(10);

    const PasswHash: string = await BCRYPT_HASH(Password, `${hash}`);

    const ConfirmPasswHash: string = await BCRYPT_HASH(
      ConfirmPassword,
      `${hash}`
    );
    // validate student credentials
    const Is_valid = await StudentRegisterValidation({
      _ID_User: Id_User,
      Firstname,
      Lastname,
      Email,
      Password: PasswHash,
      ConfirmPassword: ConfirmPasswHash,
      Image,
      Class,
      ClassName,
      SchoolLevel,
      NoteLevel,
    });

    // verify if all fields are validate
    if (Is_valid) {
      const { value }: { value?: any } = await Is_valid;
      // first check if student already exists
      const doc = await RegisterModelStudent.findOne()
        .where({ Firstname, Lastname })
        .select("Password ");

      const COMPARE_HASH = await BCRYPT_COMPARE(
        `${Password}`,
        `${doc?.Password}`
      );

      if (doc || COMPARE_HASH) {
        res.status(200).json({
          message: `student ${Firstname} ${Lastname} already exists`,
          success: false,
        });
      } else {
        const docCreate = await RegisterModelStudent.create(value);
        await docCreate.save();
        res.status(200).json({
          message: `${docCreate.Firstname} ${docCreate.Lastname} with success`,
          success: true,
        });
      }
    }
  } catch (error) {
    createHttpError.NotFound(`${error}`);
  }
};

export const EditStudent = async (req: Request, res: Response) => {
  try {
    const {
      _id,
      Firstname,
      Lastname,
      Email,
      Password,
      ConfirmPassword,
      Class,
      ClassName,
      Image,
      SchoolLevel,
    }: IUpdateStudent = await req.body;

    // using this pattern for generating robust User credentials security for incoming and outcoming data
    const LettersFromFirstname: string = Firstname.substring(0, 3);
    const LettersFromLastname: string = Lastname.substring(Lastname.length - 3);
    // get numbers and some characters at random
    const RandomDigits: number = Math.floor(Math.random() * 100_000);
    const Id_User: string = LettersFromFirstname.concat(
      RandomDigits.toString(),
      LettersFromLastname
    );

    // generating a salt of 10 bytes
    const hash: unknown = await BCRYPT_SALT(10);

    const PasswHash: string = await BCRYPT_HASH(Password, `${hash}`);

    const ConfirmPasswHash: string = await BCRYPT_HASH(
      ConfirmPassword,
      `${hash}`
    );
    // validate student credentials
    const Is_valid = await StudentRegisterValidation({
      _ID_User: Id_User,
      Firstname,
      Lastname,
      Email,
      Password: PasswHash,
      ConfirmPassword: ConfirmPasswHash,
      Image,
      Class,
      ClassName,
      SchoolLevel,
    });

    // verify if all fields are validated
    if (Is_valid) {
      const { value }: { value?: any } = await Is_valid;

      const doc = await RegisterModelStudent.findOneAndUpdate(value).where({
        _id,
      });
      await doc?.save();
      if (doc) {
        res.status(200).json({
          message: `${doc.Firstname} ${doc.Lastname} updated with success`,
          success: true,
        });
      }
    }
  } catch (error) {
    throw createHttpError.BadRequest(`${error}`);
  }
};

const EditProfile = async (req: Request, res: Response) => {
  const {
    _id,
    Firstname,
    Lastname,
    Email,
    DOB,
    Username,
    Password,
  }: IEditAccount = await req.body;

  try {
    const hash: unknown = await BCRYPT_SALT(10);
    const PasswHash: string = await BCRYPT_HASH(Password, `${hash}`);

    const doc = await RegisterModelStudent.findOneAndUpdate({
      Firstname,
      Lastname,
      Email,
      Username,
      Password: PasswHash,
      DOB,
    }).where({ _id });
  } catch (error) {
    throw new createHttpError[400](`${error}`);
  }
};

/*
? deleteOne deletes a doc then outputting 1 as the deleted doc length so i take it 
* and compare it with a value of 1 in the Customizer to make sure that there's really 
* a value deleted
*/
const CustomizerStudent = <T>(value: T, otherValue: T): boolean => {
  return value === otherValue;
};

export const DeleteStudent = async (req: Request<IDelete>, res: Response) => {
  const { id, id_user }: IDelete = await req.params;

  const doc = await RegisterModelStudent.deleteOne({
    _id: id,
    _ID_User: id_user,
  });
  // check if student deletes
  if (
    doc.acknowledged &&
    __.isEqualWith(doc.deletedCount, 1, CustomizerStudent)
  ) {
    res
      .status(200)
      .json({ message: "student deleted with success", success: true });
  }
};

export const GetAdmin = async (
  req: Request<{ limit: number }>,
  res: Response
) => {
  try {
    const adminLimit: number = req.params.limit;
    const doc = await RegisterModelAdmin.find()
      .select({ _v: 0 })
      .limit(adminLimit);
    if (doc) {
      res.status(200).json({ doc });
    }
  } catch (error) {
    createHttpError.NotFound(`${error}`);
  }
};

export const CreateAdmin = async (req: Request, res: Response) => {
  try {
    const {
      Firstname,
      Lastname,
      Image,
      Email,
      Password,
      ConfirmPassword,
      StatusLevel,
      PromoCode,
    }: IcreateAdmin<string> = await req.body;

    // using this pattern for generating robust User credentials security for incoming and outcoming data
    const LettersFromFirstname: string = Firstname.substring(0, 3);
    const LettersFromLastname: string = Lastname.substring(Lastname.length - 3);
    // get numbers and some characters at random
    const RandomDigits: number = Math.floor(Math.random() * 100_000);
    const Id_User: string = LettersFromFirstname.concat(
      RandomDigits.toString(),
      LettersFromLastname
    );

    // automatically calculating student note or average
    const NoteLevel: number = useNoteLevel(10, 100);

    // generating a salt of 10 bytes

    const hash: unknown = await BCRYPT_SALT(10);

    const PasswHash = await BCRYPT_HASH(Password, `${hash}`);

    const ConfirmPasswHash = await BCRYPT_HASH(ConfirmPassword, `${hash}`);
    // validate student credentials
    const Is_valid = await AdminRegisterValidation({
      _ID_User: Id_User,
      Firstname,
      Lastname,
      Email,
      Password: PasswHash,
      ConfirmPassword: ConfirmPasswHash,
      Image,
      StatusLevel,
      PromoCode,
    });

    // verify if all fields are validate
    if (Is_valid) {
      const { value }: { value?: any } = await Is_valid;
      // first check if student already exists
      const doc = await RegisterModelAdmin.findOne()
        .where({ Firstname, Lastname })
        .select("Password");

      const COMPARE_HASH: boolean = await BCRYPT_COMPARE(
        `${Password}`,
        `${doc?.Password}`
      );

      if (!isNil(doc) || COMPARE_HASH) {
        res.status(200).json({
          message: `${Firstname} ${Lastname} already exists`,
          success: false,
        });
      } else {
        const docCreate = await RegisterModelAdmin.create(value);
        await docCreate.save();
        res.status(200).json({
          message: `${docCreate.Firstname} ${docCreate.Lastname} created with success`,
          success: true,
        });
      }
    }
  } catch (error) {
    createHttpError.NotFound(`${error}`);
  }
};

export const EditAdmin = async (req: Request, res: Response) => {
  try {
    const {
      _id,
      Firstname,
      Lastname,
      Image,
      Email,
      Password,
      ConfirmPassword,
      StatusLevel,
      PromoCode,
    }: IUpdateAdmin = await req.body;

    // using this pattern for generating robust User credentials security for incoming and outcoming data
    const LettersFromFirstname: string = Firstname.substring(0, 3);
    const LettersFromLastname: string = Lastname.substring(Lastname.length - 3);
    // get numbers and some characters at random
    const RandomDigits: number = Math.floor(Math.random() * 100_000);
    const Id_User: string = LettersFromFirstname.concat(
      RandomDigits.toString(),
      LettersFromLastname
    );
    // generating the salt of 10 bytes
    const hash: unknown = await BCRYPT_SALT(10);

    const PasswHash: string = await BCRYPT_HASH(Password, `${hash}`);

    const ConfirmPasswHash: string = await BCRYPT_HASH(
      ConfirmPassword,
      `${hash}`
    );
    // validate student credentials
    const Is_valid = await AdminRegisterValidation({
      _ID_User: Id_User,
      Firstname,
      Lastname,
      Email,
      Password: PasswHash,
      ConfirmPassword: ConfirmPasswHash,
      Image,
      StatusLevel,
      PromoCode,
    });

    // verify if all fields are validated
    if (Is_valid) {
      const { value }: { value?: any } = await Is_valid;
      // update students in the doc
      const doc = await RegisterModelAdmin.findOneAndUpdate(value).where({
        _id,
      });
      await doc?.save();
      if (doc) {
        res.status(200).json({
          message: `${doc.Firstname} ${doc.Lastname} updated with success`,
          success: true,
        });
      }
    }
  } catch (error) {
    throw createHttpError.BadRequest(`${error}`);
  }
};

const Customizer = <T extends number>(value: T, otherValue: T): boolean => {
  return value === otherValue;
};

export const DeleteAdmin = async (req: Request<IDelete>, res: Response) => {
  const { id, id_user }: IDelete = await req.params;

  const doc = await RegisterModelAdmin.deleteOne({
    _id: id,
    _ID_User: id_user,
  });
  // check if admin deleted
  if (doc.acknowledged && __.isEqualWith(doc.deletedCount, 1, Customizer)) {
    res
      .status(200)
      .json({ message: "administrator deleted with success", success: true });
  }
};

// SENDMAIL with nodemailer
export const SendingMail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { DESTINATION, SUBJECT, HTMLBODY, MESSAGE }: IMail = await req.body;
    await sendMail(DESTINATION, SUBJECT, HTMLBODY, MESSAGE);

    const GetCode: RegExpMatchArray | null = HTMLBODY.match(/TA(?<code>[\d]+)/);

    res.status(200).json({
      code: GetCode?.groups?.code,
      success: true,
    });
    next();
  } catch (error) {
    throw new Error(`${error}`);
  }
};

// i'm using genSalt method to asynchronously generate the salt
// and after i use the hash method to hash the password
// like so --> hash(password,salt)
// generated already in the above code
