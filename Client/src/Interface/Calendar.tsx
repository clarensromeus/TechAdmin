interface ICalendar<S> {
  Data: {
    _id: any;
    Class: S;
    Day: S;
    ClassName: S;
    TeacherNumber: S;
    Teacher: S;
    HoursPerWeek: S;
  }[];
}

interface Icreate<T> {
  Class: T;
  Day: T;
  ClassName: T;
  Teacher: T;
  TeacherNumber: T;
  HoursPerWeek: T;
}

interface Idelete {
  _id: string;
}

interface Idata<S> {
  _id: any;
  Class: S;
  Day: S;
  ClassName: S;
  TeacherNumber: S;
  Teacher: S;
  HoursPerWeek: S;
}

interface IdeleteResponse {
  message: string;
  success: boolean;
}

interface Iupdate extends Icreate<string> {
  _id: any;
}

interface IEditCalendar {
  Edit: Iupdate;
}

export type {
  ICalendar,
  Icreate,
  IEditCalendar,
  Idelete,
  IdeleteResponse,
  Idata,
};
