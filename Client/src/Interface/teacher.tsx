interface Idelete {
  _id: any;
  _ID_User: string;
}

interface IdeleteResponse {
  message: string;
  success: boolean;
}

type Idata = {
  _id: any;
  _ID_User: string;
  Firstname: string;
  Lastname: string;
  Email: string;
  Image: string;
  HoursPerWeek: string;
  PhoneNumber: string;
};

type IEditTeacher = {
  Edit: Omit<Idata, 'Image'>;
};

type Icreate = {
  Firstname: string;
  Lastname: string;
  Email: string;
  Image: string;
  HoursPerWeek: string;
  PhoneNumber: string;
};

interface Iteachers<S> {
  doc: {
    _id: S;
    _ID_User: S;
    Firstname: S;
    Lastname: S;
    Email: S;
    Image: S;
    HoursPerWeek: S;
    PhoneNumber: S;
  }[];
}

type teacherInfo<T> = {
  TeacherRegisteration: {
    Firstname: T;
    Lastname: T;
    Email: T;
    HoursPerWeek: T;
  };
};

interface IResponse {
  message: string;
  success: boolean;
}

interface IState {
  open: boolean;
  message: string;
}

export type {
  Idelete,
  IdeleteResponse,
  Idata,
  Icreate,
  IEditTeacher,
  Iteachers,
  IResponse,
  IState,
  teacherInfo,
};
