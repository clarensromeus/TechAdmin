interface IdataInfo<T> {
  isEmailorUsername: boolean;
  isAdmin: boolean;
  Data: {
    Firstname: T;
    Lastname: T;
    Email?: T;
    Username?: T;
    Password: T;
    ConfirmPassword: T;
    SchoolLevel?: T;
    Class?: T;
    Image?: T;
    Classname?: T;
    StatusLevel?: T;
    PromoCode?: T;
  };
}

interface IDrawer {
  DialogOpen: boolean;
  CloseDialog: () => void;
}

export type { IdataInfo, IDrawer };
