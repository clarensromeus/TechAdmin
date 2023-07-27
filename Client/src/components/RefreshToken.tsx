import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import axios from 'axios';
import { useNavigate, NavigateFunction } from 'react-router-dom';
import { isExpired } from 'react-jwt';
import __ from 'lodash';

interface IRefreshToken {
  success: boolean;
  token: string;
}

const RefreshToken: React.FC = () => {
  const navigate: NavigateFunction = useNavigate();

  const { data, status, refetch }: UseQueryResult<IRefreshToken, Error> =
    useQuery<IRefreshToken, Error>({
      queryFn: async () => {
        return (await axios.get('http://localhost:4000/refreshToken')).data;
      },
      enabled: false,
      retry: 1, // retry only once if failed
    });

  const token: string | null = JSON.parse(`${localStorage.getItem('TOKEN')}`);

  React.useEffect(() => {
    if (!token) return;
    if (status === 'success') {
      if (!__.isUndefined(token) && isExpired(token)) {
        // reevaluate the expired token with a fresh one for high data security against
        // malware attacks like csrf(CROSS SITE RESSOURCES FORGERY)
        window.localStorage.setItem('TOKEN', JSON.stringify(`${data?.token}`));
        navigate('/home/dashboard');
      }
    }
  }, []);

  return (
    <>
      <Box
        sx={{
          width: '100%',
          height: 'calc(100vh - 64px)',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            width: 400,
            textAlign: 'center',
            pt: 10,
          }}
        >
          <Box>
            <Typography
              fontWeight="bold"
              fontSize="max(1.7rem, .9rem)"
              textTransform="capitalize"
            >
              recover token
            </Typography>
          </Box>
          <Box>
            <Typography color="text.secondary">
              for the sake of security of your sensitive data refresh token to
              login again
            </Typography>
          </Box>
          <Box py={1}>
            <Button
              variant="contained"
              sx={{
                boxShadow: 'none',
                borderRadius: 0,
              }}
              onClick={() => {
                refetch();
              }}
            >
              Refresh
            </Button>
          </Box>
          <Divider sx={{ pt: 2 }} />
          <Box p={1}>
            <Typography
              fontWeight="bold"
              fontSize="max(1.7rem, .9rem)"
              textTransform="capitalize"
            >
              reauthenticate
            </Typography>
          </Box>
          <Box>
            <Typography color="text.secondary">
              if refreshing sensitive data is not really your tea cup instead,
              try to
            </Typography>
          </Box>
          <Box pt={1}>
            <Button
              variant="outlined"
              color="warning"
              sx={{ boxShadow: 'none', borderRadius: 0 }}
              onClick={() => {
                // if end user wish is to reauthenticated, remove expired token
                // and navigate him(her) back to login page
                window.localStorage.removeItem('TOKEN');
                navigate('/login');
              }}
            >
              reauthenticate
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default RefreshToken;
