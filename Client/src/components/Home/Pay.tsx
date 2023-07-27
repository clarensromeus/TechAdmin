import * as React from 'react';
import { Box, Typography, Button } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import IconButton from '@mui/material/IconButton';
import {
  useMutation,
  UseMutationResult,
  useQuery,
  UseQueryResult,
  QueryClient,
  useQueryClient,
} from '@tanstack/react-query';
import axios from 'axios';
import 'braintree-web';
import DropIn from 'braintree-web-drop-in-react';
import { useRecoilValue } from 'recoil';
import { nanoid } from 'nanoid';
// internally crafted imports of ressources
import { IPayProps, IPayResponse, IPayment } from '../../Interface/payment';
import Context from '../../Store/ContextApi';
import { IAuthState } from '../../Interface/GlobalState';
import useWindowSize from '../../hooks/useWindowSize';
import { IWindow } from '../../Interface/student';
import useHistory from '../../hooks/useHistory';
import { IHistory } from '../../Interface/History';

interface IToken {
  token: string;
}

const Pay: React.FC<IPayProps> = ({
  Amount,
  open,
  setOpen,
  _id,
  Firstname,
  Lastname,
  ID,
  ClassName,
  Class,
}) => {
  const ContextData = React.useContext(Context);

  const [state, setState] = React.useState<{
    ClientToken: string;
    instance: any;
  }>({
    ClientToken: '',
    instance: '',
  });

  const AuthInfo = useRecoilValue<Partial<IAuthState>>(ContextData.GetAuthInfo);
  const queryClient: QueryClient = useQueryClient();
  const { width }: IWindow = useWindowSize();
  const { CreateHistory } = useHistory();

  const { data: Token }: UseQueryResult<IToken, Error> = useQuery<
    IToken,
    Error,
    IToken
  >({
    queryKey: ['TokenPayment'],
    queryFn: async () => {
      // declare the url
      const Url: string = 'http://localhost:4000/home/payment/token';
      const res = await axios.get<IToken>(Url);
      return res.data;
    },
  });

  const PaymentMutation: UseMutationResult<IPayResponse, Error, IPayment> =
    useMutation<IPayResponse, Error, IPayment>({
      mutationFn: async (PayInfo: IPayment) => {
        const res = await axios.post(
          'http://localhost:4000/home/payment/student',
          PayInfo
        );
        return res.data;
      },
      onSuccess() {
        // invalidate and refetch query to have fresh data after payment creation
        queryClient.invalidateQueries({
          queryKey: ['payments'],
        });
      },
    });

  const onPayment = async () => {
    try {
      const { nonce } = await state.instance.requestPaymentMethod();
      // send the customer nonce to the server
      await PaymentMutation.mutate({
        payment_method_nonce: nonce,
        Amount,
        Firstname,
        Lastname,
        ID,
        ClassName,
        Class,
      });

      // data for creating histories
      const HistoryData: IHistory<string> = {
        ActionPerformer: `${AuthInfo.Payload?._id}`,
        NotiId: `${nanoid()}`,
        ActionCreator: {
          Status: 'Student',
          Firstname,
          Lastname,
          Image: '',
        },
        NotiReference: 'paid',
        AlertText: `paid a total of ${Amount}$ by `,
        User: '64bb0a381e5ce1722e328401', // the platform administrator id
      };
      CreateHistory(HistoryData);
    } catch (error) {
      throw new Error(`${error}`);
    }
  };

  React.useEffect(() => {
    if (!Token) return;
    // get token payment token from the server
    if (Token) {
      setState({ ...state, ClientToken: `${Token.token}` });
    }
  }, [Token]);

  return (
    <>
      <Box
        sx={{
          width: '100%',
          height: '100%',
          display: open,
          justifyContent: 'center',
          alignItems: 'center',
          position: 'fixed',
          bgcolor: 'rgb(0,0,0,0.4)',
          zIndex: (theme) => theme.zIndex.drawer + 1,
          top: '0%',
          left: '0%',
        }}
      >
        <Box>
          <Box
            sx={{
              width: width && width < 700 ? '100%' : 450,
              height: 450,
              bgcolor: '#fafafa',
            }}
          >
            <Box>
              <IconButton
                onClick={() => {
                  setOpen('none');
                }}
              >
                <ArrowForwardIcon sx={{ color: 'black' }} />
              </IconButton>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography fontWeight="bold" fontSize="1.1em">
                Total Fee :{' '}
                <span style={{ color: 'grey', fontWeight: 'bold' }}>5000$</span>
              </Typography>
            </Box>
            {state.ClientToken ? (
              <Box>
                <DropIn
                  options={{ authorization: state.ClientToken }}
                  onInstance={(instance) => setState({ ...state, instance })}
                />
                <Button
                  fullWidth
                  variant="contained"
                  onClick={onPayment}
                  sx={{ fontWeight: 'bold' }}
                >
                  pay
                </Button>
              </Box>
            ) : (
              <Box>
                <Typography>Loading...</Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Pay;
