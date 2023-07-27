type IData<T> = {
  _ID_User: T;
  Firstname: T;
  Lastname: T;
  Email?: T;
  Password: T;
  ConfirmPassword: T;
  Image?: T;
};

interface Admin<T> {
  __status: "admin" | string;
  Info: IData<T>;
}

interface student<S> {
  __status: "student" | string;
  Info: IData<S>;
}

type Student_or_Admin<T> = Admin<T> | student<T>;

export const isAdmin = (
  Info: Student_or_Admin<string>
): Info is Admin<string> => {
  return Info.__status == "admin";
};

type AdminLogin<T> = {
  password: T;
  username?: T;
  email?: T;
};

interface AdminLog<T> {
  __status: "admin" | string;
  Data: AdminLogin<T>;
}

interface studentLog<S> {
  __status: "student" | string;
  Data: AdminLogin<S>;
}

export const isAdminLogin = (
  Info: AdminLog<string> | studentLog<string>
): Info is AdminLog<string> => {
  return Info.__status === "admin";
};
