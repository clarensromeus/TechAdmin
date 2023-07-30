import * as React from "react";
import { useId } from "react";
import { Box, Typography, Button } from "@mui/material";
import Grid from "@mui/material/Grid";
import FormLabel from "@mui/material/FormLabel";
import InputAdornment from "@mui/material/InputAdornment";
import { useFormik, FormikHelpers } from "formik";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import EditIcon from "@mui/icons-material/Edit";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import MenuItem from "@mui/material/MenuItem";
import orange from "@mui/material/colors/orange";
import grey from "@mui/material/colors/grey";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import axios from "axios";
import isEqual from "lodash/isEqual";
import { useSnackbar } from "notistack";
import {
  useMutation,
  UseMutationResult,
  useQueryClient,
  QueryClient,
} from "@tanstack/react-query";
import { ClipLoader } from "react-spinners";
import { useRecoilValue } from "recoil";
import { nanoid } from "nanoid";
// internal crafted imports of ressources
import { Validate_AdminForm } from "../../utils/validationSchema";
import { TextFieldStyle } from "../../MuiStyles/TextFieldStyle2";
import { IdataForm, AdminInfo, EditAdmin } from "../../Interface/admin";
import useHistory from "../../hooks/useHistory";
import Context from "../../Store/ContextApi";
import { IAuthState } from "../../Interface/GlobalState";
import { IHistory } from "../../Interface/History";
import { isValidated } from "../isValidated";

type Response = {
  message: string;
  success: boolean;
};

interface IResponse {
  message: string;
  success: boolean;
}

