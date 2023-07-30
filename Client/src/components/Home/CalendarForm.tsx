import * as React from "react";
import { useId } from "react";
import { Box, Typography, Button } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useFormik, FormikHelpers } from "formik";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import grey from "@mui/material/colors/grey";
import EditIcon from "@mui/icons-material/Edit";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import MenuItem from "@mui/material/MenuItem";
import orange from "@mui/material/colors/orange";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import FormLabel from "@mui/material/FormLabel";
import { ClipLoader } from "react-spinners";
import axios from "axios";
import isEqual from "lodash/isEqual";
import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
// internal crafted imports of ressources
import { Validate_CalendarForm } from "../../utils/validationSchema";
import { TextFieldStyle } from "../../MuiStyles/TextFieldStyle2";
import isPhoneValidation from "../../utils/PhoneValidation";
import { IEditCalendar, Icreate, Idata } from "../../Interface/Calendar";
import { isValidatedCalendar } from "../isValidated";

type CalendarInfo<T> = {
  CalendarRegisteration: {
    Class: T;
    Teacher: T;
    ClassName: T;
    HoursPerWeek: T;
    Day: T;
  };
};

interface IResponse {
  message: string;
  success: boolean;
}

const CalendarForm: React.FC<Idata<string>> = ({
  _id,
  Class,
  Teacher,
  TeacherNumber,
  Day,
  HoursPerWeek,
  ClassName,
}) => {
  // for generating unique id both on client and server side
  const ID = useId();

  const [Phone, setPhone] = React.useState<string>(TeacherNumber);
  const [show, setShow] = React.useState<boolean>(false);

  /* eslint implicit-arrow-linebreak: ["off", "beside"] */
  const Sleep = (time: number): Promise<Promise<void>> =>
    new Promise((resolve) => setTimeout(resolve, time));

  const Formik = useFormik({
    initialValues: {
      CalendarRegisteration: {
        Class,
        Teacher,
        HoursPerWeek,
        ClassName,
        Day,
      },
    },
    validationSchema: Validate_CalendarForm,
    enableReinitialize: true,
    onSubmit: async (
      values: CalendarInfo<string>,
      { setSubmitting }: FormikHelpers<CalendarInfo<string>>
    ) => {
      Sleep(2000);
      setSubmitting(false);
    },
  });

  const queryClient = useQueryClient();

  // create the mutation instance to register new Courses
  const mutation: UseMutationResult<
    IResponse,
    Error,
    Icreate<string>
  > = useMutation<IResponse, Error, Icreate<string>>({
    mutationFn: async (Data: Icreate<string>) => {
      try {
        const res = await axios.post(
          "http://localhost:4000/home/calendar/create",
          Data
        );
        return res.data;
      } catch (error) {
        throw new Error(`${error}`);
      }
    },
    onSuccess: (create: IResponse) => {
      queryClient.invalidateQueries({
        queryKey: ["calendar"],
        exact: true,
      });

      enqueueSnackbar(`${create.message}`, {
        anchorOrigin: {
          vertical: "top",
          horizontal: "center",
        },
        variant: isEqual(create.success, true) ? "success" : "error",
        preventDuplicate: true, // prevent noti with the same message to display multiple times
      });
    },
  });

  const onSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    const Data = {
      ClassName: Formik.values.CalendarRegisteration.ClassName,
      Teacher: Formik.values.CalendarRegisteration.Teacher,
      Class: Formik.values.CalendarRegisteration.Class,
      HoursPerWeek: Formik.values.CalendarRegisteration.HoursPerWeek,
      Day: Formik.values.CalendarRegisteration.Day,
      TeacherNumber: Phone,
    };

    mutation.mutate(Data);
  };

  // mutation instance to edit Courses
  const EditMutation: UseMutationResult<
    IResponse,
    Error,
    IEditCalendar["Edit"]
  > = useMutation<IResponse, Error, IEditCalendar["Edit"]>({
    mutationFn: async (editData: IEditCalendar["Edit"]) => {
      try {
        const res = await axios.put(
          "http://localhost:4000/home/calendar/edit",
          editData
        );
        return res.data;
      } catch (error) {
        throw new Error(`${error}`);
      }
    },
    onSuccess: (editData: IResponse) => {
      // invalidate and refetch the query to be always having fresh data
      queryClient.invalidateQueries({
        queryKey: ["calendar"],
      });

      enqueueSnackbar(`${editData.message}`, {
        anchorOrigin: {
          vertical: "top",
          horizontal: "center",
        },
        variant: "success",
        preventDuplicate: true, // prevent noti with the same message to display multiple times
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
              Calendar information
            </Typography>
          </Box>
          <Divider />
          <Box pt={1} />
          <form
            onSubmit={
              !isValidatedCalendar(
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
                      id={`${ID}_ClassName`}
                      name="CalendarRegisteration.ClassName"
                      value={Formik.values.CalendarRegisteration.ClassName}
                      onChange={Formik.handleChange}
                      fullWidth
                      placeholder="Classname.."
                      error={
                        Formik.touched.CalendarRegisteration?.ClassName &&
                        Boolean(Formik.errors.CalendarRegisteration?.ClassName)
                      }
                      helperText={
                        Formik.touched.CalendarRegisteration?.ClassName &&
                        Formik.errors.CalendarRegisteration?.ClassName
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
                      id={`${ID}_Teacher`}
                      name="CalendarRegisteration.Teacher"
                      value={Formik.values.CalendarRegisteration.Teacher}
                      onChange={Formik.handleChange}
                      fullWidth
                      placeholder="teacher name..."
                      error={
                        Formik.touched.CalendarRegisteration?.Teacher &&
                        Boolean(Formik.errors.CalendarRegisteration?.Teacher)
                      }
                      helperText={
                        Formik.touched.CalendarRegisteration?.Teacher &&
                        Formik.errors.CalendarRegisteration?.Teacher
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
                    name="CalendarRegisteration.HoursPerWeek"
                    value={Formik.values.CalendarRegisteration.HoursPerWeek}
                    onChange={Formik.handleChange}
                    fullWidth
                    placeholder="enter Hours..."
                    error={
                      Formik.touched.CalendarRegisteration?.HoursPerWeek &&
                      Boolean(Formik.errors.CalendarRegisteration?.HoursPerWeek)
                    }
                    helperText={
                      Formik.touched.CalendarRegisteration?.HoursPerWeek &&
                      Formik.errors.CalendarRegisteration?.HoursPerWeek
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
                    id="day-selection"
                    value={Formik.values.CalendarRegisteration.Day}
                    name="CalendarRegisteration.Day"
                    size="small"
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
                        return <em style={{ color: "grey" }}>Select a Day</em>;
                      }
                      return selected;
                    }}
                  >
                    <MenuItem disabled value="">
                      <em>Select a Day</em>
                    </MenuItem>
                    <MenuItem value="Monday">Monday</MenuItem>
                    <MenuItem value="Tuesday">Tuesday</MenuItem>
                    <MenuItem value="Wednesday">Wednesday</MenuItem>
                    <MenuItem value="Thursday">thursday</MenuItem>
                    <MenuItem value="friday">friday</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={10}>
                <FormControl fullWidth>
                  <Select
                    id="class-selection"
                    value={Formik.values.CalendarRegisteration.Class}
                    name="CalendarRegisteration.Class"
                    size="small"
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
                        return (
                          <em style={{ color: "grey" }}>Select a Class</em>
                        );
                      }
                      return selected;
                    }}
                  >
                    <MenuItem disabled value="">
                      <em>Select a Class</em>
                    </MenuItem>
                    <MenuItem value="1st grade">1st grade</MenuItem>
                    <MenuItem value="2nd grade">2nd grade</MenuItem>
                    <MenuItem value="3th grade">3th grade</MenuItem>
                    <MenuItem value="4th grade">4th grade</MenuItem>
                    <MenuItem value="5th grade">5th grade</MenuItem>
                  </Select>
                </FormControl>
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
                      sx={{
                        bgcolor: orange[100],
                        ":hover": { bgcolor: orange[100] },
                      }}
                      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                        e.preventDefault();
                        EditMutation.mutate({
                          _id,
                          Day: Formik.values.CalendarRegisteration.Day,
                          HoursPerWeek:
                            Formik.values.CalendarRegisteration.HoursPerWeek,
                          TeacherNumber: Phone,
                          Class: Formik.values.CalendarRegisteration.Class,
                          Teacher: Formik.values.CalendarRegisteration.Teacher,
                          ClassName:
                            Formik.values.CalendarRegisteration.ClassName,
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

export default CalendarForm;
