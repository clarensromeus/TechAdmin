import { decodeToken } from 'react-jwt';
import { enqueueSnackbar } from 'notistack';
import {
  useMutation,
  UseMutationResult,
  useQuery,
  UseQueryResult,
  useQueryClient,
  QueryClient,
} from '@tanstack/react-query';
import Typography from '@mui/material/Typography';
import grey from '@mui/material/colors/grey';
import axios from 'axios';
import isEqual from 'lodash/isEqual';
import isAuthenticated from '../utils/isAuthenticated';
import {
  IHistory,
  IhistoryResponse,
  IGetHistory,
  Idelete,
  IdeleteResponse,
} from '../Interface/History';

const useHistory = () => {
  const tokenInfo: any = decodeToken(
    `${window.localStorage.getItem('TOKEN') || ''}`
  );

  const isAuth: boolean = isAuthenticated();
  const queryClient: QueryClient = useQueryClient();
  const History: UseMutationResult<
    IhistoryResponse,
    Error,
    IHistory<string>
  > = useMutation<IhistoryResponse, Error, IHistory<string>>({
    mutationFn: async (HistoryData: IHistory<string>) => {
      try {
        const url: string = 'http://localhost:4000/home/admin/histories';
        const res = await axios.post(url, HistoryData);
        return res.data;
      } catch (error) {
        throw new Error(`${error}`);
      }
    },
  });

  // retrieving all histories
  const { data }: UseQueryResult<IGetHistory, Error> = useQuery<
    IGetHistory,
    Error
  >({
    queryKey: ['histories'],
    queryFn: async () => {
      // get user token first before notifications
      const Url: string = 'http://localhost:4000/home/admin/gethistories';

      const res = await axios.get(Url);
      return res.data;
    },
    enabled: isAuth && isEqual(tokenInfo.PersonStatus, 'Admin'),
    // refetch query after every 1 second
    refetchInterval: 1000,
    // refetch query in background mode
    refetchIntervalInBackground: true,
  });

  const Delete = useMutation({
    mutationFn: async (DeleteData: Idelete) => {
      try {
        const response = await axios.delete(
          `http://localhost:4000/home/admin/history/${DeleteData._id}/${DeleteData.NotiId}/${DeleteData.AdminID}`
        );
        return response.data;
      } catch (error) {
        throw new Error(`${error}`);
      }
    },
    onSuccess: (newData: IdeleteResponse) => {
      queryClient.invalidateQueries({
        queryKey: ['histories'],
      });

      enqueueSnackbar(
        <Typography sx={{ color: grey[600], fontSeize: '0.6rem' }}>
          {newData.message}
        </Typography>,
        {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'center',
          },
          variant: isEqual(newData.success, true) ? 'success' : 'error',
          preventDuplicate: true, // prevent noti with the same message to display multiple times
        }
      );
    },
  });

  const CreateHistory = async (Data: IHistory<string>) => {
    try {
      History.mutate(Data);
    } catch (error) {
      throw new Error(`${error}`);
    }
  };

  const DeleteHistory = async <T extends string>(
    _id: T,
    NotiId: T,
    AdminID: T
  ) => {
    try {
      await Delete.mutate({ _id, NotiId, AdminID });
    } catch (error) {
      throw new Error(`${error}`);
    }
  };

  const GetHistory = () => {
    return data;
  };

  return {
    CreateHistory,
    GetHistory,
    DeleteHistory,
    isLoading: Delete.isLoading,
  };
};

export default useHistory;
