// internal imports of sources
import * as React from 'react';
// external imports of sources
import { Paper, Box, Typography } from '@mui/material';
import { FC } from 'react';
import grey from '@mui/material/colors/grey';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import { Navigate } from 'react-router-dom';
// internal crafted imports of sources
import UserLogIn from '../components/confirmation/LoginForm';

type EXACTNESS = 'bottom' | 'top' | 'start' | 'end';

// value of the label placement of the radio button
const LABEL_VALUE: EXACTNESS = 'start';

const Login: FC = () => {
  const [selectedValue, setSelectedValue] = React.useState<string>('top');

  const handleChangeRadio = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target && (event.target as { value: string });

    setSelectedValue(target.value);
  };

  const token: string | null = window.localStorage.getItem('TOKEN');

  return (
    <div>
      {token ? (
        Navigate({ to: '/home/dashboard' })
      ) : (
        <Box sx={{ width: '100vw', height: '100vh' }}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%,-45%)',
            }}
          >
            <Paper elevation={3} sx={{ borderRadius: '10%' }}>
              <Box
                sx={{
                  width: '360px',
                  borderRadius: '10%',
                }}
              >
                <Box
                  sx={{ maxHeight: '200px' }}
                  pt={2}
                  display="flex"
                  justifyContent="center"
                >
                  <Box pt={1}>
                    <Typography
                      fontFamily="monospace"
                      fontWeight="bold"
                      textTransform="uppercase"
                      fontSize="1.5em"
                      sx={{ color: grey[800] }}
                    >
                      {' '}
                      login (student | admin)
                    </Typography>
                  </Box>
                </Box>
                <Box
                  sx={{
                    pt: 1,
                    display: 'flex',
                    justifyContent: 'flex-start',
                  }}
                >
                  <Box pl={2} sx={{ pt: '8px' }}>
                    <Typography
                      sx={{
                        color: grey[800],
                        fontWeight: 'bold',
                      }}
                    >
                      Login with
                    </Typography>
                  </Box>
                  <Box>
                    <FormControl>
                      <RadioGroup
                        row
                        aria-labelledby="demo-form-control-label-placement"
                        name="position"
                        defaultValue="top"
                      >
                        <FormControlLabel
                          value="top"
                          control={
                            <Radio
                              color="success"
                              onChange={(e) => handleChangeRadio(e)}
                              sx={{
                                color: grey[800],
                                '&.Mui-checked': {
                                  color: '#64b5f6',
                                },
                              }}
                            />
                          }
                          label={
                            <Typography
                              fontWeight="bold"
                              sx={{ fontVariant: 'small-caps' }}
                            >
                              Email
                            </Typography>
                          }
                          labelPlacement={LABEL_VALUE}
                          sx={{
                            '& .MuiFormControlLabel-label': {
                              color: grey[800],
                              fontWeight: 'bold',
                            },
                          }}
                        />
                        <FormControlLabel
                          value="start"
                          control={
                            <Radio
                              color="success"
                              onChange={(e) => handleChangeRadio(e)}
                              sx={{
                                color: grey[700],
                                '&.Mui-checked': {
                                  color: '#64b5f6',
                                },
                              }}
                            />
                          }
                          label={
                            <Typography
                              fontWeight="bold"
                              sx={{ fontVariant: 'small-caps' }}
                            >
                              Username
                            </Typography>
                          }
                          labelPlacement={LABEL_VALUE}
                          sx={{
                            '& .MuiFormControlLabel-label': {
                              color: grey[700],
                              fontWeight: 'bold',
                            },
                          }}
                        />
                      </RadioGroup>
                    </FormControl>
                  </Box>
                </Box>
                <UserLogIn UsernameorEmail={selectedValue} />
              </Box>
            </Paper>
          </Box>
        </Box>
      )}
    </div>
  );
};

export default Login;
