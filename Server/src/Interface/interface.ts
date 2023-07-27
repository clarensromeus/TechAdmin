interface IaddStudent<S> {
  Firstname: S;
  Lastname: S;
  Email: S;
  Password: S;
  ConfirmPassword: S;
  Class: S;
  Image: S;
  ClassName: S;
  SchoolLevel: S;
}

interface IcreateTeacher<S> {
  Firstname: S;
  Lastname: S;
  PhoneNumber: S;
  Email: S;
  Image?: S;
  HoursPerWeek: S;
}

interface IcreateAdmin<S> {
  Firstname: S;
  Lastname: S;
  Image: S;
  Email: S;
  Password: S;
  ConfirmPassword: S;
  StatusLevel: S;
  PromoCode: S;
}

interface ICalendar<T> {
  _id: T;
  Class: T;
  Day: T;
  ClassName: T;
  TeacherNumber: number;
  HoursPerWeek: T;
  Teacher: T;
}

interface IUpdateAdmin extends IcreateAdmin<string> {
  _id: string;
}

interface IUpdateStudent extends IaddStudent<string> {
  _id: string;
}

interface IUpdateTeacher extends IcreateTeacher<string> {
  _id: string;
}

interface IDelete {
  id: string;
  id_user: string;
}

export {
  IaddStudent,
  IUpdateStudent,
  IcreateTeacher,
  IUpdateTeacher,
  IDelete,
  IcreateAdmin,
  IUpdateAdmin,
  ICalendar,
};
