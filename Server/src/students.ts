type IData<T> = {
  Firstname: T;
  Lastname: T;
  Email?: T;
  Password: T;
  ConfirmPassword: T;
  Image?: T;
  SchoolLevel: T;
};

interface Admin<T> {
  __status: "admin" | string;
  Info: IData<T>;
}

interface Student<S> {
  __status: "student" | string;
  Info: IData<S>;
}

type Student_or_Admin<T> = Admin<T> | Student<T>;

export const isStudent = (
  Info: Student_or_Admin<string>
): Info is Student<string> => {
  return Info.__status === "student";
};

type Login<T> = {
  username?: T;
  email?: T;
  password: T;
};

interface AdminLog<T> {
  __status: "admin" | string;
  Data: Login<T>;
}

interface StudentLog<S> {
  __status: "student" | string;
  Data: Login<S>;
}

export const isStudentLogin = (
  Info: StudentLog<string> | AdminLog<string>
): Info is StudentLog<string> => {
  return Info.__status === "student";
};
