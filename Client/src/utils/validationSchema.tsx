import { ObjectSchema, string, object, ref, StringSchema } from 'yup';

type LoginType<T> = {
  Login: {
    email: T;
    password: T;
  };
};

type LoginTypeUsername<T> = {
  Login: {
    username: T;
    password: T;
  };
};

type StudentRegisterType<T> = {
  StudentRegisteration: T;
};

const StudentValidation = (
  message: string,
  validation: string,
  matching: RegExp
) => {
  return object().shape({
    StudentLogin: object().shape({
      EmailorUsername: string()
        .required(`${message} must not be empty`)
        .matches(matching, validation)
        .trim(),
      Password: string()
        .required('password must not be empty')
        .matches(
          /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
          'enter a valid and strong password'
        )
        .min(10, 'password is too short')
        .max(30, 'password is too long'),
    }),
  });
};

const RegisterValidation = (
  message: string,
  validation: string,
  matching: RegExp,
  classOrpromocode: string,
  LevelorLevelstatus: string
) => {
  return object().shape({
    StudentRegisteration: object().shape({
      Firstname: string()
        .required('firstname must not be empty')
        .min(5, 'Firstname is too short')
        .trim(),
      Lastname: string()
        .required('lastname must not be empty')
        .min(6, 'Lastname is too short'),
      EmailorUsername: string()
        .required(`${message} must not be empty`)
        .matches(matching, validation)
        .trim(),
      ClassOrpromocode: string().required(classOrpromocode),
      LevelOrLevelstatus: string().required(LevelorLevelstatus),
      Password: string()
        .matches(
          /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
          'enter a valid and strong password'
        )
        .required('password must not be empty')
        .min(10, 'password is too short')
        .max(30, 'password is too long'),
      PasswordConfirmation: string()
        .required('password must be matched')
        .oneOf([ref('Password'), null], 'password do not match')
        .trim(),
    }),
  });
};

const ValidationSchemaStudentsForm = object().shape({
  StudentsRegisteration: object().shape({
    Firstname: string()
      .required('firstname is required')
      .min(5, 'Firstname is too short')
      .trim(),
    Lastname: string()
      .required('lastname is required')
      .min(6, 'Lastname is too short'),
    Email: string()
      .required('email is required')
      .matches(/^\b[\w-.]+@([\w-]+\.)+[\w-]{2,4}\b$/g, 'enter a valid email')
      .trim(),
    Password: string()
      .matches(
        /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
        'enter a valid and strong password'
      )
      .required('password must not be empty')
      .min(10, 'password is too short'),
    ConfirmPassword: string()
      .required('password do not match')
      .oneOf([ref('Password'), null], 'password do not match')
      .trim(),
    Class: string().required('class is required'),
    ClassName: string().required('classname is required'),
    SchoolLevel: string().required('select a level'),
  }),
});

const ValidationAdminForm = object().shape({
  AdminRegisteration: object().shape({
    Firstname: string()
      .required('firstname is required')
      .min(5, 'Firstname is too short')
      .trim(),
    Lastname: string()
      .required('lastname is required')
      .min(6, 'Lastname is too short'),
    Email: string()
      .required('email is required')
      .matches(/^\b[\w-.]+@([\w-]+\.)+[\w-]{2,4}\b$/g, 'enter a valid email')
      .trim(),
    Password: string()
      .matches(
        /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
        'enter a valid and strong password'
      )
      .required('password must not be empty')
      .min(10, 'password is too short'),
    ConfirmPassword: string()
      .required('password do not match')
      .oneOf([ref('Password'), null], 'password do not match')
      .trim(),
    StatusLevel: string().required('class is required'),
    PromoCode: string().required('enter promo code').min(5, 'wrong promo code'),
  }),
});

const ValidationTeacherForm = object().shape({
  TeacherRegisteration: object().shape({
    Firstname: string()
      .required('firstname is required')
      .min(5, 'Firstname is too short')
      .trim(),
    Lastname: string()
      .required('lastname is required')
      .min(6, 'Lastname is too short'),
    Email: string()
      .required('email must not be empty')
      .matches(/^\b[\w-.]+@([\w-]+\.)+[\w-]{2,4}\b$/g, 'enter a valid email')
      .trim(),
    HoursPerWeek: string().required('select number of hours'),
  }),
});

const ValidationCalendarForm = object().shape({
  CalendarRegisteration: object().shape({
    Class: string().required('select a class'),
    Teacher: string()
      .required('teacher name is required')
      .min(5, 'teacher name is too short')
      .trim(),
    ClassName: string()
      .required('classname is required')
      .min(6, 'classname is too short'),
    HoursPerWeek: string().required('enter hours'),
    Day: string().required('select a day'),
  }),
});

const ValidationPaymentForm = object().shape({
  AdminEdit: object().shape({
    Firstname: string()
      .required('firstname must be filled')
      .min(5, 'lastname is too short'),
    Lastname: string()
      .required('lastname must be filled')
      .min(5, 'lastname is too short')
      .trim(),
    Class: string().required('select a class').trim(),
    ClassName: string().required('Classname must be filled'),
    ID: string().required('enter an id'),
    Fee: string().required('enter the fee'),
  }),
});

const EditAccountForm = object().shape({
  AdminEdit: object().shape({
    Firstname: string().required('select a class'),
    Lastname: string()
      .required('teacher must not be empty')
      .min(5, 'teacher name is too short')
      .trim(),
    Email: string()
      .required('lastname must not be empty')
      .min(6, 'Lastname is too short'),
    Password: string()
      .matches(
        /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
        'enter a valid and strong password'
      )
      .required('password must not be empty')
      .min(10, 'password is too short')
      .max(40, 'password is too long'),
    Username: string().required('username must not be empty'),
    StatusLevel: string().required('select a status level'),
    DOB: string().required('select a date'),
  }),
});

const EmailValidation = object().shape({
  Email: string()
    .required('email must not be empty')
    .matches(/^\b[\w-.]+@([\w-]+\.)+[\w-]{2,4}\b$/g, 'enter a valid email'),
});

const ValidationPassword = object().shape({
  Password: string()
    .required('password must not be empty')
    .matches(
      /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/g,
      'enter a valid email'
    ),
});

const ValidationCode = object().shape({
  Code: string()
    .required('enter the correct code')
    .min(4, 'the field must be a 4-digits number'),
});

export {
  // ValidationSchemaLogin as Validate_Login,
  // ValidationSchemaLoginWithUsername as Validate_LoginWithUsername,
  StudentValidation as Validate_Login,
  RegisterValidation as Validate_Register,
  EmailValidation as Validate_Email,
  ValidationPassword as Validate_Password,
  ValidationCode as Validate_Code,
  ValidationSchemaStudentsForm as Validate_StudentsForm,
  ValidationTeacherForm as Validate_TeacherForm,
  ValidationAdminForm as Validate_AdminForm,
  ValidationCalendarForm as Validate_CalendarForm,
  EditAccountForm as Validate_EditForm,
  ValidationPaymentForm as Validate_payment,
};

// instead of using built-in email object validation of the Api i am
// using the matches object to validate email with effective RegEx syntax
