import * as React from 'react';
import { useId } from 'react';
import { Box, Typography, Button } from '@mui/material';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { useFormik, FormikHelpers } from 'formik';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import EditIcon from '@mui/icons-material/Edit';
import MenuItem from '@mui/material/MenuItem';
import orange from '@mui/material/colors/orange';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import PaidIcon from '@mui/icons-material/Paid';
import InputAdornment from '@mui/material/InputAdornment';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { isUndefined } from 'lodash';
// internal crafted imports of ressources
import { Validate_payment } from '../../utils/validationSchema';
import Pay from './Pay';
import { IPayProps, IPayment } from '../../Interface/payment';

type PaymentInfo<T> = {
  PaymentProcess: {
    Firstname: T;
    Lastname: T;
    Classname: T;
    Class: T;
    ID: T;
    Fee: T;
  };
};

const PaymentForm: React.FC<
  Omit<IPayment, 'payment_method_nonce' | 'Amount'>
> = ({ _id, ID, Firstname, Lastname, Fee, Class, ClassName }) => {
  // for generating unique id both on client and server side
  const Id = useId();

  const [open, setOpen] = React.useState<string>('none');

  /* eslint implicit-arrow-linebreak: ["off", "beside"] */
  const Sleep = (time: number): Promise<Promise<void>> =>
    new Promise((resolve) => setTimeout(resolve, time));

  const Formik = useFormik({
    initialValues: {
      PaymentProcess: {
        Firstname,
        Lastname,
        Classname: ClassName,
        Class,
        ID,
        Fee: isUndefined(Fee) ? '' : `${Fee}`,
      },
    },
    validationSchema: Validate_payment,
    enableReinitialize: true,
    onSubmit: async (
      values: PaymentInfo<string>,
      { setSubmitting }: FormikHelpers<PaymentInfo<string>>
    ) => {
      Sleep(2000);
      setSubmitting(false);
    },
  });

  const PayState: IPayProps = {
    Amount: Number(Formik.values.PaymentProcess.Fee),
    open,
    setOpen,
    _id: `${_id}`,
    Firstname: Formik.values.PaymentProcess.Firstname,
    Lastname: Formik.values.PaymentProcess.Lastname,
    ID: Formik.values.PaymentProcess.ID,
    Class: Formik.values.PaymentProcess.Class,
    ClassName: Formik.values.PaymentProcess.Classname,
  };

  return (
    <div>
      <Pay {...PayState} />
      <Paper elevation={1}>
        <Box p={2}>
          <Typography fontFamily="Andale Mono, monospace">
            personal information
          </Typography>
        </Box>
        <Divider />
        <Box pt={2}>
          {' '}
          <form onSubmit={Formik.handleSubmit}>
            <Grid container justifyContent="center" spacing={2}>
              <Grid container item xs={10} spacing={1}>
                <Grid item xs={6}>
                  <Box>
                    <TextField
                      type="text"
                      variant="outlined"
                      size="small"
                      id={`${Id}_Firstname`}
                      name="PaymentProcess.Firstname"
                      value={Formik.values.PaymentProcess?.Firstname}
                      onChange={Formik.handleChange}
                      fullWidth
                      placeholder="ClassName.."
                      error={
                        Formik.touched.PaymentProcess?.Firstname &&
                        Boolean(Formik.errors.PaymentProcess?.Firstname)
                      }
                      helperText={
                        Formik.touched.PaymentProcess?.Firstname &&
                        Formik.errors.PaymentProcess?.Firstname
                      }
                    />
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box>
                    <TextField
                      type="text"
                      variant="outlined"
                      size="small"
                      id={`${Id}_Lastname`}
                      name="PaymentProcess.Lastname"
                      value={Formik.values.PaymentProcess?.Lastname}
                      onChange={Formik.handleChange}
                      fullWidth
                      placeholder="Teacher.."
                      error={
                        Formik.touched.PaymentProcess?.Lastname &&
                        Boolean(Formik.errors.PaymentProcess?.Lastname)
                      }
                      helperText={
                        Formik.touched.PaymentProcess?.Lastname &&
                        Formik.errors.PaymentProcess?.Lastname
                      }
                    />
                  </Box>
                </Grid>
              </Grid>
              <Grid item xs={10}>
                <Box>
                  <TextField
                    type="text"
                    variant="outlined"
                    size="small"
                    id={`${Id}_Email`}
                    name="PaymentProcess.Classname"
                    value={Formik.values.PaymentProcess?.Classname}
                    onChange={Formik.handleChange}
                    fullWidth
                    placeholder="classname..."
                    error={
                      Formik.touched.PaymentProcess?.Classname &&
                      Boolean(Formik.errors.PaymentProcess?.Classname)
                    }
                    helperText={
                      Formik.touched.PaymentProcess?.Classname &&
                      Formik.errors.PaymentProcess?.Classname
                    }
                  />
                </Box>
              </Grid>
              <Grid item xs={10}>
                <FormControl fullWidth>
                  <Select
                    id={`${Id}_Class`}
                    size="small"
                    name="PaymentProcess.Class"
                    value={Formik.values.PaymentProcess?.Class}
                    onChange={Formik.handleChange}
                  >
                    <MenuItem value="1st grade">1st grade</MenuItem>
                    <MenuItem value="2st grade">2nd grade</MenuItem>
                    <MenuItem value="3st grade">3th grade</MenuItem>
                    <MenuItem value="4st grade">4th grade</MenuItem>
                    <MenuItem value="5st grade">5th grade</MenuItem>
                    <MenuItem value="6st grade">6th grade</MenuItem>
                    <MenuItem value="7st grade">6th grade</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={10}>
                <Box>
                  <TextField
                    type="text"
                    variant="outlined"
                    size="small"
                    id={`${Id}_PersonalID`}
                    name="PaymentProcess.ID"
                    value={Formik.values.PaymentProcess?.ID}
                    onChange={Formik.handleChange}
                    fullWidth
                    placeholder="enter student ID..."
                    error={
                      Formik.touched.PaymentProcess?.ID &&
                      Boolean(Formik.errors.PaymentProcess?.ID)
                    }
                    helperText={
                      Formik.touched.PaymentProcess?.ID &&
                      Formik.errors.PaymentProcess?.ID
                    }
                  />
                </Box>
              </Grid>
              <Grid item xs={10}>
                <Box>
                  <TextField
                    type="text"
                    variant="outlined"
                    size="small"
                    id={`${Id}_Fee`}
                    name="PaymentProcess.Fee"
                    value={Formik.values.PaymentProcess?.Fee ?? ''}
                    onChange={Formik.handleChange}
                    fullWidth
                    placeholder="enter the fee..."
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AttachMoneyIcon />
                        </InputAdornment>
                      ),
                    }}
                    error={
                      Formik.touched.PaymentProcess?.Fee &&
                      Boolean(Formik.errors.PaymentProcess?.Fee)
                    }
                    helperText={
                      Formik.touched.PaymentProcess?.Fee &&
                      Formik.errors.PaymentProcess?.Fee
                    }
                  />
                </Box>
              </Grid>
              <Grid item xs={10}>
                <Box
                  pt={1}
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                  }}
                >
                  <Box pr={1}>
                    <Button
                      variant="contained"
                      color="success"
                      type="submit"
                      onClick={() => {
                        setOpen('flex');
                      }}
                      startIcon={<PaidIcon sx={{ color: '#fafafa' }} />}
                      disableRipple
                    >
                      <Typography fontWeight="bold">PAY</Typography>
                    </Button>
                  </Box>
                  <Box>
                    <Button
                      variant="contained"
                      type="submit"
                      sx={{
                        bgcolor: orange[100],
                        ':hover': { bgcolor: orange[100] },
                      }}
                      // onClick={handleRefresh}
                      startIcon={<EditIcon sx={{ color: orange[800] }} />}
                      disableRipple
                    >
                      <Typography fontWeight="bold" sx={{ color: orange[800] }}>
                        Edit
                      </Typography>
                    </Button>
                  </Box>
                </Box>
                <Box pt={2} />
              </Grid>
            </Grid>
          </form>
        </Box>
      </Paper>
    </div>
  );
};

export default PaymentForm;
