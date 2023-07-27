import * as React from 'react';
import { useId } from 'react';
import { Box, Typography, Button } from '@mui/material';
import Grid from '@mui/material/Grid';
import FormLabel from '@mui/material/FormLabel';
import InputAdornment from '@mui/material/InputAdornment';
import { useFormik, FormikHelpers } from 'formik';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import EditIcon from '@mui/icons-material/Edit';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import MenuItem from '@mui/material/MenuItem';
import grey from '@mui/material/colors/grey';
import orange from '@mui/material/colors/orange';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import axios from 'axios';
import isEqual from 'lodash/isEqual';
import { ClipLoader } from 'react-spinners';
import { useRecoilValue } from 'recoil';
import { nanoid } from 'nanoid';
import {
  useMutation,
  useQueryClient,
  UseMutationResult,
  QueryClient,
} from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';
// internal crafted imports of ressources
import { Validate_StudentsForm } from '../../utils/validationSchema';
import { TextFieldStyle } from '../../MuiStyles/Nav';
import { editData, ICreateStudent } from '../../Interface/student';
import useHistory from '../../hooks/useHistory';
import { IHistory } from '../../Interface/History';
import Context from '../../Store/ContextApi';
import { IAuthState } from '../../Interface/GlobalState';

type IStudentData<T> = {
  StudentsRegisteration: {
    Firstname: T;
    Lastname: T;
    Email: T;
    Password: T;
    ConfirmPassword: T;
    Class: T;
    ClassName: T;
    SchoolLevel: T;
  };
};

type Response = {
  message: string;
  success: boolean;
};

