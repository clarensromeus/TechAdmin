import { createContext } from 'react';
import { AuthState } from './Data';
import { GetAuthInfo } from './Selectors';

const InitialData = {
  AuthState,
  GetAuthInfo,
};

type IData = typeof InitialData;

// define the context
const Context = createContext<IData>({} as IData);

export default Context;
