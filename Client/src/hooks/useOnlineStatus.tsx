import { useEffect, useState, useMemo, useContext } from 'react';
import { useMutation, UseMutationResult } from '@tanstack/react-query';
import axios from 'axios';
import { useRecoilValue } from 'recoil';
// external imports of ressources
import Context from '../Store/ContextApi';
import { IAuthState } from '../Interface/GlobalState';

interface IisOnline {
  _id: string;
  isOnline: boolean;
}

const useIsOnline = () => {
  const ContextData = useContext(Context);
  const [isOnline, setisOnline] = useState<boolean>(navigator.onLine);
  const AuthInfo = useRecoilValue<Partial<IAuthState>>(ContextData.GetAuthInfo);

  const onlineMutation: UseMutationResult<IisOnline, Error, IisOnline> =
    useMutation<IisOnline, Error, IisOnline>({
      mutationFn: async (data: IisOnline) => {
        // declare the url for the online status
        const Url: string = 'http://localhost:4000/home/student/Online';
        return axios.patch(Url, data);
      },
    });

  const onlineStatus = useMemo(
    () => ({
      online: isOnline,
    }),
    [isOnline]
  );

  useEffect(() => {
    // update network status
    const handleOnlineStatus = async () => {
      try {
        setisOnline(navigator.onLine);
        await onlineMutation.mutate({
          _id: `${AuthInfo.Payload?._id}`,
          isOnline,
        });
      } catch (error) {
        throw new Error();
      }
    };

    // listen to the online event
    window.addEventListener('online', handleOnlineStatus);
    // listen to the offline event
    window.addEventListener('offline', handleOnlineStatus);

    // clean up for re-rendering prevention
    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, [onlineStatus.online]);
};

export default useIsOnline;