const StudentsForm: React.FC<editData> = ({
  _id,
  _ID_User,
  Firstname,
  Lastname,
  Password,
  ConfirmPassword,
  Email,
  SchoolLevel,
  Class,
  ClassName,
}) => {
  // for generating unique id both on client and server side
  const ID = useId();
  const ContextData = React.useContext(Context);

  const [visible, setVisible] = React.useState<{ showPassw: boolean }>({
    showPassw: false,
  });

  const AuthInfo = useRecoilValue<Partial<IAuthState>>(ContextData.GetAuthInfo);

  const queryClient: QueryClient = useQueryClient();
  const { CreateHistory } = useHistory();

  const handleShowPass = () => {
    setVisible({ showPassw: !visible.showPassw });
  };
  /* eslint implicit-arrow-linebreak: ["off", "beside"] */
  const Sleep = (time: number): Promise<Promise<void>> =>
    new Promise((resolve) => setTimeout(resolve, time));

  const Formik = useFormik({
    initialValues: {
      StudentsRegisteration: {
        Firstname,
        Lastname,
        Email,
        Password,
        ConfirmPassword,
        Class,
        ClassName,
        SchoolLevel,
      },
    },
    validationSchema: Validate_StudentsForm,
    enableReinitialize: true,
    onSubmit: async (
      values: IStudentData<string>,
      { setSubmitting }: FormikHelpers<IStudentData<string>>
    ) => {
      Sleep(2000);
      setSubmitting(false);
    },
  });

  const mutation: UseMutationResult<
    Response,
    Error,
    ICreateStudent<string>
  > = useMutation<Response, Error, ICreateStudent<string>>({
    mutationFn: async (Data: ICreateStudent<string>) => {
      try {
        const res = await axios.post(
          'http://localhost:4000/home/student/create',
          Data
        );

        return res.data;
      } catch (error) {
        throw new Error(`${error}`);
      }
    },
    onSuccess: (create: Response) => {
      // invalidate and refetching the query to be always providing fresh data
      queryClient.invalidateQueries({
        queryKey: ['students'],
      });

      enqueueSnackbar(
        <Typography sx={{ color: grey[600], fontSeize: '0.6rem' }}>
          {create.message}
        </Typography>,
        {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'center',
          },
          variant: isEqual(create.success, true) ? 'success' : 'error',
          preventDuplicate: true, // prevent noti with the same message to display multiple times
        }
      );
    },
  });

  const onSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    mutation.mutate({
      Firstname: Formik.values.StudentsRegisteration.Firstname,
      Lastname: Formik.values.StudentsRegisteration.Lastname,
      Email: Formik.values.StudentsRegisteration.Email,
      Password: Formik.values.StudentsRegisteration.Password,
      ConfirmPassword: Formik.values.StudentsRegisteration.ConfirmPassword,
      Image: '',
      Class: Formik.values.StudentsRegisteration.Class,
      ClassName: Formik.values.StudentsRegisteration.ClassName,
      SchoolLevel: Formik.values.StudentsRegisteration.SchoolLevel,
    });

    // data for creating histories
    const HistoryData: IHistory<string> = {
      ActionPerformer: `${AuthInfo.Payload?._id}`,
      NotiId: `${nanoid()}`,
      ActionCreator: {
        Status: 'Student',
        Firstname: Formik.values.StudentsRegisteration.Firstname,
        Lastname: Formik.values.StudentsRegisteration.Lastname,
        Image: '',
      },
      NotiReference: 'registered',
      AlertText: ' is registered by ',
      User: '64bb0a381e5ce1722e328401', // the platform administrator id
    };
    CreateHistory(HistoryData);
  };

  // mutation instance to edit administrators
  const EditMutation: UseMutationResult<Response, Error, editData> =
    useMutation<Response, Error, editData>({
      mutationFn: async (newData: editData) => {
        try {
          const res = await axios.put(
            'http://localhost:4000/home/student/edit',
            newData
          );
          return res.data;
        } catch (error) {
          throw new Error(`${error}`);
        }
      },
      onSuccess: (edit: Response) => {
        // invalidate and refetch the query
        queryClient.invalidateQueries({
          queryKey: ['students'],
        });

        enqueueSnackbar(
          <Typography sx={{ color: grey[600], fontSeize: '0.6rem' }}>
            {edit.message}
          </Typography>,
          {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'center',
            },
            variant: 'success',
            preventDuplicate: true, // prevent noti with the same message to display multiple times
          }
        );
      },
    });

  // the function only test if all formik fields of the form is validated before taking next steps
  // like making a request
  const isValidated: boolean =
    !Formik.isValid ||
    (Object.keys(Formik.touched).length === 0 &&
      Formik.touched.constructor === Object);

  return (
    <div>
      <Paper elevation={1}>
        <Box>
          <Box p={2}>
            <Typography fontFamily="Andale Mono, monospace">
              personal information
            </Typography>
          </Box>
          <Divider sx={{ width: 'inherit' }} />
          <Box pt={1} />
          <form onSubmit={!isValidated ? onSubmit : Formik.handleSubmit}>
            <Grid container justifyContent="center" spacing={2}>
              <Grid container item xs={10} spacing={1}>
                <Grid item xs={6}>
                  <Box>
                    <TextFieldStyle
                      type="text"
                      variant="outlined"
                      size="small"
                      id={`${ID}_Firstname`}
                      name="StudentsRegisteration.Firstname"
                      value={Formik.values.StudentsRegisteration?.Firstname}
                      onChange={Formik.handleChange}
                      fullWidth
                      placeholder="Firstname"
                      error={
                        Formik.touched.StudentsRegisteration?.Firstname &&
                        Boolean(Formik.errors.StudentsRegisteration?.Firstname)
                      }
                      helperText={
                        Formik.touched.StudentsRegisteration?.Firstname &&
                        Formik.errors.StudentsRegisteration?.Firstname
                      }
                    />
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box>
                    <TextFieldStyle
                      type="text"
                      variant="outlined"
                      size="small"
                      id={`${ID}_Lastname`}
                      name="StudentsRegisteration.Lastname"
                      value={Formik.values.StudentsRegisteration?.Lastname}
                      onChange={Formik.handleChange}
                      fullWidth
                      placeholder="Lastname"
                      error={
                        Formik.touched.StudentsRegisteration?.Lastname &&
                        Boolean(Formik.errors.StudentsRegisteration?.Lastname)
                      }
                      helperText={
                        Formik.touched.StudentsRegisteration?.Lastname &&
                        Formik.errors.StudentsRegisteration?.Lastname
                      }
                    />
                  </Box>
                </Grid>
              </Grid>
              <Grid item xs={10}>
                <Box>
                  <TextFieldStyle
                    type="text"
                    variant="outlined"
                    size="small"
                    id={`${ID}_Email`}
                    name="StudentsRegisteration.Email"
                    value={Formik.values.StudentsRegisteration.Email}
                    onChange={Formik.handleChange}
                    fullWidth
                    placeholder="enter your email"
                    error={
                      Formik.touched.StudentsRegisteration?.Email &&
                      Boolean(Formik.errors.StudentsRegisteration?.Email)
                    }
                    helperText={
                      Formik.touched.StudentsRegisteration?.Email &&
                      Formik.errors.StudentsRegisteration?.Email
                    }
                  />
                </Box>
              </Grid>
              <Grid item xs={10}>
                <TextFieldStyle
                  type={visible.showPassw ? 'text' : 'password'}
                  variant="outlined"
                  size="small"
                  id={`${ID}_Password`}
                  name="StudentsRegisteration.Password"
                  value={Formik.values.StudentsRegisteration?.Password}
                  onChange={Formik.handleChange}
                  fullWidth
                  placeholder="enter your password"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Typography variant="h6" sx={{}}>
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
                        </Typography>
                      </InputAdornment>
                    ),
                  }}
                  error={
                    Formik.touched.StudentsRegisteration?.Password &&
                    Boolean(Formik.errors.StudentsRegisteration?.Password)
                  }
                  helperText={
                    Formik.touched.StudentsRegisteration?.Password &&
                    Formik.errors.StudentsRegisteration?.Password
                  }
                />
              </Grid>
              <Grid item xs={10}>
                <TextFieldStyle
                  type="password"
                  variant="outlined"
                  size="small"
                  id={`${ID}_ConfirmPassword`}
                  name="StudentsRegisteration.ConfirmPassword"
                  value={Formik.values.StudentsRegisteration?.ConfirmPassword}
                  fullWidth
                  onChange={Formik.handleChange}
                  placeholder="confirm your password"
                  error={
                    Formik.touched.StudentsRegisteration?.ConfirmPassword &&
                    Boolean(
                      Formik.errors.StudentsRegisteration?.ConfirmPassword
                    )
                  }
                  helperText={
                    Formik.touched.StudentsRegisteration?.ConfirmPassword &&
                    Formik.errors.StudentsRegisteration?.ConfirmPassword
                  }
                />
              </Grid>
              <Grid item xs={10}>
                <FormControl fullWidth>
                  <Select
                    sx={{
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: grey[400],
                        borderWidth: '1px',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: grey[400],
                        borderWidth: '1px',
                      },
                    }}
                    labelId="schoolLevel"
                    id="schoolLevel"
                    name="StudentsRegisteration.SchoolLevel"
                    value={Formik.values.StudentsRegisteration?.SchoolLevel}
                    size="small"
                    displayEmpty
                    onChange={Formik.handleChange}
                    renderValue={(selected) => {
                      if (selected.length === 0) {
                        return (
                          <em style={{ color: 'grey' }}>
                            Select a school level
                          </em>
                        );
                      }
                      return selected;
                    }}
                  >
                    <MenuItem disabled value="">
                      <em>Select a school level</em>
                    </MenuItem>
                    <MenuItem value="kindergatern">Kindergaten</MenuItem>
                    <MenuItem value="primary">Primary</MenuItem>
                    <MenuItem value="secondary">Secondary</MenuItem>
                  </Select>
                  <FormLabel
                    sx={{ fontSize: '0.8em', color: 'red', bgcolor: '#fafafa' }}
                  >
                    {Formik.touched.StudentsRegisteration?.SchoolLevel &&
                      Formik.errors.StudentsRegisteration?.SchoolLevel}
                  </FormLabel>
                </FormControl>
              </Grid>
              <Grid item xs={10}>
                <FormControl fullWidth>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={Formik.values.StudentsRegisteration?.Class}
                    name="StudentsRegisteration.Class"
                    size="small"
                    sx={{
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: grey[400],
                        borderWidth: '1px',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: grey[400],
                        borderWidth: '1px',
                      },
                    }}
                    displayEmpty
                    onChange={Formik.handleChange}
                    renderValue={(selected) => {
                      if (selected.length === 0) {
                        return (
                          <em style={{ color: 'grey' }}>Select a class</em>
                        );
                      }
                      return selected;
                    }}
                  >
                    <MenuItem disabled value="">
                      <em>Select a class</em>
                    </MenuItem>
                    <MenuItem value="1st grade">1st grade</MenuItem>
                    <MenuItem value="2st grade">2nd grade</MenuItem>
                    <MenuItem value="3st grade">3th grade</MenuItem>
                    <MenuItem value="4st grade">4th grade</MenuItem>
                    <MenuItem value="5st grade">5th grade</MenuItem>
                    <MenuItem value="6st grade">6th grade</MenuItem>
                    <MenuItem value="7st grade">6th grade</MenuItem>
                  </Select>
                  <FormLabel
                    sx={{ fontSize: '0.8em', color: 'red', bgcolor: '#fafafa' }}
                  >
                    {Formik.touched.StudentsRegisteration?.Class &&
                      Formik.errors.StudentsRegisteration?.Class}
                  </FormLabel>
                </FormControl>
              </Grid>
              <Grid item xs={10}>
                <TextFieldStyle
                  type="text"
                  variant="outlined"
                  size="small"
                  id={`${ID}_ClassName`}
                  name="StudentsRegisteration.ClassName"
                  value={Formik.values.StudentsRegisteration?.ClassName}
                  fullWidth
                  onChange={Formik.handleChange}
                  placeholder="enter className"
                  sx={{}}
                  error={
                    Formik.touched.StudentsRegisteration?.ClassName &&
                    Boolean(Formik.errors.StudentsRegisteration?.ClassName)
                  }
                  helperText={
                    Formik.touched.StudentsRegisteration?.ClassName &&
                    Formik.errors.StudentsRegisteration?.ClassName
                  }
                />
              </Grid>
              <Grid item xs={10}>
                <Box
                  sx={{
                    border: `1px solid ${grey[400]}`,
                    width: 'inherit',
                    height: 39,
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderRadius: '3%',
                  }}
                >
                  <FormLabel
                    sx={{
                      pl: 2,
                      height: '100%',
                      width: 94,
                      bgcolor: '#E8F0FE',
                    }}
                    htmlFor="upload-file"
                  >
                    <Typography sx={{ pt: 1, color: grey[700] }}>
                      Upload
                    </Typography>
                    <input
                      type="file"
                      id="upload-file"
                      hidden
                      name="upload-file"
                    />
                  </FormLabel>
                  <Typography sx={{ pl: 1 }} color="text.secondary">
                    choose a file..
                  </Typography>
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
                      startIcon={
                        mutation.isLoading ? (
                          <ClipLoader
                            color="#fafafa"
                            loading={mutation.isLoading}
                            size={10}
                            aria-label="Loading Spinner"
                          />
                        ) : (
                          <PersonAddIcon sx={{ color: '#fafafa' }} />
                        )
                      }
                      disableRipple
                    >
                      <Typography fontWeight="bold">ADD</Typography>
                    </Button>
                  </Box>
                  <Box>
                    <Button
                      variant="contained"
                      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                        e.preventDefault();
                        EditMutation.mutate({
                          _id,
                          _ID_User,
                          Firstname:
                            Formik.values.StudentsRegisteration.Firstname,
                          Lastname:
                            Formik.values.StudentsRegisteration.Lastname,
                          Email: Formik.values.StudentsRegisteration.Email,
                          Password:
                            Formik.values.StudentsRegisteration.Password,
                          Class: Formik.values.StudentsRegisteration.Class,
                          ConfirmPassword:
                            Formik.values.StudentsRegisteration.Firstname,
                          SchoolLevel:
                            Formik.values.StudentsRegisteration.SchoolLevel,
                          ClassName:
                            Formik.values.StudentsRegisteration.ClassName,
                        });
                      }}
                      sx={{
                        bgcolor: orange[100],
                        ':hover': { bgcolor: orange[100] },
                      }}
                      startIcon={
                        EditMutation.isLoading ? (
                          <ClipLoader
                            color="#fafafa"
                            loading={EditMutation.isLoading}
                            size={10}
                            aria-label="Loading Spinner"
                          />
                        ) : (
                          <EditIcon sx={{ color: orange[800] }} />
                        )
                      }
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

export default StudentsForm;
