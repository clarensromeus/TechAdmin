import __ from 'lodash';
import { IdataInfo } from '../Interface/interface';

const useData = <T extends string>(dataInfo: IdataInfo<T>) => {
  const {
    Firstname,
    Lastname,
    Email,
    Username,
    Password,
    ConfirmPassword,
    SchoolLevel,
    Class,
    Classname,
    Image,
    StatusLevel,
    PromoCode,
  } = dataInfo.Data;
  // if admin
  if (dataInfo.isAdmin) {
    // if admin wants to register with Email
    if (
      __.isBoolean(dataInfo.isEmailorUsername) &&
      __.isEqual(dataInfo.isEmailorUsername, true)
    ) {
      return {
        Firstname,
        Lastname,
        Email,
        Image,
        Password,
        ConfirmPassword,
        StatusLevel,
        PromoCode,
      };
    }
    // if admin wants to register with Username
    if (
      __.isBoolean(dataInfo.isEmailorUsername) &&
      __.isEqual(dataInfo.isEmailorUsername, false)
    ) {
      return {
        Firstname,
        Lastname,
        Username,
        Image,
        Password,
        ConfirmPassword,
        StatusLevel,
        PromoCode,
      };
    }
  }
  // if student
  if (!dataInfo.isAdmin) {
    // if student wants to register with Email
    if (
      __.isBoolean(dataInfo.isEmailorUsername) &&
      __.isEqual(dataInfo.isEmailorUsername, true)
    ) {
      return {
        Firstname,
        Lastname,
        Email,
        Image,
        Password,
        ConfirmPassword,
        SchoolLevel,
        Class,
        Classname,
      };
    }
    // if student wants to register with Username
    if (
      __.isBoolean(dataInfo.isEmailorUsername) &&
      __.isEqual(dataInfo.isEmailorUsername, false)
    ) {
      return {
        Firstname,
        Lastname,
        Username,
        Image,
        Password,
        ConfirmPassword,
        SchoolLevel,
        Class,
        Classname,
      };
    }
  }

  return {
    Firstname,
    Lastname,
    Email,
    Username,
    Password,
    ConfirmPassword,
    SchoolLevel,
    Class,
    Classname,
    Image,
    StatusLevel,
    PromoCode,
  };
};

export default useData;
