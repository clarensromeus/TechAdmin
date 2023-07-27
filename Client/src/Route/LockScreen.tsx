import * as React from 'react';
import Box from '@mui/material/Box';
import HttpsOutlinedIcon from '@mui/icons-material/HttpsOutlined';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useRecoilValue } from 'recoil';
import Button from '@mui/material/Button';
import { InputAdornment, Typography } from '@mui/material';
import red from '@mui/material/colors/red';
import { useNavigate, NavigateFunction } from 'react-router-dom';
import bcryptjs from 'bcryptjs';
import { CommentTextField } from '../MuiStyles/Auth';
// external imports of ressources
import { IAuthState } from '../Interface/GlobalState';
import Context from '../Store/ContextApi';

const LockScreen: React.FC = () => {
  const ContextData = React.useContext(Context);
  const [value, setValue] = React.useState<string>();

  const AuthInfo = useRecoilValue<Partial<IAuthState>>(ContextData.GetAuthInfo);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target as typeof event.target & {
      value: { value: string };
    };
    setValue(target.value);
  };

  const [isOk, setisOk] = React.useState<boolean>(false);

  const [visible, setVisible] = React.useState<{ showPassw: boolean }>({
    showPassw: false,
  });

  const handleShowPass = () => {
    setVisible({ showPassw: !visible.showPassw });
  };

  const navigate: NavigateFunction = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      // user passcode registered in db
      const hashPassword: string = `${AuthInfo.Payload?.Password}`;
      // compare the db user passcode with the new generated one
      // if passcode comparison is true unlock the previos screen
      const passcodeComparison = await bcryptjs.compare(
        `${value}`,
        hashPassword
      );
      if (passcodeComparison) {
        navigate(-1);
      }
      setisOk(true);
    } catch (error) {
      throw new Error(`${error}`);
    }
  };

  return (
    <>
      <Box
        pt={10}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <form onSubmit={handleSubmit}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Box>
              <HttpsOutlinedIcon
                sx={{ fontSize: '5em', color: 'text.secondary' }}
              />
            </Box>
            <Box>enter your password to unlock</Box>
            <Box pt={1} sx={{ width: 300, alignSelf: 'center' }}>
              <CommentTextField
                variant="outlined"
                type={visible.showPassw ? 'text' : 'password'}
                size="small"
                fullWidth
                value={value}
                onChange={handleChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Button
                        color="inherit"
                        disableRipple
                        disableElevation
                        onClick={handleShowPass}
                        sx={{
                          fontWeight: 'bold',
                          '&:hover': {
                            textDecoration: 'underline',
                          },
                        }}
                      >
                        {visible.showPassw ? (
                          <VisibilityOffIcon />
                        ) : (
                          <VisibilityIcon />
                        )}
                      </Button>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            {isOk && (
              <Box sx={{ textAlign: 'start' }}>
                <Typography
                  sx={{
                    color: red[600],
                    fontStyle: 'italic',
                    fontSize: '0.8em',
                  }}
                >
                  passwrod is incorrect
                </Typography>
              </Box>
            )}
          </Box>
        </form>
      </Box>
    </>
  );
};

export default LockScreen;
