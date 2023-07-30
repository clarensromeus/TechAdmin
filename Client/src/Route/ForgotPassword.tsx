// internal imports of sources
import * as React from "react";
// external imports of sources
import { Box, Typography, Button } from "@mui/material";
import FormLabel from "@mui/material/FormLabel";
import grey from "@mui/material/colors/grey";
import InputAdornment from "@mui/material/InputAdornment";
import { useFormik, FormikHelpers } from "formik";
import {
  useLocation,
  Location,
  useNavigate,
  NavigateFunction,
} from "react-router-dom";
import __ from "lodash";
import red from "@mui/material/colors/red";
// internal crafted imports of sources
import { Validate_Password } from "../utils/validationSchema";
import { CssTextField } from "../MuiStyles/TextFieldStyle";
import { isStateValid } from "../components/StateFromLocation";

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
  // generate unique identifier
  const ID = React.useId();

  /* eslint implicit-arrow-linebreak: ["off", "beside"] */
  const wait = (time: number): Promise<Promise<void>> =>
    new Promise((resolve) => setTimeout(resolve, time));
  // using useFormik helper method to create form with formik and Mui fields.
  const Formik = useFormik({
    initialValues: { Password: "" },
    validationSchema: Validate_Password,
    onSubmit: async (
      values: CredentialsType,
      { setSubmitting }: FormikHelpers<CredentialsType>
    ) => {
      await wait(1000);
      setSubmitting(false);
    },
  });

  const location: Location = useLocation();
  const navigate: NavigateFunction = useNavigate();

  const handleNextField = () => {
    const { Password }: { Password: string } = Formik.values;
    // check if field is not undefined and already validated
    const student: boolean =
      __.isNil(Password) === false && Password.length > 7 && Formik.isValid;
    if (student) {
      navigate("/confirmation", {
        replace: true,
        state: { passCode: Formik.values.Password, status: "forgotPass" },
      });
    }
  };

  return (
    <div>
      <Box
        pt={10}
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        textAlign="center"
      >
        <Box
          sx={{
            width: { xs: 320, sm: 320, lg: 460 },
            textAlign: { xs: "start", sm: "start", lg: "center" },
          }}
        >
          <Typography
            fontWeight="bold"
            fontFamily="Courier New Monospace"
            fontSize={{ xs: "1em", sm: "1.2em", xl: "1.4em" }}
            sx={{ color: grey[900], lineHeight: (theme) => theme.spacing(3) }}
          >
            in order to be able to recover your password first
          </Typography>
        </Box>
        <Box pt={1}>
          <Box display="flex" flexDirection="column" sx={{ width: "320px" }}>
            <Box>
              <FormLabel sx={{ textAlign: "start" }}>
                <Typography
                  sx={{
                    fontSize: "0.9rem",
                    color: `${grey[700]}`,
                    textTransform: "capitalize",
                  }}
                >
                  enter your Password
                </Typography>
              </FormLabel>
              <CssTextField
                variant="outlined"
                type={visible.showPassw ? "text" : "password"}
                size="small"
                id={`${ID}_Password`}
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
            {isStateValid(location.state) && (
              <Box pl={1} sx={{ textAlign: "start" }}>
                <Typography sx={{ color: red[600], fontStyle: "italic" }}>
                  {location.state.message}
                </Typography>
              </Box>
            )}
            <Box alignSelf="center" pt={1}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleNextField}
              >
                Next
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </div>
  );
};

export default CreatePassword;
