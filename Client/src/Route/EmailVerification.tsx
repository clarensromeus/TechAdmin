import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import grey from '@mui/material/colors/grey';
import { useFormik, FormikHelpers } from 'formik';
import FormLabel from '@mui/material/FormLabel';
import Button from '@mui/material/Button';
import { useMutation, UseMutationResult } from '@tanstack/react-query';
import {
  useNavigate,
  NavigateFunction,
  useLocation,
  Location,
} from 'react-router-dom';
import axios from 'axios';
import { ClipLoader } from 'react-spinners';
// externally crafted imports of ressources
import { CssTextField } from '../MuiStyles/Auth';
import { Validate_Email } from '../utils/validationSchema';
import fiveDigitCode from '../components/fiveDigitCode';
import { isCodeValid } from '../components/StateFromLocation';

interface Imail {
  Email: string;
}

type ISendMail = {
  DESTINATION: string;
  SUBJECT: string;
  HTMLBODY: string;
  MESSAGE: string;
};

type ISendMailResponse = {
  success: boolean;
  code: string;
};

const EmailVerification: React.FC = () => {
  // generating unique identifier
  const ID: string = React.useId();

  const location: Location = useLocation();
  const navigate: NavigateFunction = useNavigate();

  const codeFromEmail: number | undefined = fiveDigitCode(10000, 99999);

  /* eslint implicit-arrow-linebreak: ["off", "beside"] */
  const wait = (time: number): Promise<Promise<void>> =>
    new Promise((resolve) => setTimeout(resolve, time));

  const Formik = useFormik({
    initialValues: { Email: '' },
    validationSchema: Validate_Email,
    onSubmit: async (
      values: Imail,
      { setSubmitting }: FormikHelpers<Imail>
    ) => {
      await wait(1000);
      setSubmitting(false);
    },
  });

  const sendMail: UseMutationResult<ISendMailResponse, Error, ISendMail> =
    useMutation<ISendMailResponse, Error, ISendMail>({
      mutationFn: async (mailInfo: ISendMail) => {
        try {
          const response = await axios.post(
            'http://localhost:4000/sendmail',
            mailInfo
          );
          return response.data;
        } catch (error) {
          throw new Error(`${error}`);
        }
      },
      onSuccess: (newData: ISendMailResponse) => {
        if (
          isCodeValid(location.state) &&
          location.state.status === 'createPass'
        ) {
          navigate('/codeverification', {
            state: {
              passCode: location.state.passCode,
              status: location.state.status,
            },
          });
          window.localStorage.setItem(
            'CodeFromEmail',
            JSON.stringify({
              code: newData.code,
              expiry: new Date().getTime() + 1000 * 540,
            })
          );
        } else if (
          isCodeValid(location.state) &&
          location.state.status === 'forgotPass'
        ) {
          navigate('/codeverification', {
            state: {
              passCode: location.state.passCode,
              status: location.state.status,
            },
          });
          window.localStorage.setItem(
            'CodeFromEmail',
            JSON.stringify({
              code: newData.code,
              expiry: new Date().getTime() + 1000 * 540,
            })
          );

          window.localStorage.setItem(
            'USER_AUTH',
            JSON.stringify({ Email: Formik.values.Email })
          );
        }
      },
    });

  return (
    <>
      <Box
        p={10}
        display="flex"
        justifyContent="center"
        flexDirection="column"
        alignItems="center"
        textAlign="center"
      >
        <Box sx={{ width: 450 }}>
          <Typography
            fontWeight="bold"
            fontFamily="Courier New Monospace"
            fontSize={{ xs: '1.2em', sm: '1.2em', lg: '1.3em' }}
            sx={{ color: grey[900], lineHeight: (theme) => theme.spacing(3) }}
          >
            for the sake of your account privacy to confirm it is you
          </Typography>
        </Box>
        <Box pt={1}>
          <form
            onSubmit={async (event: React.FormEvent<HTMLFormElement>) => {
              try {
                event.preventDefault();
                await sendMail.mutate({
                  DESTINATION: `${Formik.values.Email}`,
                  SUBJECT: 'Confirmation code',
                  HTMLBODY: `<strong>Code</strong>: TA${codeFromEmail}`,
                  MESSAGE: 'TECHADMIN one kind for the whole world',
                });
              } catch (error) {
                throw new Error(`${error}`);
              }
            }}
          >
            <Box display="flex" flexDirection="column" sx={{ width: '320px' }}>
              <Box>
                <FormLabel sx={{ textAlign: 'start' }}>
                  <Typography
                    sx={{
                      pl: 1,
                      fontSize: '0.9rem',
                      color: `${grey[700]}`,
                      textTransform: 'capitalize',
                    }}
                  >
                    enter your email
                  </Typography>
                </FormLabel>
                <CssTextField
                  variant="outlined"
                  size="small"
                  id={`${ID}_email`}
                  name="Email"
                  fullWidth
                  value={Formik.values.Email}
                  onChange={Formik.handleChange}
                  error={Formik.touched.Email && Boolean(Formik.errors.Email)}
                  helperText={Formik.touched.Email && Formik.errors.Email}
                />
              </Box>
              <Box alignSelf="center" pt={1}>
                <Button type="submit" variant="contained" color="primary">
                  {sendMail.isLoading ? (
                    <ClipLoader
                      color="#fafafa"
                      loading={sendMail.isLoading}
                      size={12}
                      aria-label="Loading Spinner"
                      data-testid="loader"
                    />
                  ) : (
                    'Next step'
                  )}
                </Button>
              </Box>
            </Box>
          </form>
        </Box>
      </Box>
    </>
  );
};

export default EmailVerification;
