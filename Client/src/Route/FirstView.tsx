// external imports of ressources
import * as React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import grey from '@mui/material/colors/grey';
import orange from '@mui/material/colors/orange';
import { Navigate } from 'react-router-dom';

const FirstView: React.FC = () => {
  const token: string | null = window.localStorage.getItem('TOKEN');

  return (
    <div>
      {token ? (
        Navigate({ to: '/home/dashboard' })
      ) : (
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',

            textAlign: 'center',
          }}
        >
          <Box sx={{}}>
            <Typography
              fontFamily="Roboto"
              component="span"
              fontSize="2em"
              sx={{ color: grey[900] }}
            >
              welcome to
            </Typography>
            <Typography
              component="span"
              pl={2}
              fontSize="2em"
              fontFamily="Roboto"
              sx={{ color: orange[900], fontStyle: 'italic' }}
            >
              techAdmin
            </Typography>
          </Box>
          <Box>
            <Typography color="success">
              In order to see and have access to all contents of the School
            </Typography>
          </Box>
          <Box>
            <Button disableRipple>
              <Link
                to="/login"
                style={{
                  fontFamily: 'Roboto',
                  fontWeight: 'bold',
                  color: 'green',
                }}
              >
                clik to login
              </Link>
            </Button>
          </Box>
        </Box>
      )}
    </div>
  );
};

export default FirstView;
