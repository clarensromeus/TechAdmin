import * as React from "react";
import { useId } from "react";
import { Box, Typography, Button } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useFormik, FormikHelpers } from "formik";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import grey from "@mui/material/colors/grey";
import EditIcon from "@mui/icons-material/Edit";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import MenuItem from "@mui/material/MenuItem";
import orange from "@mui/material/colors/orange";
import Paper from "@mui/material/Paper";
import PhoneInput from "react-phone-input-2";
import Divider from "@mui/material/Divider";
import "react-phone-input-2/lib/style.css";
import { enqueueSnackbar } from "notistack";
import { ClipLoader } from "react-spinners";
import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import axios from "axios";
import isEqual from "lodash/isEqual";
import { useRecoilValue } from "recoil";
import { nanoid } from "nanoid";
// internal crafted imports of ressources
import { Validate_TeacherForm } from "../../utils/validationSchema";
import { Idata, Icreate, IEditTeacher } from "../../Interface/teacher";
import isPhoneValidation from "../../utils/PhoneValidation";
import { TextFieldStyle } from "../../MuiStyles/TextFieldStyle2";
import { IResponse, teacherInfo } from "../../Interface/teacher";
import { IHistory } from "../../Interface/History";
import useHistory from "../../hooks/useHistory";
import Context from "../../Store/ContextApi";
import { IAuthState } from "../../Interface/GlobalState";
import { isValidatedTeacher } from "../isValidated";