const AdminForm: React.FC<IdataForm> = ({
  _id,
  _ID_User,
  Firstname,
  Lastname,
  Password,
  ConfirmPassword,
  Email,
  StatusLevel,
  PromoCode,
}) => {
  // for generating unique id both on the client and server side
  const ID = useId();
  const ContextData = React.useContext(Context);

  const [visible, setVisible] = React.useState<{ showPassw: boolean }>({
    showPassw: false,
  });
  const AuthInfo = useRecoilValue<Partial<IAuthState>>(ContextData.GetAuthInfo);

  const queryClient: QueryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const { CreateHistory } = useHistory();

  const handleShowPass = () => {
    setVisible({ showPassw: !visible.showPassw });
  };
  /* eslint implicit-arrow-linebreak: ["off", "beside"] */
  const Sleep = (time: number): Promise<Promise<void>> =>
    new Promise((resolve) => setTimeout(resolve, time));

  const Formik = useFormik({
    initialValues: {
      AdminRegisteration: {
        Firstname,
        Lastname,
        Email,
        Password,
        ConfirmPassword,
        StatusLevel,
        PromoCode,
      },
    },
    enableReinitialize: true,
    validationSchema: Validate_AdminForm,
    onSubmit: async (
      values: AdminInfo<string>,
      { setSubmitting }: FormikHelpers<AdminInfo<string>>
    ) => {
      Sleep(2000);
      setSubmitting(false);
    },
  });

  // create the mutation instance to register new adminitrators
  const mutation: UseMutationResult<
    Response,
    Error,
    AdminInfo<string>["AdminRegisteration"]
  > = useMutation<Response, Error, AdminInfo<string>["AdminRegisteration"]>({
    mutationFn: async (Data: AdminInfo<string>["AdminRegisteration"]) => {
      try {
        const res = await axios.post(
          "http://localhost:4000/home/administrators/create",
          Data
        );

        return res.data;
      } catch (error) {
        throw new Error(`${error}`);
      }
    },
    onSuccess: (create: Response) => {
      queryClient.invalidateQueries({
        queryKey: ["administrators"],
        exact: true,
      });
      enqueueSnackbar(
        <Typography sx={{ color: grey[600], fontSeize: "0.6rem" }}>
          {create.message}
        </Typography>,
        {
          anchorOrigin: {
            vertical: "top",
            horizontal: "center",
          },
          variant: isEqual(create.success, true) ? "success" : "error",
          preventDuplicate: true, // prevent noti with the same message to display multiple times
        }
      );
    },
  });

  const onSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    // data for creating administrators
    const formData: Omit<IdataForm, "_id" | "_ID_User"> = {
      Firstname: Formik.values.AdminRegisteration.Firstname,
      Lastname: Formik.values.AdminRegisteration.Lastname,
      Email: Formik.values.AdminRegisteration.Email,
      Password: Formik.values.AdminRegisteration.Password,
      ConfirmPassword: Formik.values.AdminRegisteration.ConfirmPassword,
      StatusLevel: Formik.values.AdminRegisteration.StatusLevel,
      PromoCode: Formik.values.AdminRegisteration.PromoCode,
    };

    mutation.mutate(formData);

    // data for creating histories
    const HistoryData: IHistory<string> = {
      ActionPerformer: `${AuthInfo.Payload?._id}`,
      NotiId: `${nanoid()}`,
      ActionCreator: {
        Status: "administrator",
        Firstname: Formik.values.AdminRegisteration.Firstname,
        Lastname: Formik.values.AdminRegisteration.Lastname,
        Image: "",
      },
      NotiReference: "registered",
      AlertText: " is registered by ",
      User: "64bb0a381e5ce1722e328401", // the platform administrator id
    };
    CreateHistory(HistoryData);
  };

  // mutation instance to edit administrators
  const EditMutation: UseMutationResult<IResponse, Error, EditAdmin> =
    useMutation<IResponse, Error, EditAdmin>({
      mutationFn: async (editData: EditAdmin) => {
        const res = await axios.put(
          "http://localhost:4000/home/administrators/edit",
          editData
        );
        return res.data;
      },
      onSuccess: (edit: IResponse) => {
        // invalidate and refetch the query
        queryClient.invalidateQueries({
          queryKey: ["administrators"],
          exact: true,
        });

        enqueueSnackbar(`${edit.message}`, {
          anchorOrigin: {
            vertical: "top",
            horizontal: "center",
          },
          variant: "success",
          preventDuplicate: true, // prevent noti with the same message to display multiple times
        });
      },
    });

  return (
    <div>
      <Paper elevation={1}>
        <Box>
          <Box p={2}>
            <Typography fontFamily="Andale Mono, monospace">
              personal information
            </Typography>
          </Box>
          <Divider />
          <Box pt={1} />
          <form
            onSubmit={
              !isValidated(
                Formik.isValid,
                Formik.touched,
                Formik.touched.constructor
              )
                ? onSubmit
                : Formik.handleSubmit
            }
          >
            <Grid container justifyContent="center" spacing={2}>
              <Grid container item xs={10} spacing={1}>
                <Grid item xs={6}>
                  <Box>
                    <TextFieldStyle
                      type="text"
                      variant="outlined"
                      size="small"
                      id={`${ID}_Firstname`}
                      name="AdminRegisteration.Firstname"
                      value={Formik.values.AdminRegisteration.Firstname}
                      onChange={Formik.handleChange}
                      fullWidth
                      placeholder="Firstname"
                      error={
                        Formik.touched.AdminRegisteration?.Firstname &&
                        Boolean(Formik.errors.AdminRegisteration?.Firstname)
                      }
                      helperText={
                        Formik.touched.AdminRegisteration?.Firstname &&
                        Formik.errors.AdminRegisteration?.Firstname
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
                      name="AdminRegisteration.Lastname"
                      value={Formik.values.AdminRegisteration.Lastname}
                      onChange={Formik.handleChange}
                      fullWidth
                      placeholder="Lastname"
                      error={
                        Formik.touched.AdminRegisteration?.Lastname &&
                        Boolean(Formik.errors.AdminRegisteration?.Lastname)
                      }
                      helperText={
                        Formik.touched.AdminRegisteration?.Lastname &&
                        Formik.errors.AdminRegisteration?.Lastname
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
                    name="AdminRegisteration.Email"
                    value={Formik.values.AdminRegisteration.Email}
                    onChange={Formik.handleChange}
                    fullWidth
                    placeholder="enter your email"
                    error={
                      Formik.touched.AdminRegisteration?.Email &&
                      Boolean(Formik.errors.AdminRegisteration?.Email)
                    }
                    helperText={
                      Formik.touched.AdminRegisteration?.Email &&
                      Formik.errors.AdminRegisteration?.Email
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
                  name="AdminRegisteration.Password"
                  value={Formik.values.AdminRegisteration.Password}
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
                              fontWeight: "bold",
                              "&:hover": {
                                textDecoration: "underline",
                              },
                            }}
                          >
                            {visible.showPassw ? "hide" : "show"}
                          </Button>
                        </Typography>
                      </InputAdornment>
                    ),
                  }}
                  error={
                    Formik.touched.AdminRegisteration?.Password &&
                    Boolean(Formik.errors.AdminRegisteration?.Password)
                  }
                  helperText={
                    Formik.touched.AdminRegisteration?.Password &&
                    Formik.errors.AdminRegisteration?.Password
                  }
                />
              </Grid>
              <Grid item xs={10}>
                <TextFieldStyle
                  type="password"
                  variant="outlined"
                  size="small"
                  id={`${ID}_ConfirmationPassword`}
                  name="AdminRegisteration.ConfirmPassword"
                  value={Formik.values.AdminRegisteration.ConfirmPassword}
                  fullWidth
                  onChange={Formik.handleChange}
                  placeholder="confirm your password"
                  error={
                    Formik.touched.AdminRegisteration?.ConfirmPassword &&
                    Boolean(Formik.errors.AdminRegisteration?.ConfirmPassword)
                  }
                  helperText={
                    Formik.touched.AdminRegisteration?.ConfirmPassword &&
                    Formik.errors.AdminRegisteration?.ConfirmPassword
                  }
                />
              </Grid>
              <Grid item xs={10}>
                <FormControl fullWidth>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={Formik.values.AdminRegisteration.StatusLevel}
                    name="AdminRegisteration.StatusLevel"
                    size="small"
                    displayEmpty
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
                    onChange={Formik.handleChange}
                    renderValue={(selected) => {
                      if (selected.length === 0) {
                        return (
                          <em style={{ color: "grey" }}>Select a status</em>
                        );
                      }
                      return selected;
                    }}
                  >
                    <MenuItem disabled value="">
                      <em>select a status</em>
                    </MenuItem>
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
                  <FormLabel
                    sx={{ fontSize: "0.8em", color: "red", bgcolor: "#fafafa" }}
                  >
                    {Formik.touched.AdminRegisteration?.StatusLevel &&
                      Formik.errors.AdminRegisteration?.StatusLevel}
                  </FormLabel>
                </FormControl>
              </Grid>
              <Grid item xs={10}>
                <Box>
                  <TextFieldStyle
                    type="text"
                    variant="outlined"
                    size="small"
                    id={`${ID}_PromoCode`}
                    name="AdminRegisteration.PromoCode"
                    value={Formik.values.AdminRegisteration.PromoCode}
                    onChange={Formik.handleChange}
                    fullWidth
                    placeholder="enter promo code"
                    error={
                      Formik.touched.AdminRegisteration?.PromoCode &&
                      Boolean(Formik.errors.AdminRegisteration?.PromoCode)
                    }
                    helperText={
                      Formik.touched.AdminRegisteration?.PromoCode &&
                      Formik.errors.AdminRegisteration?.PromoCode
                    }
                  />
                </Box>
              </Grid>
              <Grid item xs={10}>
                <Box
                  sx={{
                    border: `1px solid ${grey[400]}`,
                    width: "inherit",
                    height: 39,
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    borderRadius: "3%",
                  }}
                >
                  <FormLabel
                    sx={{
                      pl: 2,
                      height: "100%",
                      width: 94,
                      bgcolor: "#E8F0FE",
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
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-end",
                  }}
                >
                  <Box pr={1}>
                    <Button
                      variant="contained"
                      color="success"
                      type="submit"
                      // onClick={handleRefresh}
                      startIcon={
                        mutation.isLoading ? (
                          <ClipLoader
                            color="#fafafa"
                            loading={mutation.isLoading}
                            size={10}
                            aria-label="Loading Spinner"
                          />
                        ) : (
                          <PersonAddIcon sx={{ color: "#fafafa" }} />
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
                          Firstname: Formik.values.AdminRegisteration.Firstname,
                          Lastname: Formik.values.AdminRegisteration.Lastname,
                          Email: Formik.values.AdminRegisteration.Email,
                          Password: Formik.values.AdminRegisteration.Password,
                          ConfirmPassword:
                            Formik.values.AdminRegisteration.Firstname,
                          StatusLevel:
                            Formik.values.AdminRegisteration.StatusLevel,
                          PromoCode: Formik.values.AdminRegisteration.PromoCode,
                        });
                      }}
                      sx={{
                        bgcolor: orange[100],
                        ":hover": { bgcolor: orange[100] },
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

export default AdminForm;
