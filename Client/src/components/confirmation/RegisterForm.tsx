// internal imports of ressources
import * as React from "react";
// external imports of ressources
import { FC, useId } from "react";
import { Box, Typography, Button, Checkbox } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import Grid from "@mui/material/Grid";
import { NavigateFunction, Link as RRDLink } from "react-router-dom";
import Link from "@mui/material/Link";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormLabel from "@mui/material/FormLabel";
import grey from "@mui/material/colors/grey";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Alert from "@mui/material/Alert";
import { useFormik, FormikHelpers } from "formik";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { PulseLoader } from "react-spinners";
import __ from "lodash";
// internal crafted imports of sources
import { Validate_Register } from "../../utils/validationSchema";
import { TextFieldStyle } from "../../MuiStyles/TextFieldStyle2";
import { IAuthState } from "../../Interface/GlobalState";
import { AdminRegisterType } from "../../Store/globalStoreTypes";
import useData from "../DataInfo";
import Context from "../../Store/ContextApi";
import {
  DataInfo,
  IState,
  studentInfo,
  IValidation,
  IResponse,
} from "../../Interface/Register";
import { isValidatedRegister } from "../isValidated";

interface IUserEmail {
  UsernameorEmail: string;
}

interface IPasscode {
  showPassw: boolean;
}

