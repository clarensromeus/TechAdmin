import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import GitHubIcon from '@mui/icons-material/GitHub';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import axios from 'axios';
import { useNavigate, NavigateFunction } from 'react-router-dom';
import __ from 'lodash';

interface IRedirection {
  token?: string;
  userAuth: {
    Firstname: string;
    Lastname: string;
    Email: string;
    Image: string;
    Auth_Identity: string;
  };
}

const AuthRedirection: React.FC = () => {
  const { data }: UseQueryResult<IRedirection, Error> = useQuery({
    queryKey: ['auth'],
    queryFn: async () => {
      try {
        const response = await axios.get(
          'http://localhost:4000/auth/redirection'
        );
        return response.data;
      } catch (error) {
        throw new Error(`${error}`);
      }
    },
  });

  const navigate: NavigateFunction = useNavigate();

  const handleClickListerner = () => {
    if (!data) return;

    if (typeof data.token !== 'undefined') {
      window.localStorage.setItem('TOKEN', JSON.stringify(data.token));
      navigate('/home/dashboard', { replace: true });
    } else {
      window.localStorage.setItem('USER_AUTH', JSON.stringify(data.userAuth));
      navigate('/createPassword');
    }
  };

  return (
    <>
      <Box
        sx={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
        }}
      >
        <Box>
          <Box alignItems="center">
            {__.isEqual(data?.userAuth.Auth_Identity, 'GOOGLE') ? (
              <GoogleIcon color="error" sx={{ fontSize: 50 }} />
            ) : __.isEqual(data?.userAuth.Auth_Identity, 'FACEBOOK') ? (
              <FacebookIcon color="primary" sx={{ fontSize: 50 }} />
            ) : (
              <GitHubIcon color="warning" sx={{ fontSize: 50 }} />
            )}
          </Box>
          <Box>
            <Typography fontWeight="bold" sx={{ fontVariant: 'small-caps' }}>
              {' '}
              {__.isEqual(data?.userAuth.Auth_Identity, 'GOOGLE')
                ? 'Google'
                : __.isEqual(data?.userAuth.Auth_Identity, 'FACEBOOK')
                ? 'Facebook'
                : 'Github'}{' '}
              authentication
            </Typography>
          </Box>
          <Box>
            <Typography color="text.secondary">
              in case this poses no problem to you as a user, keep processing on
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              pt: 2,
              pl: 17,
            }}
          >
            <Button
              variant="text"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/login')}
            >
              No
            </Button>
            <Button
              variant="contained"
              sx={{
                border: 'none',
                outlined: 'none',
                boxShadow: 'none',
                borderRadius: 0,
              }}
              onClick={handleClickListerner}
            >
              Continue
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default AuthRedirection;
