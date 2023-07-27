import { FormikTouched } from 'formik';

type AdminInfo<T> = {
  AdminRegisteration: {
    Firstname: T;
    Lastname: T;
    Email: T;
    Password: T;
    ConfirmPassword: T;
    StatusLevel: T;
    PromoCode: T;
  };
};

type Calendar<T> = {
  CalendarRegisteration: {
    Class: T;
    Teacher: T;
    HoursPerWeek: T;
    ClassName: T;
    Day: T;
  };
};

type Teacher<T> = {
  TeacherRegisteration: {
    Firstname: T;
    Lastname: T;
    Email: T;
    HoursPerWeek: T;
  };
};

type Login<S> = {
  StudentLogin: {
    EmailorUsername: S;
    Password: S;
  };
};

type Register<S> = {
  StudentRegisteration: {
    Firstname: S;
    Lastname: S;
    EmailorUsername: S;
    ClassOrpromocode: S;
    LevelOrLevelstatus: S;
    Password: S;
    PasswordConfirmation: S;
  };
};

const isValidated = <T extends FormikTouched<AdminInfo<string>>>(
  isValid: Boolean,
  touched: T,
  constructor: object
) => {
  const isValidate: boolean =
    !isValid || (Object.keys(touched).length === 0 && constructor === Object);

  return isValidate;
};

const isValidatedCalendar = <T extends FormikTouched<Calendar<string>>>(
  isValid: Boolean,
  touched: T,
  constructor: object
) => {
  const isValidate: boolean =
    !isValid || (Object.keys(touched).length === 0 && constructor === Object);

  return isValidate;
};

const isValidatedTeacher = <T extends FormikTouched<Teacher<string>>>(
  isValid: Boolean,
  touched: T,
  constructor: object
) => {
  const isValidate: boolean =
    !isValid || (Object.keys(touched).length === 0 && constructor === Object);

  return isValidate;
};

const isValidatedLogin = <T extends FormikTouched<Login<string>>>(
  isValid: Boolean,
  touched: T,
  constructor: object
) => {
  const isValidate: boolean =
    !isValid || (Object.keys(touched).length === 0 && constructor === Object);

  return isValidate;
};

const isValidatedRegister = <T extends FormikTouched<Register<string>>>(
  isValid: Boolean,
  touched: T,
  constructor: object
) => {
  const isValidate: boolean =
    !isValid || (Object.keys(touched).length === 0 && constructor === Object);

  return isValidate;
};

export {
  isValidated,
  isValidatedCalendar,
  isValidatedTeacher,
  isValidatedLogin,
  isValidatedRegister,
};

// the function only test if all fields of a form are validated before taking next steps like making
// a request using Formik library