/* eslint no-redeclare: "off" */
const RegisterForm: FC<IUserEmail> = ({ UsernameorEmail }) => {
  const newLine: string = " ";

  const ContextData = React.useContext(Context);
  const Administrator = ContextData?.GetAuthInfo;
  // generating unique identifier between the server and the client
  const ID = useId();

  const [visible, setVisible] = React.useState<IPasscode>({
    showPassw: false,
  });

  const [state, setState] = React.useState<IState>({
    open: false,
    message: "",
  });

  const AuthInfo = useRecoilValue<Partial<IAuthState>>(Administrator);

  const handleShowPass = () => {
    setVisible({ showPassw: !visible.showPassw });
  };

  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    // clickaway event won't close the snackbar
    if (reason === "clickaway") {
      return;
    }

    // close snackbar
    setState({ ...state, open: false });
  };

  const isAdmin: boolean =
    __.isEqual("admin", AuthInfo?.status) &&
    __.isEqual(AdminRegisterType, AuthInfo?.type);

  const validationSchema: IValidation = {
    message: UsernameorEmail === "top" ? "email" : "username",
    validation:
      UsernameorEmail === "top"
        ? "enter a valid email"
        : "enter a valid username",
    matching:
      UsernameorEmail === "top"
        ? /^\b[\w-.]+@([\w-]+\.)+[\w-]{2,4}\b$/g
        : /^[a-z]+\s[a-z]+$/g,
    ClassOrpromocode: isAdmin ? "enter promo code" : "select a class",
    LevelOrLevelstatus: isAdmin ? "select a level status" : "select a class",
  };

  /* eslint implicit-arrow-linebreak: ["off", "beside"] */
  const Sleep = (time: number): Promise<Promise<void>> =>
    new Promise((resolve) => setTimeout(resolve, time));

  const Formik = useFormik({
    initialValues: {
      StudentRegisteration: {
        Firstname: "",
        Lastname: "",
        EmailorUsername: "",
        ClassOrpromocode: "",
        LevelOrLevelstatus: "",
        Password: "",
        PasswordConfirmation: "",
      },
    },
    validationSchema: Validate_Register(
      validationSchema.message,
      validationSchema.validation,
      validationSchema.matching,
      validationSchema.ClassOrpromocode,
      validationSchema.LevelOrLevelstatus
    ),
    onSubmit: async (
      values: studentInfo<string>,
      { setSubmitting }: FormikHelpers<studentInfo<string>>
    ) => {
      Sleep(2000);
      setSubmitting(false);
    },
  });

  const navigate: NavigateFunction = useNavigate();

  const Mutation: UseMutationResult<IResponse, Error, DataInfo> = useMutation<
    IResponse,
    Error,
    DataInfo
  >({
    mutationFn: async (Data: DataInfo) => {
      // declare the url
      const Url: string = `http://localhost:4000/register/${AuthInfo.status}`;
      const response = await axios.post<IResponse>(Url, Data, {
        headers: { "Content-type": "application/json" },
      });
      return response.data;
    },
    onSuccess: (newData: IResponse) => {
      if (newData.success === true && newData.code) {
        setState({ ...state, open: true });
        if (!__.isNil(newData.token)) {
          window.localStorage.setItem("TOKEN", JSON.stringify(newData.token));
          navigate("/home/dashboard", { replace: true });
        }
      } else {
        setState({ ...state, open: true, message: newData.message });
      }
    },
    retry: 1, // retry only once if mutation errored out
    retryDelay: 200, // retry after 200 hundreds miliseconds
  });

  return (
    <Box pt={2}>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={state.open}
        autoHideDuration={6000}
        onClose={handleClose}
        color="success"
        sx={{ color: "#fafafa", width: 372 }}
        action={
          <React.Fragment>
            <IconButton onClick={handleClose}>
              <CloseIcon sx={{ color: "#fafafa" }} />
            </IconButton>
          </React.Fragment>
        }
      >
        <Alert onClose={handleClose} severity="warning" sx={{ width: "100%" }}>
          <Typography fontWeight="bold"> {state.message}</Typography>
        </Alert>
      </Snackbar>
      <form onSubmit={Formik.handleSubmit}>
        <Grid container justifyContent="center" spacing={2}>
          <Grid container item xs={10} spacing={1}>
            <Grid item xs={6}>
              <Box>
                <TextFieldStyle
                  type="text"
                  variant="outlined"
                  size="small"
                  id={`${ID}_Firstname`}
                  name="StudentRegisteration.Firstname"
                  value={Formik.values.StudentRegisteration.Firstname}
                  onChange={Formik.handleChange}
                  fullWidth
                  placeholder="Firstname..."
                  error={
                    Formik.touched.StudentRegisteration?.Firstname &&
                    Boolean(Formik.errors.StudentRegisteration?.Firstname)
                  }
                  helperText={
                    Formik.touched.StudentRegisteration?.Firstname &&
                    Formik.errors.StudentRegisteration?.Firstname
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
                  name="StudentRegisteration.Lastname"
                  value={Formik.values.StudentRegisteration.Lastname}
                  onChange={Formik.handleChange}
                  fullWidth
                  placeholder="Lastname"
                  error={
                    Formik.touched.StudentRegisteration?.Lastname &&
                    Boolean(Formik.errors.StudentRegisteration?.Lastname)
                  }
                  helperText={
                    Formik.touched.StudentRegisteration?.Lastname &&
                    Formik.errors.StudentRegisteration?.Lastname
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
                id={`${ID}_EmailorUsername`}
                name="StudentRegisteration.EmailorUsername"
                value={Formik.values.StudentRegisteration.EmailorUsername}
                onChange={Formik.handleChange}
                fullWidth
                placeholder={
                  UsernameorEmail === "top"
                    ? "enter your Email"
                    : "enter your username"
                }
                error={
                  Formik.touched.StudentRegisteration?.EmailorUsername &&
                  Boolean(Formik.errors.StudentRegisteration?.EmailorUsername)
                }
                helperText={
                  Formik.touched.StudentRegisteration?.EmailorUsername &&
                  Formik.errors.StudentRegisteration?.EmailorUsername
                }
              />
            </Box>
          </Grid>
          <Grid item xs={10}>
            <TextFieldStyle
              type={visible.showPassw ? "text" : "password"}
              variant="outlined"
              size="small"
              id={`${ID}_Password`}
              name="StudentRegisteration.Password"
              value={Formik.values.StudentRegisteration.Password}
              onChange={Formik.handleChange}
              fullWidth
              placeholder="enter your password.."
              sx={{
                "& .MuiFilledInput-root": {
                  bgcolor: "#fafafa",
                },
                "& .Mui-focused": {
                  bgcolor: "#fafafa",
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Typography variant="h6" sx={{}}>
                      <Button
                        color="inherit"
                        disableRipple
                        disableElevation
                        onClick={handleShowPass}
                      >
                        {visible.showPassw ? "hide" : "show"}
                      </Button>
                    </Typography>
                  </InputAdornment>
                ),
              }}
              error={
                Formik.touched.StudentRegisteration?.Password &&
                Boolean(Formik.errors.StudentRegisteration?.Password)
              }
              helperText={
                Formik.touched.StudentRegisteration?.Password &&
                Formik.errors.StudentRegisteration?.Password
              }
            />
          </Grid>
          <Grid container item spacing={1} xs={10}>
            <Grid item xs={6}>
              <FormControl fullWidth>
                {!isAdmin ? (
                  <Select
                    sx={{
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: grey[400],
                        borderWidth: "1px",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: grey[400],
                        borderWidth: "1px",
                      },
                    }}
                    value={
                      Formik.values.StudentRegisteration?.LevelOrLevelstatus
                    }
                    size="small"
                    displayEmpty
                    name="StudentRegisteration.LevelOrLevelstatus"
                    onChange={Formik.handleChange}
                    error={
                      Formik.touched.StudentRegisteration?.LevelOrLevelstatus &&
                      Boolean(
                        Formik.errors.StudentRegisteration?.LevelOrLevelstatus
                      )
                    }
                    renderValue={(selected) => {
                      if (selected.length === 0) {
                        return (
                          <em style={{ color: "grey" }}>
                            {isAdmin ? "select a status" : "select a level"}
                          </em>
                        );
                      }
                      return selected;
                    }}
                  >
                    <MenuItem disabled value="">
                      select a level
                    </MenuItem>
                    <MenuItem value="Administrator">Administrator</MenuItem>
                    <MenuItem value="Supervisor">Supervisor</MenuItem>
                    <MenuItem value="Supervisor Assistant">
                      Supervisor Assistant
                    </MenuItem>
                    <MenuItem value="General Inspector">
                      General Inspector
                    </MenuItem>
                    <MenuItem value="secretary">secretary</MenuItem>
                    <MenuItem value="Director">Director</MenuItem>
                  </Select>
                ) : (
                  <Select
                    sx={{
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: grey[400],
                        borderWidth: "1px",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: grey[400],
                        borderWidth: "1px",
                      },
                    }}
                    value={
                      Formik.values.StudentRegisteration?.LevelOrLevelstatus
                    }
                    size="small"
                    displayEmpty
                    name="StudentRegisteration.LevelOrLevelstatus"
                    onChange={Formik.handleChange}
                    error={
                      Formik.touched.StudentRegisteration?.LevelOrLevelstatus &&
                      Boolean(
                        Formik.errors.StudentRegisteration?.LevelOrLevelstatus
                      )
                    }
                    renderValue={(selected) => {
                      if (selected.length === 0) {
                        return (
                          <em style={{ color: "grey" }}>select a status</em>
                        );
                      }
                      return selected;
                    }}
                  >
                    <MenuItem disabled value="">
                      <em>{isAdmin ? "select a status" : "select a level"}</em>
                    </MenuItem>
                    <MenuItem value="Secondary">Secondary</MenuItem>
                    <MenuItem value="Kindergaten">Kindergaten</MenuItem>
                    <MenuItem value="Primary">Primary</MenuItem>
                  </Select>
                )}

                <FormLabel
                  sx={{ fontSize: "0.8em", color: "red", bgcolor: "#fafafa" }}
                >
                  {Formik.touched.StudentRegisteration?.LevelOrLevelstatus &&
                    Formik.errors.StudentRegisteration?.LevelOrLevelstatus}
                </FormLabel>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              {isAdmin ? (
                <Box>
                  <TextFieldStyle
                    type="text"
                    variant="outlined"
                    size="small"
                    id={`${ID}_Lastname`}
                    name="StudentRegisteration.ClassOrpromocode"
                    value={Formik.values.StudentRegisteration.ClassOrpromocode}
                    onChange={Formik.handleChange}
                    fullWidth
                    placeholder="promo code"
                    error={
                      Formik.touched.StudentRegisteration?.ClassOrpromocode &&
                      Boolean(
                        Formik.errors.StudentRegisteration?.ClassOrpromocode
                      )
                    }
                    helperText={
                      Formik.touched.StudentRegisteration?.ClassOrpromocode &&
                      Formik.errors.StudentRegisteration?.ClassOrpromocode
                    }
                  />
                </Box>
              ) : (
                <FormControl fullWidth>
                  <Select
                    sx={{
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: grey[400],
                        borderWidth: "1px",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: grey[400],
                        borderWidth: "1px",
                      },
                    }}
                    value={Formik.values.StudentRegisteration?.ClassOrpromocode}
                    size="small"
                    displayEmpty
                    name="StudentRegisteration.ClassOrpromocode"
                    onChange={Formik.handleChange}
                    error={
                      Formik.touched.StudentRegisteration?.ClassOrpromocode &&
                      Boolean(
                        Formik.errors.StudentRegisteration?.ClassOrpromocode
                      )
                    }
                    renderValue={(selected) => {
                      if (selected.length === 0) {
                        return <em style={{ color: "grey" }}>Select class</em>;
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
                    sx={{ fontSize: "0.8em", color: "red", bgcolor: "#fafafa" }}
                  >
                    {Formik.touched.StudentRegisteration?.ClassOrpromocode &&
                      Formik.errors.StudentRegisteration?.ClassOrpromocode}
                  </FormLabel>
                </FormControl>
              )}
            </Grid>
          </Grid>
          <Grid item xs={10}>
            <TextFieldStyle
              type="password"
              variant="outlined"
              size="small"
              id={`${ID}_ConfirmationPassword`}
              name="StudentRegisteration.PasswordConfirmation"
              value={Formik.values.StudentRegisteration.PasswordConfirmation}
              fullWidth
              onChange={Formik.handleChange}
              placeholder="confirm your password.."
              error={
                Formik.touched.StudentRegisteration?.PasswordConfirmation &&
                Boolean(
                  Formik.errors.StudentRegisteration?.PasswordConfirmation
                )
              }
              helperText={
                Formik.touched.StudentRegisteration?.PasswordConfirmation &&
                Formik.errors.StudentRegisteration?.PasswordConfirmation
              }
            />
          </Grid>
          <Grid item xs={10}>
            <Box>
              <FormControlLabel
                control={
                  <Checkbox
                    size="small"
                    sx={{
                      color: "#fafafa",

                      "&.Mui-checked": {
                        color: "green",
                      },
                    }}
                  />
                }
                label={
                  <Typography variant="body2" pt={2} pr={2}>
                    if check, you agree with our
                    <span>{newLine}</span>
                    <Link href="#f" sx={{ color: "#42a5f5" }} underline="hover">
                      terms of condition
                    </Link>
                    {"  "}
                    and our
                    <span style={{}}>
                      {newLine}
                      <Link
                        href="#f"
                        sx={{ color: "#42a5f5" }}
                        underline="hover"
                      >
                        privacy policy
                      </Link>
                    </span>
                  </Typography>
                }
              />
            </Box>
            <Box pt={1}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                sx={{ fontWeight: "bold", boxShadow: "none" }}
                onClick={() => {
                  const Customizer = (
                    Firstvalue: string,
                    Secondvalue: string
                  ): boolean => {
                    return Firstvalue === Secondvalue;
                  };
                  // check if student or admin wants to register with email or username
                  const isEmailorUsername: boolean = __.isEqualWith(
                    UsernameorEmail,
                    "top",
                    Customizer
                  );

                  const Data = useData({
                    isEmailorUsername,
                    isAdmin,
                    Data: {
                      Firstname: Formik.values.StudentRegisteration.Firstname,
                      Lastname: Formik.values.StudentRegisteration.Lastname,
                      Email: Formik.values.StudentRegisteration.EmailorUsername,
                      Username:
                        Formik.values.StudentRegisteration.EmailorUsername,
                      Password: Formik.values.StudentRegisteration.Password,
                      ConfirmPassword:
                        Formik.values.StudentRegisteration.PasswordConfirmation,
                      Image: "",
                      Class:
                        Formik.values.StudentRegisteration.ClassOrpromocode,
                      PromoCode:
                        Formik.values.StudentRegisteration.ClassOrpromocode,
                      SchoolLevel:
                        Formik.values.StudentRegisteration.LevelOrLevelstatus,
                      Classname: "",
                      StatusLevel:
                        Formik.values.StudentRegisteration.LevelOrLevelstatus,
                    },
                  });

                  if (
                    AuthInfo.status === "Who are you?" &&
                    !isValidatedRegister(
                      Formik.isValid,
                      Formik.touched,
                      Formik.touched.constructor
                    )
                  ) {
                    setState({
                      ...state,
                      open: true,
                      message: "Sorry! select who you are first?",
                    });
                  }

                  if (
                    !isValidatedRegister(
                      Formik.isValid,
                      Formik.touched,
                      Formik.touched.constructor
                    ) &&
                    AuthInfo.status !== "Who are you?"
                  ) {
                    Mutation.mutate(Data);
                  }
                }}
                fullWidth
                disableRipple
              >
                <Typography fontWeight="bold">
                  {Mutation.isLoading ? (
                    <PulseLoader
                      color="#fafafa"
                      loading={Mutation.isLoading}
                      size={10}
                      aria-label="Loading Spinner"
                      data-testid="loader"
                    />
                  ) : (
                    "Register"
                  )}
                </Typography>
              </Button>
            </Box>
            <Box sx={{ textAlign: "left" }} pl={16}>
              <Typography sx={{ color: "#000000" }} variant="body2">
                already registered?
                <RRDLink to="/login" style={{ color: "#42a5f5" }}>
                  Login
                </RRDLink>
              </Typography>
            </Box>
          </Grid>
        </Grid>
        <Box sx={{ visibility: "hidden" }}>...</Box>
      </form>
    </Box>
  );
};

export default RegisterForm;

// using useId hook to create unique identifier for input fields on
// both the client-side and the server-side