const TeacherForm: React.FC<Idata> = ({
  _id,
  _ID_User,
  Firstname,
  Lastname,
  Email,
  PhoneNumber,
  HoursPerWeek,
}) => {
  // for generating unique id both on client and server side
  const ID = useId();
  const ContextData = React.useContext(Context);
  const { CreateHistory } = useHistory();

  const queryClient = useQueryClient();

  const [Phone, setPhone] = React.useState<string>(PhoneNumber);
  const [show, setShow] = React.useState<boolean>(false);
  const AuthInfo = useRecoilValue<Partial<IAuthState>>(ContextData.GetAuthInfo);

  /* eslint implicit-arrow-linebreak: ["off", "beside"] */
  const Sleep = (time: number): Promise<Promise<void>> =>
    new Promise((resolve) => setTimeout(resolve, time));

  const Formik = useFormik({
    initialValues: {
      TeacherRegisteration: {
        Firstname,
        Lastname,
        Email,
        HoursPerWeek,
      },
    },
    validationSchema: Validate_TeacherForm,
    enableReinitialize: true,
    onSubmit: async (
      values: teacherInfo<string>,
      { setSubmitting }: FormikHelpers<teacherInfo<string>>
    ) => {
      Sleep(2000);
      setSubmitting(false);
    },
  });

  // create the mutation instance to register new teachers
  const mutation: UseMutationResult<IResponse, Error, Icreate> = useMutation<
    IResponse,
    Error,
    Icreate
  >({
    mutationFn: async (Data: Icreate) => {
      try {
        const res = await axios.post(
          "http://localhost:4000/home/teachers/create",
          Data
        );
        return res.data;
      } catch (error) {
        throw new Error(`${error}`);
      }
    },
    onSuccess: (create: IResponse) => {
      queryClient.invalidateQueries({
        queryKey: ["teachers"],
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
    const Data: Omit<Idata, "_id" | "_ID_User"> = {
      Firstname: Formik.values.TeacherRegisteration.Firstname,
      Lastname: Formik.values.TeacherRegisteration.Lastname,
      Email: Formik.values.TeacherRegisteration.Email,
      HoursPerWeek: Formik.values.TeacherRegisteration.HoursPerWeek,
      PhoneNumber: Phone,
      Image: "",
    };

    mutation.mutate(Data);
    // data for creating histories
    const HistoryData: IHistory<string> = {
      ActionPerformer: `${AuthInfo.Payload?._id}`,
      NotiId: `${nanoid()}`,
      ActionCreator: {
        Status: "Teacher",
        Firstname: Formik.values.TeacherRegisteration.Firstname,
        Lastname: Formik.values.TeacherRegisteration.Lastname,
        Image: "",
      },
      NotiReference: "registered",
      AlertText: " is registered by ",
      User: "64bb0a381e5ce1722e328401", // the platform administrator id
    };
    CreateHistory(HistoryData);
  };

  // mutation instance to edit administrators
  const EditMutation: UseMutationResult<
    IResponse,
    Error,
    IEditTeacher["Edit"]
  > = useMutation<IResponse, Error, IEditTeacher["Edit"]>({
    mutationFn: async (editData: IEditTeacher["Edit"]) => {
      try {
        const res = await axios.put(
          "http://localhost:4000/home/teacher/edit",
          editData
        );
        return res.data;
      } catch (error) {
        throw new Error(`${error}`);
      }
    },
    onSuccess: (edit: IResponse) => {
      enqueueSnackbar(
        <Typography sx={{ color: grey[600], fontSeize: "0.6rem" }}>
          {edit.message}
        </Typography>,
        {
          anchorOrigin: {
            vertical: "top",
            horizontal: "center",
          },
          variant: "success",
          preventDuplicate: true, // prevent noti with the same message to display multiple times
        }
      );
      // invalidate and refetch the query
      queryClient.invalidateQueries({
        queryKey: ["teachers"],
        exact: true,
      });
    },
  });

  React.useEffect(() => {
    if (Formik.isSubmitting) {
      setShow(!show);
    }
  }, [Formik.isSubmitting]);

  return (
    <div>
      <Paper elevation={1}>
        <Box>
          <Box p={2}>
            <Typography fontFamily="Andale Mono, monospace">
              personal information
            </Typography>
          </Box>
          <Divider sx={{ width: "inherit" }} />
          <Box pt={2} />
          <form
            onSubmit={
              !isValidatedTeacher(
                Formik.isValid,
                Formik.touched,
                Formik.touched.constructor
              ) && isPhoneValidation(Phone)
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
                      name="TeacherRegisteration.Firstname"
                      value={Formik.values.TeacherRegisteration.Firstname}
                      onChange={Formik.handleChange}
                      fullWidth
                      placeholder="Firstname"
                      error={
                        Formik.touched.TeacherRegisteration?.Firstname &&
                        Boolean(Formik.errors.TeacherRegisteration?.Firstname)
                      }
                      helperText={
                        Formik.touched.TeacherRegisteration?.Firstname &&
                        Formik.errors.TeacherRegisteration?.Firstname
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
                      name="TeacherRegisteration.Lastname"
                      value={Formik.values.TeacherRegisteration.Lastname}
                      onChange={Formik.handleChange}
                      fullWidth
                      placeholder="Lastname"
                      error={
                        Formik.touched.TeacherRegisteration?.Lastname &&
                        Boolean(Formik.errors.TeacherRegisteration?.Lastname)
                      }
                      helperText={
                        Formik.touched.TeacherRegisteration?.Lastname &&
                        Formik.errors.TeacherRegisteration?.Lastname
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
                    name="TeacherRegisteration.Email"
                    value={Formik.values.TeacherRegisteration.Email}
                    onChange={Formik.handleChange}
                    fullWidth
                    placeholder="enter your email"
                    error={
                      Formik.touched.TeacherRegisteration?.Email &&
                      Boolean(Formik.errors.TeacherRegisteration?.Email)
                    }
                    helperText={
                      Formik.touched.TeacherRegisteration?.Email &&
                      Formik.errors.TeacherRegisteration?.Email
                    }
                  />
                </Box>
              </Grid>
              <Grid item xs={10}>
                <PhoneInput
                  value={Phone}
                  placeholder="enter your password"
                  enableSearch
                  searchPlaceholder="search..."
                  country="us"
                  regions={["north-america", "carribean", "south-america"]}
                  buttonStyle={{ backgroundColor: "white" }}
                  onChange={(phone) => setPhone(phone)}
                  inputStyle={{ width: "100%", height: "40px" }}
                />
                {!isPhoneValidation(Phone) && show && (
                  <FormLabel
                    sx={{ fontSize: "0.8em", color: "red", bgcolor: "#fafafa" }}
                  >
                    enter a valid phone number
                  </FormLabel>
                )}
              </Grid>
              <Grid item xs={10}>
                <FormControl fullWidth>
                  <Select
                    labelId="demo-simple-select-label"
                    id={`${ID}_HoursPerWeek`}
                    value={Formik.values.TeacherRegisteration.HoursPerWeek}
                    size="small"
                    name="TeacherRegisteration.HoursPerWeek"
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
                    displayEmpty
                    onChange={Formik.handleChange}
                    renderValue={(selected) => {
                      if (selected.length === 0) {
                        return <em style={{ color: "grey" }}>Select hours</em>;
                      }
                      return selected;
                    }}
                  >
                    <MenuItem disabled value="">
                      <em>Select hours</em>
                    </MenuItem>
                    <MenuItem value="7am-5pm">7am-5pm</MenuItem>
                    <MenuItem value="8am-9pm">8am-9pm</MenuItem>
                    <MenuItem value="7am-2pm">7am-2pm</MenuItem>
                    <MenuItem value="9am-4pm">9am-4pm</MenuItem>
                    <MenuItem value="9am-1pm">9am-1pm</MenuItem>
                    <MenuItem value="8am-3pm">8am-3pm</MenuItem>
                    <MenuItem value="8am-5pm">8am-5pm</MenuItem>
                    <MenuItem value="7am-6am">7am-6am</MenuItem>
                    <MenuItem value="9am-8pm">9am-8pm</MenuItem>
                  </Select>
                  <FormLabel
                    sx={{ fontSize: "0.8em", color: "red", bgcolor: "#fafafa" }}
                  >
                    {Formik.touched.TeacherRegisteration?.HoursPerWeek &&
                      Formik.errors.TeacherRegisteration?.HoursPerWeek}
                  </FormLabel>
                </FormControl>
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
                      type="submit"
                      sx={{
                        bgcolor: orange[100],
                        ":hover": { bgcolor: orange[100] },
                      }}
                      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                        e.preventDefault();
                        EditMutation.mutate({
                          _id,
                          _ID_User,
                          Firstname:
                            Formik.values.TeacherRegisteration.Firstname,
                          Lastname: Formik.values.TeacherRegisteration.Lastname,
                          Email: Formik.values.TeacherRegisteration.Email,
                          HoursPerWeek:
                            Formik.values.TeacherRegisteration.HoursPerWeek,
                          PhoneNumber: Phone,
                        });
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

export default TeacherForm;
