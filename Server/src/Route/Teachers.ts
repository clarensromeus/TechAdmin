// external imports of ressources
import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import isNil from "lodash/isNil";
import isEqualWith from "lodash/isEqualWith";
// internal crafted imports of ressources
import { RegisterModelTeacher } from "../models/index";
import { TeacherRegisterValidation } from "../utils/index";
import { IcreateTeacher, IUpdateTeacher } from "../Interface/interface";
import { IDelete } from "../Interface/interface";
import { UseRandomTeacher } from "../SeedTeacher";

export const GetTeachers = async (req: Request, res: Response) => {
  try {
    const doc = await RegisterModelTeacher.find().select({ _v: 0 });

    if (doc) {
      res.status(200).json({
        doc,
      });
    }
  } catch (error) {
    throw createHttpError.NotFound(`${error}`);
  }
};

export const CreateTeacher = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      Firstname,
      Lastname,
      Email,
      Image,
      PhoneNumber,
      HoursPerWeek,
    }: IcreateTeacher<string> = await req.body;

    // using this pattern for generating robust User credentials security for incoming and outcoming data
    const LettersFromFirstname: string = Firstname.substring(0, 3);
    const LettersFromLastname: string = Lastname.substring(Lastname.length - 3);
    // get numbers and some characters at random
    const RandomDigits: number = Math.floor(Math.random() * 100_000);
    const Id_User: string = LettersFromFirstname.concat(
      RandomDigits.toString(),
      LettersFromLastname
    );

    // validate student credentials
    const Is_valid: any = await TeacherRegisterValidation({
      _ID_User: Id_User,
      Firstname,
      Lastname,
      Email,
      Image,
      PhoneNumber,
      HoursPerWeek,
    });

    // verify if all fields are validated
    if (Is_valid) {
      const { value }: { value?: any } = await Is_valid;

      const doc = await RegisterModelTeacher.findOne({
        Firstname,
        Lastname,
      });

      // const randomTeacher = await UseRandomTeacher();
      // first check if student already exists
      if (!isNil(doc)) {
        res.status(200).json({
          message: `${doc.Firstname} ${doc.Lastname} already exist`,
          success: false,
        });
        next();
        // not already exists, do this
      } else {
        const docCreate = await RegisterModelTeacher.create(value);
        await docCreate.save();
        if (docCreate) {
          res.status(200).json({
            message: `${docCreate.Firstname} ${docCreate.Lastname} created with success`,
            success: true,
          });
          next();
        }
      }
    }
  } catch (error) {
    throw createHttpError.NotFound(`${error}`);
  }
};

export const EditTeacher = async (req: Request, res: Response) => {
  try {
    const {
      _id,
      Firstname,
      Lastname,
      Email,
      Image,
      PhoneNumber,
      HoursPerWeek,
    }: IUpdateTeacher = await req.body;

    // using this pattern for generating robust User credentials security for incoming and outcoming data
    const LettersFromFirstname: string = Firstname.substring(0, 3);
    const LettersFromLastname: string = Lastname.substring(Lastname.length - 3);
    // get numbers and some characters at random
    const RandomDigits: number = Math.floor(Math.random() * 100_000);
    const Id_User: string = LettersFromFirstname.concat(
      RandomDigits.toString(),
      LettersFromLastname
    );

    // validate student credentials
    const Is_valid = await TeacherRegisterValidation({
      _ID_User: Id_User,
      Firstname,
      Lastname,
      Email,
      Image,
      HoursPerWeek,
      PhoneNumber,
    });

    // verify if all fields are validated
    if (Is_valid) {
      const { value }: { value?: any } = await Is_valid;
      // update students in the db
      const doc = await RegisterModelTeacher.findOneAndUpdate(value).where({
        _id,
      });
      await doc?.save();
      if (doc) {
        res
          .status(200)
          .json({ message: "updated with success", success: true });
      }
    }
  } catch (error) {
    throw createHttpError.BadRequest(`${error}`);
  }
};

/* 
? deleteOne deletes a doc then outputting 1 as the doc length deleted so i got it 
* and compare it with a value of 1 in the Customizer to make sure that there's really a 
* a value deleted
*/
const Customizer = (value: number, otherValue: number) => {
  return value === otherValue;
};

export const DeleteTeacher = async (req: Request<IDelete>, res: Response) => {
  try {
    const { id, id_user }: IDelete = await req.params;

    const doc = await RegisterModelTeacher.deleteOne({
      _id: id,
      _ID_User: id_user,
    });
    // check if teacher deleted
    if (doc.acknowledged && isEqualWith(doc.deletedCount, 1, Customizer)) {
      res
        .status(200)
        .json({ message: "teacher deleted with success", success: true });
    }
  } catch (error) {
    throw createHttpError[400](`${error}`);
  }
};
