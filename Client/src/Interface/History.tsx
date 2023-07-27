interface ICreator {
  Status: string;
  Firstname: string;
  Lastname: string;
  Image: string;
}

interface IHistory<S> {
  ActionPerformer: string;
  NotiId: S;
  ActionCreator: ICreator;
  NotiReference: S;
  AlertText: S;
  User: string;
}

interface IhistoryResponse {
  message: string;
  success: boolean;
}

interface IActionPerformer {
  _id: string;
  Firstname: string;
  Lastname: string;
  Image: string;
}

interface IGetHistory {
  doc: {
    _id: string;
    ActionPerformer: IActionPerformer;
    ActionCreator: {
      Status: string;
      Firstname: string;
      Lastname: string;
    };
    NotiReference: string;
    NotiId: string;
    AlertText: string;
    createdAt: string;
    updateAt: string;
  }[];
}

interface Idelete {
  _id: string;
  NotiId: string;
  AdminID: string;
}

interface IdeleteResponse {
  message: string;
  success: boolean;
}

export type {
  IHistory,
  IhistoryResponse,
  IGetHistory,
  Idelete,
  IActionPerformer,
  IdeleteResponse,
};
