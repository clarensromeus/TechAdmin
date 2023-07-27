import * as joi from "joi";

type IStudent<T> = T | number;

type IRegister<S> = {
  _ID_User: S;
  Firstname: S;
  Lastname: S;
  Email?: S;
  Password: IStudent<S>;
  ConfirmPassword: IStudent<S>;
  Class?: S;
  ClassName?: S;
  Image?: S;
  SchoolLevel: S;
  NoteLevel?: number;
};

type Admin<S> = {
  _ID_User: S;
  Firstname: S;
  Lastname: S;
  Email?: S;
  Password: S;
  ConfirmPassword: S;
  Image?: S;
  PromoCode?: S;
  StatusLevel?: S;
};

interface TeacherReg<S> {
  _ID_User: string;
  Firstname: S;
  Lastname: S;
  PhoneNumber: S;
  Email: S;
  Image?: S;
  HoursPerWeek: S;
}

interface ICalendar<S> {
  Class: S;
  Day: S;
  ClassName: S;
  TeacherNumber: number;
  HoursPerWeek: S;
  Teacher: S;
}

interface StudentLog<T> {
  username: T;
  password: T;
}

export const StudentLoginValidation = async <T>(
  password: T,
  username?: T,
  email?: T
): Promise<Promise<object>> => {
  try {
    const schema = await joi.object().keys({
      username: joi.string().optional().min(4).max(50),
      email: joi
        .string()
        .optional()
        .pattern(new RegExp(/^\b[\w-.]+@([\w-]+\.)+[\w-]{2,4}\b$/)),
      password: joi
        .string()
        .pattern(
          new RegExp(
            /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/
          )
        )
        .max(50)
        .required(),
    });

    const validate = await schema.validate(
      { username, password },
      { presence: "required" }
    );
    return validate;
  } catch (error) {
    throw new Error(`spot error at ${error}`);
  }
};

export const AdminLoginValidation = async <T>(
  username: T,
  password: T
): Promise<object> => {
  try {
    const schema = await joi.object().keys({
      username: joi.string().min(4).max(50).required(),
      password: joi
        .string()
        .pattern(
          new RegExp(
            /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/
          )
        )
        .max(50)
        .required(),
    });

    const validate = await schema.validate(
      { username, password },
      { presence: "required" }
    );
    return validate;
  } catch (error) {
    throw new Error(`spot error at ${error}`);
  }
};

export const StudentRegisterValidation = async <T extends string>(
  credentials: IRegister<T>
): Promise<Promise<object>> => {
  try {
    const schema = await joi.object().keys({
      _ID_User: joi.string().alphanum().min(5).max(50).required(),
      Firstname: joi.string().alphanum().min(4).max(50).required(),
      Lastname: joi.string().alphanum().min(4).max(50).required(),
      Email: joi
        .string()
        .pattern(new RegExp(/^\b[\w-.]+@([\w-]+\.)+[\w-]{2,4}\b$/))
        .max(30),
      Password: joi
        .string()
        .pattern(
          new RegExp(
            /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/
          )
        )
        .optional(),
      ConfirmPassword: joi.ref("Password"),
      Image: joi.string(),
      Class: joi.string().optional().alphanum(),
      ClassName: joi.string().optional().alphanum(),
      SchoolLevel: joi.string().alphanum().required(),
      NoteLevel: joi.number().optional().integer().positive(),
    });

    const validate = await schema.validate(credentials);

    return validate;
  } catch (error) {
    throw new Error(`spot error at ${error}`);
  }
};

export const TeacherRegisterValidation = async <T extends string>(
  credentials: TeacherReg<T>
): Promise<Promise<object>> => {
  try {
    const schema = await joi.object().keys({
      _ID_User: joi.string().alphanum().min(5).max(50).required(),
      Firstname: joi.string().alphanum().min(4).max(50).required(),
      Lastname: joi.string().alphanum().min(4).max(50).required(),
      Email: joi
        .string()
        .pattern(new RegExp(/^\b[\w-.]+@([\w-]+\.)+[\w-]{2,4}\b$/))
        .max(30),
      Image: joi.string().optional(),
      PhoneNumber: joi
        .string()
        .required()
        .pattern(
          new RegExp(/^[+]?[(]?[0-9]{3}[)]?[-s.]?[0-9]{3}[-s.]?[0-9]{4,6}$/)
        ),
      HoursPerWeek: joi.string().required().alphanum(),
    });

    const validate = await schema.validate(credentials);

    return validate;
  } catch (error) {
    throw new Error(`spot error at ${error}`);
  }
};

export const AdminRegisterValidation = async <T extends string>(
  credentials: Admin<T>
): Promise<Promise<object>> => {
  try {
    const schema = await joi.object().keys({
      _ID_User: joi.string().alphanum().min(6).max(50).required(),
      Firstname: joi.string().alphanum().min(4).max(30).required(),
      Lastname: joi.string().alphanum().min(4).max(30).required(),
      Email: joi
        .string()
        .pattern(new RegExp(/^\b[\w-.]+@([\w-]+\.)+[\w-]{2,4}\b$/))
        .max(30),
      Password: joi
        .string()
        .pattern(
          new RegExp(
            /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/
          )
        )
        .required(),
      ConfirmPassword: joi.ref("Password"),
      Image: joi.string(),
      PromoCode: joi.string().optional().alphanum(),
      StatusLevel: joi.string().optional(),
    });

    const validate = await schema.validate(credentials);

    return validate;
  } catch (error) {
    throw new Error(`spot error at ${error}`);
  }
};

export const CalendarValidation = async <T extends string>(
  Data: ICalendar<T>
): Promise<Promise<object>> => {
  try {
    const schema = await joi.object().keys({
      Class: joi.string().alphanum().min(6).max(50).required(),
      Day: joi.string().alphanum().min(4).max(30).required(),
      ClassName: joi.string().alphanum().min(4).max(30).required(),
      TeacherNumber: joi
        .string()
        .pattern(new RegExp(/^\b[\w-.]+@([\w-]+\.)+[\w-]{2,4}\b$/))
        .max(30),
      HoursPerWeek: joi.string().required(),
      Teacher: joi.string().required(),
    });

    const validate = await schema.validate(Data);

    return validate;
  } catch (error) {
    throw new Error(`spot error at ${error}`);
  }
};
