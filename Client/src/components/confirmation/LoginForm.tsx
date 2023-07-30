// internal non-relative imports of sources
import * as React from "react";
import { useId } from "react";
// external non-relative imports of sources
import { FC } from "react";
import { Box, Typography, Button } from "@mui/material";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import InputAdornment from "@mui/material/InputAdornment";
import Divider from "@mui/material/Divider";
import LockIcon from "@mui/icons-material/Lock";
import PersonIcon from "@mui/icons-material/Person";
import FacebookIcon from "@mui/icons-material/Facebook";
import MailIcon from "@mui/icons-material/Mail";
import GoogleIcon from "@mui/icons-material/Google";
import GitHubIcon from "@mui/icons-material/GitHub";
import { blue, grey } from "@mui/material/colors";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { alpha } from "@mui/material/styles";
import { NavigateFunction, Link as RRDLink } from "react-router-dom";
import { useFormik, FormikHelpers } from "formik";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { PulseLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import __ from "lodash";
import { useRecoilValue } from "recoil";
// internal crafted components of sources
import { Validate_Login } from "../../utils/validationSchema";
import { TextFieldStyle } from "../../MuiStyles/TextFieldStyle2";
import { IAuthState } from "../../Interface/GlobalState";
import Context from "../../Store/ContextApi";
import {
  CredentialsType,
  IValidation,
  IState,
  IMutate,
  IResponse,
} from "../../Interface/Login";
import { isValidatedLogin } from "../isValidated";

interface IUserEmail {
  UsernameorEmail: string;
}

interface IPasscode {
  showPassw: boolean;
}

const UserLogIn: FC<IUserEmail> = ({ UsernameorEmail }) => {
  const ContextData = React.useContext(Context);

  const AuthInfo = ContextData?.GetAuthInfo;

  const [visible, setVisible] = React.useState<IPasscode>({
    showPassw: false,
  });

  const [state, setState] = React.useState<IState>({
    open: false,
    message: "",
  });

  const StateInfo = useRecoilValue<Partial<IAuthState>>(AuthInfo);

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
  };

  const handleShowPass = () => {
    setVisible({ showPassw: !visible.showPassw });
  };

  // Facebook authentication route
  const FaceBookLogIn = () => {
    window.open("http://localhost:4000/auth/facebook");
  };

  // Google authentication route
  const GoogleLogIn = () => {
    window.open("http://localhost:4000/login/google");
  };

  // GitHub authentication route
  const GitHubLogIn = () => {
    window.open("http://localhost:4000/auth/github");
  };

  // initialise useId hook for creating unique identifier between the server and the client
  const ID = useId();

  const validate_login = Validate_Login(
    validationSchema.message,
    validationSchema.validation,
    validationSchema.matching
  );

  /* eslint implicit-arrow-linebreak: ["off", "beside"] */
  const wait = (time: number): Promise<Promise<void>> =>
    new Promise((resolve) => setTimeout(resolve, time));

  // using useFormik helper method to create form with formik and Mui fields.
  const Formik = useFormik({
    initialValues: { StudentLogin: { EmailorUsername: "", Password: "" } },
    validationSchema: validate_login,
    onSubmit: async (
      values: CredentialsType,
      { setSubmitting }: FormikHelpers<CredentialsType>
    ) => {
      await wait(1000);

      setSubmitting(false);
    },
  });

  const navigate: NavigateFunction = useNavigate();

  const Mutation: UseMutationResult<IResponse, Error, IMutate> = useMutation<
    IResponse,
    Error,
    IMutate
  >({
    mutationFn: async (Data: IMutate) => {
      // declare the url
      const Url: string = `http://localhost:4000/login/${StateInfo.status}`;
      const res = await axios.post(Url, Data, {
        headers: { "Content-Type": "Application/json" },
      });
      return res.data;
    },
    onSuccess: (newData: IResponse) => {
      if (newData.success === true) {
        setState({ ...state, open: true });
        if (!__.isNil(newData.token)) {
          window.localStorage.setItem("TOKEN", JSON.stringify(newData.token));
          navigate("/home/dashboard", { replace: true });
        }
      } else {
        setState({ ...state, open: true, message: newData.message });
      }
    },
    retry: 1, // retry only once if fails
    retryDelay: 200, // retry after 200 hundreds miliseconds
  });

  return (
    <div>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={state.open}
        autoHideDuration={6000}
        onClose={handleClose}
        color="success"
        sx={{
          color: "#fafafa",
          width: 372,
        }}
        action={
          <React.Fragment>
            <IconButton onClick={handleClose}>
              <CloseIcon sx={{ color: "#fafafa" }} />
            </IconButton>
          </React.Fragment>
        }
      >
        <Alert onClose={handleClose} severity="warning" sx={{ width: "100%" }}>
          <Typography fontWeight="bold">{state.message}</Typography>
        </Alert>
      </Snackbar>
      <Box pt={2} sx={{ flexGrow: 1 }}>
        <form onSubmit={Formik.handleSubmit}>
          <Grid container justifyContent="center" spacing={2}>
            <Grid item xs={11}>
              <Box>
                <TextFieldStyle
                  type="text"
                  variant="outlined"
                  size="small"
                  id={`${ID}_email`}
                  name="StudentLogin.EmailorUsername"
                  fullWidth
                  value={Formik.values.StudentLogin.EmailorUsername}
                  onChange={Formik.handleChange}
                  error={
                    Formik.touched.StudentLogin?.EmailorUsername &&
                    Boolean(Formik.errors.StudentLogin?.EmailorUsername)
                  }
                  helperText={
                    Formik.touched.StudentLogin?.EmailorUsername &&
                    Formik.errors.StudentLogin?.EmailorUsername
                  }
                  sx={{
                    "& .Mui-focused": {
                      border: "green",
                    },
                  }}
                  placeholder={
                    UsernameorEmail === "top"
                      ? "enter your email"
                      : "enter your username"
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        {UsernameorEmail === "top" ? (
                          <MailIcon color="primary" />
                        ) : (
                          <PersonIcon color="primary" />
                        )}
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
            </Grid>
            <Grid item xs={11}>
              <Box>
                <Box pl={28}>
                  <Typography>
                    <RRDLink
                      style={{ color: "#42a5f5", fontSize: "0.8em" }}
                      to="/forgotpassword"
                    >
                      forgot password
                    </RRDLink>
                  </Typography>
                </Box>
                <TextFieldStyle
                  type={visible.showPassw ? "text" : "password"}
                  variant="outlined"
                  size="small"
                  id={`${ID}_password`}
                  name="StudentLogin.Password"
                  fullWidth
                  value={Formik.values.StudentLogin?.Password}
                  onChange={Formik.handleChange}
                  error={
                    Formik.touched.StudentLogin?.Password &&
                    Boolean(Formik.errors.StudentLogin?.Password)
                  }
                  helperText={
                    Formik.touched.StudentLogin?.Password &&
                    Formik.errors.StudentLogin?.Password
                  }
                  placeholder="enter your password.."
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon color="primary" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <Button
                          color="inherit"
                          disableRipple
                          disableElevation
                          onClick={handleShowPass}
                          sx={{
                            fontWeight: "bold",
                            "&:hover": {
                              textDecoration: "underline",
                            },
                          }}
                        >
                          {visible.showPassw ? "hide" : "show"}
                        </Button>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
            </Grid>
            <Grid item xs={11}>
              <Box>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  disableRipple
                  sx={{ fontWeight: "bold", boxShadow: "none" }}
                  type="submit"
                  onClick={() => {
                    const Data: IMutate =
                      UsernameorEmail === "top"
                        ? {
                            email: Formik.values.StudentLogin.EmailorUsername,
                            password: Formik.values.StudentLogin.Password,
                          }
                        : {
                            username:
                              Formik.values.StudentLogin.EmailorUsername,
                            password: Formik.values.StudentLogin.Password,
                          };

                    if (
                      StateInfo.status === "Who are you?" &&
                      !isValidatedLogin(
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
                      !isValidatedLogin(
                        Formik.isValid,
                        Formik.touched,
                        Formik.touched.constructor
                      ) &&
                      StateInfo.status !== "Who are you?"
                    ) {
                      Mutation.mutate(Data);
                    }
                  }}
                >
                  {Mutation.isLoading ? (
                    <PulseLoader
                      color="#fafafa"
                      loading={Mutation.isLoading}
                      size={15}
                      aria-label="Loading Spinner"
                      data-testid="loader"
                    />
                  ) : (
                    "connexion"
                  )}
                </Button>
                <Box sx={{ textAlign: "left" }} pl={24}>
                  <Typography sx={{ color: "#000000" }} variant="body2">
                    no account?
                    <RRDLink to="/register" style={{ color: "#42a5f5" }}>
                      Register
                    </RRDLink>
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={11}>
              <Box>
                <Divider>oR login with</Divider>
              </Box>
            </Grid>
          </Grid>
        </form>
        <Box pt={1}>
          <Stack
            display="flex"
            justifyContent="center"
            spacing={1}
            direction="row"
          >
            <IconButton
              disableRipple
              aria-label="delete"
              sx={{ bgcolor: alpha(grey[100], 0.19) }}
              onClick={FaceBookLogIn}
            >
              <FacebookIcon sx={{ color: "blue" }} />
            </IconButton>

            <IconButton
              disableRipple
              aria-label="delete"
              sx={{ bgcolor: alpha(grey[100], 0.19) }}
              onClick={GoogleLogIn}
            >
              <GoogleIcon sx={{ color: "red" }} />
            </IconButton>
            <IconButton
              disableRipple
              aria-label="delete"
              sx={{ bgcolor: alpha(grey[100], 0.19) }}
              onClick={GitHubLogIn}
            >
              <GitHubIcon sx={{ color: `${blue[800]}` }} />
            </IconButton>
          </Stack>
        </Box>
      </Box>
    </div>
  );
};

export default UserLogIn;

// with useId hook i generate unique identifier for the fields input and using
// for fields better performance while datau is coming from the server to the client

/* <Navigate to="/home/dashboard" replace /> */
