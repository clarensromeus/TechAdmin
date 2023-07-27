// internal imports of sources
import * as React from 'react';
// external imports of sources
import { Box, Typography, Button } from '@mui/material';
import FormLabel from '@mui/material/FormLabel';
import InputAdornment from '@mui/material/InputAdornment';
import grey from '@mui/material/colors/grey';
import { useFormik, FormikHelpers } from 'formik';
import { useNavigate } from 'react-router-dom';
import __ from 'lodash';
// internal crafted imports of sources
import { Validate_Password } from '../utils/validationSchema';
import { CssTextField } from '../MuiStyles/Auth';

type CredentialsType = {
  Password: string;
};

const CreatePassword: React.FC = () => {
  const [visible, setVisible] = React.useState<{ showPassw: boolean }>({
    showPassw: false,
  });

  const handleShowPass = () => {
    setVisible({ showPassw: !visible.showPassw });
  };
  // creating unique identifier
  const ID = React.useId();

  const navigate = useNavigate();

  /* eslint implicit-arrow-linebreak: ["off", "beside"] */
  const wait = (time: number): Promise<Promise<void>> =>
    new Promise((resolve) => setTimeout(resolve, time));
  // using useFormik helper function to create form with formik and Mui fields.
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

  const handleNextField = () => {
    const { Password }: { Password: string } = Formik.values;
    // check if field is not undefined and already validated
    const student: boolean =
      __.isNil(Password) === false && Password.length > 7 && Formik.isValid;
    if (student) {
      navigate('/confirmation', {
        replace: true,
        state: { passCode: Formik.values.Password, status: 'createPass' },
      });
    }
  };

  return (
    <div>
      <Box
        p={10}
        display="flex"
        justifyContent="center"
        flexDirection="column"
        alignItems="center"
      >
        <Box
          sx={{
            width: { xs: 320, sm: 320, lg: 460 },
            textAlign: { xs: 'start', sm: 'start', lg: 'center' },
          }}
        >
          <Typography
            fontWeight="bold"
            fontFamily="Courier New Monospace"
            fontSize={{ xs: '1em', sm: '1.3em', xl: '1.6em' }}
            sx={{ color: grey[900], lineHeight: (theme) => theme.spacing(3) }}
          >
            in order to continue with the registeration process
          </Typography>
        </Box>
        <Box pt={{ xs: 1, sm: 1, lg: 2 }}>
          <form onSubmit={Formik.handleSubmit}>
            <Box display="flex" flexDirection="column" sx={{ width: '320px' }}>
              <Box>
                <FormLabel sx={{ textAlign: 'start' }}>
                  <Typography
                    sx={{
                      fontSize: '0.9rem',
                      color: `${grey[700]}`,
                      textTransform: 'capitalize',
                    }}
                  >
                    enter your password
                  </Typography>
                </FormLabel>
                <CssTextField
                  type={visible.showPassw ? 'text' : 'password'}
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
                          {visible.showPassw ? 'hide' : 'show'}
                        </Button>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
              <Box alignSelf="center" pt={1}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  onClick={handleNextField}
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

export default CreatePassword;
