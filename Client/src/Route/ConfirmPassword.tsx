// internal imports of sources
import * as React from 'react';
// external imports of sources
import { Box, Typography, Button } from '@mui/material';
import FormLabel from '@mui/material/FormLabel';
import grey from '@mui/material/colors/grey';
import { useFormik, FormikHelpers } from 'formik';
import {
  useNavigate,
  NavigateFunction,
  useLocation,
  Location,
} from 'react-router-dom';
import red from '@mui/material/colors/red';
import __ from 'lodash';
// internal crafted imports of sources
import { Validate_Password } from '../utils/validationSchema';
import { CssTextField } from '../MuiStyles/Auth';
import { isCodeValid } from '../components/StateFromLocation';

type CredentialsType = {
  Password: string;
};

const ConfirmPassword: React.FC = () => {
  // generating unique identifier both on server and client side
  const ID = React.useId();
  const [code, setCode] = React.useState<{
    Passcode: string;
    status: string;
  }>();

  const Navigate: NavigateFunction = useNavigate();
  const location: Location = useLocation();

  /* eslint implicit-arrow-linebreak: ["off", "beside"] */
  const wait = (time: number): Promise<Promise<void>> =>
    new Promise((resolve) => setTimeout(resolve, time));
  // using useFormik helper method to create form with formik and Mui fields.
  const Formik = useFormik({
    initialValues: { Password: '' },
    validationSchema: Validate_Password,
    onSubmit: async (
      values: CredentialsType,
      { setSubmitting }: FormikHelpers<CredentialsType>
    ) => {
      await wait(1000);
      setSubmitting(false);
    },
  });

  const handleNextPage = async () => {
    try {
      const { Password }: { Password: string } = Formik.values;
      const student: boolean =
        __.isNil(Password) === false && Password.length > 5 && Formik.isValid;
      if (student && __.isEqual(code?.Passcode, Formik.values.Password)) {
        Navigate('/emailverification', {
          replace: true,
          state: { passCode: Formik.values.Password, status: code?.status },
        });
      }
    } catch (error) {
      throw new Error(`${error}`);
    }
  };

  // a boolean value determine if all fields are not error-prone
  const isValidated: boolean =
    !Formik.isValid ||
    (Object.keys(Formik.touched).length === 0 &&
      Formik.touched.constructor === Object);

  React.useEffect(() => {
    if (isCodeValid(location.state)) {
      setCode({
        Passcode: location.state.passCode,
        status: location.state.status,
      });
    }
  }, [code]);

  return (
    <div>
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
            fontSize={{ xs: '1em', sm: '1.4em', xl: '1.6em' }}
            sx={{ color: grey[900], lineHeight: (theme) => theme.spacing(3) }}
          >
            in order to continue with the registeration process
          </Typography>
        </Box>
        <Box pt={1}>
          <form onSubmit={Formik.handleSubmit}>
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
                    confirm your password
                  </Typography>
                </FormLabel>
                <CssTextField
                  type="password"
                  variant="outlined"
                  size="small"
                  id={`${ID}_password`}
                  name="Password"
                  fullWidth
                  value={Formik.values.Password}
                  onChange={Formik.handleChange}
                  error={
                    Formik.touched.Password && Boolean(Formik.errors.Password)
                  }
                  helperText={Formik.touched.Password && Formik.errors.Password}
                />
                {!isValidated && !__.isEqual(code, Formik.values.Password) && (
                  <Box pl={1} pt={1} sx={{ textAlign: 'start' }}>
                    <Typography
                      sx={{
                        color: red[700],
                        fontStyle: 'italic',
                        fontSize: '0.8em',
                      }}
                    >
                      passwords do not match
                    </Typography>
                  </Box>
                )}
              </Box>
              <Box alignSelf="center" pt={1}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  onClick={handleNextPage}
                >
                  next
                </Button>
              </Box>
            </Box>
          </form>
        </Box>
      </Box>
    </div>
  );
};

export default ConfirmPassword;
