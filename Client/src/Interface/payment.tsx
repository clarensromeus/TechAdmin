import * as React from 'react';

interface IPayProps {
  Amount: number;
  open: string;
  setOpen: React.Dispatch<React.SetStateAction<string>>;
  _id: string;
  ID: string;
  Class: string;
  Firstname: string;
  Lastname: string;
  ClassName: string;
}

interface IPayment {
  payment_method_nonce: string;
  _id?: string;
  Amount: number;
  Fee?: string;
  ID: string;
  // Email: string;
  Class: string;
  Firstname: string;
  Lastname: string;
  ClassName: string;
}

interface IDelete {
  _id: string;
  ID: string;
}

interface IGetPayment {
  doc: Omit<IPayment, 'payment_method_nonce' | 'Amount'>[];
}

interface IPayResponse {
  success: boolean;
  message: string;
}

export type { IPayProps, IPayment, IPayResponse, IGetPayment, IDelete };
