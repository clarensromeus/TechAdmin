import * as React from 'react';
import { Box, Typography, TextField } from '@mui/material';
import Grid from '@mui/material/Grid';
import FormLabel from '@mui/material/FormLabel';
import grey from '@mui/material/colors/grey';
import { useFormik, FormikHelpers } from 'formik';
import { useRecoilValue } from 'recoil';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import EditIcon from '@mui/icons-material/Edit';
import Button from '@mui/material/Button';
import orange from '@mui/material/colors/orange';
import { useMutation, UseMutationResult } from '@tanstack/react-query';
import axios from 'axios';
// internal crafted imports of ressources
import { IAuthState } from '../../Interface/GlobalState';
import Context from '../../Store/ContextApi';
import { Validate_EditForm } from '../../utils/validationSchema';
import { IDataInfo, IResponse } from '../../Interface/profile';

const EditAccount: React.FC = () => {
  // for generating unique id both on client and server side
  const ID = React.useId();

  const [age, setAge] = React.useState('');
  const ContextData = React.useContext(Context);

  const AuthInfo = useRecoilValue<Partial<IAuthState>>(ContextData.GetAuthInfo);

  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value as string);
  };

  /* eslint implicit-arrow-linebreak: ["off", "beside"] */
  const Sleep = (time: number): Promise<Promise<void>> =>
    new Promise((resolve) => setTimeout(resolve, time));

  const Formik = useFormik({
    initialValues: {
      AdminEdit: {
        Firstname: `${AuthInfo.Payload?.Firstname}`,
        Lastname: `${AuthInfo.Payload?.Lastname}`,
        Email: `${AuthInfo.Payload?.Email}`,
        Password: 'Clarens(+-1998)',
        Username: `${AuthInfo.Payload?.Firstname?.toLowerCase()}${AuthInfo.Payload?.Lastname?.toLowerCase()}`,
        StatusLevel: `${AuthInfo.status}`,
        DOB: '29/01/1998',
      },
    },
    validationSchema: Validate_EditForm,
    enableReinitialize: true,
    onSubmit: async (
      values: IDataInfo<string>,
      { setSubmitting }: FormikHelpers<IDataInfo<string>>
    ) => {
      Sleep(2000);
      setSubmitting(false);
    },
  });

  const mutation = useMutation<
    IResponse,
    Error,
    IDataInfo<string>['AdminEdit']
  >({
    mutationFn: (data: IDataInfo<string>['AdminEdit']) => {
      return axios.patch('http://localhost:4000/home/profile/editAcount', data);
    },
  });

  return (
    <div>
      <Box p={2}>
        <form
          onSubmit={async (event: React.FormEvent<HTMLFormElement>) => {
            try {
              event.preventDefault();
              await mutation.mutate({
                Firstname: Formik.values.AdminEdit.Firstname,
                Lastname: Formik.values.AdminEdit.Lastname,
                Email: Formik.values.AdminEdit.Email,
                StatusLevel: Formik.values.AdminEdit.StatusLevel,
                Password: Formik.values.AdminEdit.Password,
                Username: Formik.values.AdminEdit.Username,
                DOB: Formik.values.AdminEdit.DOB,
              });
            } catch (error) {
              throw new Error(`${error}`);
            }
          }}
        >
          <Grid
            container
            xs={12}
            display="flex"
            flexDirection="column"
            spacing={2}
          >
            <Grid container item xs={12} spacing={2}>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <FormLabel
                    sx={{ textTransform: 'uppercase', color: grey[800] }}
                  >
                    firstname
                  </FormLabel>
                  <Box>
                    <TextField
                      type="text"
                      variant="outlined"
                      size="small"
                      id={`${ID}_Firstname`}
                      name="AdminEdit.Firstname"
                      value={Formik.values.AdminEdit.Firstname}
                      onChange={Formik.handleChange}
                      fullWidth
                      sx={{
                        bgcolor: 'white',
                        '& .MuiFilledInput-root': {
                          bgcolor: '#fafafa',
                        },
                        '& .Mui-focused': { bgcolor: '#fafafa' },
                      }}
                      error={
                        Formik.touched.AdminEdit?.Firstname &&
                        Boolean(Formik.errors.AdminEdit?.Firstname)
                      }
                      helperText={
                        Formik.touched.AdminEdit?.Firstname &&
                        Formik.errors.AdminEdit?.Firstname
                      }
                    />
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <FormLabel
                    sx={{ textTransform: 'uppercase', color: grey[800] }}
                  >
                    lastname
                  </FormLabel>
                  <Box
                    sx={{
                      color: 'text.secondary',
                      textTransform: 'capitalize',
                    }}
                  >
                    <TextField
                      type="text"
                      variant="outlined"
                      size="small"
                      id={`${ID}_Lastname`}
                      name="AdminEdit.Lastname"
                      value={Formik.values.AdminEdit?.Lastname}
                      onChange={Formik.handleChange}
                      fullWidth
                      sx={{
                        bgcolor: 'white',
                        '& .MuiFilledInput-root': {
                          bgcolor: '#fafafa',
                        },
                        '& .Mui-focused': { bgcolor: '#fafafa' },
                      }}
                      error={
                        Formik.touched.AdminEdit?.Lastname &&
                        Boolean(Formik.errors.AdminEdit?.Lastname)
                      }
                      helperText={
                        Formik.touched.AdminEdit?.Lastname &&
                        Formik.errors.AdminEdit?.Lastname
                      }
                    />
                  </Box>
                </Box>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <FormLabel
                  sx={{ textTransform: 'uppercase', color: grey[800] }}
                >
                  email
                </FormLabel>
                <Box>
                  <TextField
                    type="text"
                    variant="outlined"
                    size="small"
                    id={`${ID}_Email`}
                    name="AdminEdit.Email"
                    value={Formik.values.AdminEdit?.Email}
                    onChange={Formik.handleChange}
                    fullWidth
                    sx={{
                      bgcolor: 'white',
                      '& .MuiFilledInput-root': {
                        bgcolor: '#fafafa',
                      },
                      '& .Mui-focused': { bgcolor: '#fafafa' },
                    }}
                    error={
                      Formik.touched.AdminEdit?.Email &&
                      Boolean(Formik.errors.AdminEdit?.Email)
                    }
                    helperText={
                      Formik.touched.AdminEdit?.Email &&
                      Formik.errors.AdminEdit?.Email
                    }
                  />
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <FormLabel
                  sx={{ textTransform: 'uppercase', color: grey[800] }}
                >
                  password
                </FormLabel>
                <Box>
                  <TextField
                    type="password"
                    variant="outlined"
                    size="small"
                    id={`${ID}_Password`}
                    name="AdminEdit.Password"
                    value={Formik.values.AdminEdit.Password}
                    onChange={Formik.handleChange}
                    fullWidth
                    sx={{
                      bgcolor: 'white',
                      '& .MuiFilledInput-root': {
                        bgcolor: '#fafafa',
                      },
                      '& .Mui-focused': { bgcolor: '#fafafa' },
                    }}
                    error={
                      Formik.touched.AdminEdit?.Password &&
                      Boolean(Formik.errors.AdminEdit?.Password)
                    }
                    helperText={
                      Formik.touched.AdminEdit?.Password &&
                      Formik.errors.AdminEdit?.Password
                    }
                  />
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <FormLabel
                  sx={{ textTransform: 'uppercase', color: grey[800] }}
                >
                  username
                </FormLabel>
                <Box>
                  <TextField
                    type="text"
                    variant="outlined"
                    size="small"
                    id={`${ID}_Username`}
                    name="AdminEdit.Username"
                    value={Formik.values.AdminEdit?.Username}
                    onChange={Formik.handleChange}
                    fullWidth
                    sx={{
                      bgcolor: 'white',
                      '& .MuiFilledInput-root': {
                        bgcolor: '#fafafa',
                      },
                      '& .Mui-focused': { bgcolor: '#fafafa' },
                    }}
                    error={
                      Formik.touched.AdminEdit?.Username &&
                      Boolean(Formik.errors.AdminEdit?.Username)
                    }
                    helperText={
                      Formik.touched.AdminEdit?.Username &&
                      Formik.errors.AdminEdit?.Username
                    }
                  />
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <FormLabel
                  sx={{ textTransform: 'uppercase', color: grey[800] }}
                >
                  statuslevel
                </FormLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={age}
                  size="small"
                  fullWidth
                  displayEmpty
                  onChange={handleChange}
                  renderValue={(selected) => {
                    if (selected.length === 0) {
                      return <em style={{}}>Administrator</em>;
                    }
                    return selected;
                  }}
                >
                  <MenuItem value="Supervisor">Supervisor</MenuItem>
                  <MenuItem value="Supervisor assistant">
                    Supervisor assistant
                  </MenuItem>
                  <MenuItem value="Secretary">Secretary</MenuItem>
                  <MenuItem value="General inspector">
                    General inspector
                  </MenuItem>
                  <MenuItem value="Secretary assistant">
                    Secretary assistant
                  </MenuItem>
                  <MenuItem value="Adjoint">Adjoint</MenuItem>
                </Select>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <FormLabel
                  sx={{ textTransform: 'uppercase', color: grey[800] }}
                >
                  date of birth
                </FormLabel>
                <Box>
                  <TextField
                    type="text"
                    variant="outlined"
                    size="small"
                    id={`${ID}_DOB`}
                    name="AdminEdit.Username"
                    value={Formik.values.AdminEdit?.DOB}
                    onChange={Formik.handleChange}
                    fullWidth
                    sx={{
                      bgcolor: 'white',
                      '& .MuiFilledInput-root': {
                        bgcolor: '#fafafa',
                      },
                      '& .Mui-focused': { bgcolor: '#fafafa' },
                    }}
                    error={
                      Formik.touched.AdminEdit?.DOB &&
                      Boolean(Formik.errors.AdminEdit?.DOB)
                    }
                    helperText={
                      Formik.touched.AdminEdit?.DOB &&
                      Formik.errors.AdminEdit?.DOB
                    }
                  />
                </Box>
              </Box>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                // type="submit"
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
            </Grid>
          </Grid>
        </form>
      </Box>
    </div>
  );
};

export default EditAccount;
