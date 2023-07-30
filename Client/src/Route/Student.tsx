import * as React from "react";
import { Box, Typography, Grid } from "@mui/material";
import { useParams } from "react-router-dom";
import Paper from "@mui/material/Paper";
import {
  useQuery,
  UseQueryResult,
  useMutation,
  UseMutationResult,
} from "@tanstack/react-query";
import axios from "axios";
import blue from "@mui/material/colors/blue";
import grey from "@mui/material/colors/grey";
import red from "@mui/material/colors/red";
import { useNavigate } from "react-router-dom";
import SchoolIcon from "@mui/icons-material/School";
import PrintIcon from "@mui/icons-material/Print";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Alert from "@mui/material/Alert";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { FadeLoader } from "react-spinners";
import { PDFDownloadLink } from "@react-pdf/renderer";
// external imports of ressources
import PDFDocument from "../components/PDFfile";
import {
  IInfo,
  IcardInfo,
  IdeleteResponse,
  Idelete,
} from "../Interface/student";
import CardStudents from "../components/Cardstudents";
import useWindowSize from "../hooks/useWindowSize";

interface IState {
  message: string;
  open: boolean;
}

const Student: React.FC = () => {
  const params = useParams();

  const [state, setState] = React.useState<IState>({
    open: false,
    message: "",
  });

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

  const { data, isLoading }: UseQueryResult<IInfo<string>> = useQuery<
    IInfo<string>
  >({
    queryKey: ["Student"],
    queryFn: async () => {
      const response = await axios.get(
        `http://localhost:4000/home/students/${params.id}`
      );

      return response.data;
    },
  });

  const deleteStudent: UseMutationResult<IdeleteResponse, Error, Idelete> =
    useMutation<IdeleteResponse, Error, Idelete>({
      mutationFn: async (deleteIds: Idelete) => {
        const res = await axios.delete(
          `http://localhost:4000/home/student/delete/${deleteIds._id}/${deleteIds._ID_User}`
        );
        return res.data;
      },
      onSuccess: (newData: IdeleteResponse) => {
        setState({ ...state, open: true, message: newData.message });
      },
    });

  const navigate = useNavigate();
  const { width }: { width?: number } = useWindowSize();

  const CardInfo: IcardInfo = {
    Image: `${data?.doc.Image}`,
    Firstname: `${data?.doc.Firstname}`,
    Lastname: `${data?.doc.Lastname}`,
  };

  const PDFinfo: Omit<IInfo<string>["doc"], "Password" | "ConfirmPassword"> = {
    _id: `${data?.doc._id}`,
    _ID_User: `${data?.doc._ID_User}`,
    Firstname: `${data?.doc.Firstname}`,
    Lastname: `${data?.doc.Lastname}`,
    Email: `${data?.doc.Email}`,
    Image: `${data?.doc.Image}`,
    SchoolLevel: `${data?.doc.SchoolLevel}`,
    Class: `${data?.doc.Class}`,
    ClassName: `${data?.doc.ClassName}`,
  };

  return (
    <div>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        open={state.open}
        autoHideDuration={6000}
        onClose={handleClose}
        color="success"
        sx={{ color: "#fafafa" }}
        action={
          <React.Fragment>
            <IconButton onClick={handleClose}>
              <CloseIcon sx={{ color: "#fafafa" }} />
            </IconButton>
          </React.Fragment>
        }
      >
        <Alert
          onClose={handleClose}
          severity={deleteStudent.isSuccess ? "success" : "error"}
          sx={{ width: "100%" }}
        >
          <Typography fontWeight="bold">
            {deleteStudent.isSuccess
              ? `${data?.doc.Firstname} ${data?.doc.Lastname} deleted with success`
              : "sorry student cannot delete, an error occured"}
          </Typography>
        </Alert>
      </Snackbar>
      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", pt: 20 }}>
          <FadeLoader
            color="hsla(0, 0%, 80%)"
            loading={isLoading}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </Box>
      ) : (
        <Box
          py={width && width < 700 ? 0 : 2}
          sx={{ width: "max(100%, 20%)", pt: 1 }}
        >
          <Grid container rowSpacing={2}>
            <Grid item xs={12} sm={8} md={4} lg={4}>
              <Box px={width && width < 700 ? 0 : 2}>
                <CardStudents {...CardInfo} />
              </Box>
            </Grid>
            <Grid
              item
              container
              xs={12}
              md={8}
              display="flex"
              flexDirection="row"
            >
              <Grid xs={12} sm={12} item>
                <Paper
                  elevation={0}
                  sx={{ px: width && width < 700 ? 0 : 2, border: "none" }}
                >
                  <Box sx={{ bgcolor: blue[200] }}>
                    <Box p={1} sx={{ display: "flex", gap: 2 }}>
                      <SchoolIcon sx={{ pt: "6px" }} />
                      <Typography fontSize="1.5em" textTransform="capitalize">
                        Student Informations
                      </Typography>
                    </Box>
                  </Box>
                  <Box py={2}>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                        "& > .info": {
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                          bgcolor: grey[100],
                          "& .th": {
                            width: {
                              lg: "max(400px, 200px)",
                              md: "max(400px, 200px)",
                            },
                          },
                        },
                      }}
                    >
                      <Box className="info">
                        <Typography fontWeight="bold" pl={1}>
                          Firstname:
                        </Typography>
                        <Typography className="th" color="text.secondary">
                          {data?.doc.Firstname}
                        </Typography>
                      </Box>
                      <Box className="info">
                        <Typography fontWeight="bold" pl={1}>
                          Lastname:
                        </Typography>
                        <Typography color="text.secondary" className="th">
                          {data?.doc.Lastname}
                        </Typography>
                      </Box>
                      <Box className="info">
                        <Typography fontWeight="bold" pl={1}>
                          Class:
                        </Typography>
                        <Typography color="text.secondary" className="th">
                          {data?.doc.Class}
                        </Typography>
                      </Box>
                      <Box className="info">
                        <Typography fontWeight="bold" pl={1}>
                          ClassName:
                        </Typography>
                        <Typography color="text.secondary" className="th">
                          {data?.doc.ClassName}
                        </Typography>
                      </Box>
                      <Box className="info">
                        <Typography fontWeight="bold" pl={1}>
                          Email:
                        </Typography>
                        <Typography color="text.secondary" className="th">
                          {data?.doc.Email}
                        </Typography>
                      </Box>
                      <Box className="info">
                        <Typography fontWeight="bold" pl={1}>
                          ID:
                        </Typography>
                        <Typography color="text.secondary" className="th">
                          {data?.doc._ID_User}
                        </Typography>
                      </Box>
                      <Box className="info">
                        <Typography fontWeight="bold" pl={1}>
                          Date of birth:
                        </Typography>
                        <Typography
                          color="text.secondary"
                          className="th"
                          pl={1}
                        >
                          12/09/2000
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
              <Grid alignSelf="end" item xs={12} sm={12} md={12}>
                <Box
                  pt={2}
                  sx={{
                    width: "inherit",
                    display: "flex",
                    justifyContent: "flex-end",
                    px: width && width < 700 ? 0 : 2,
                  }}
                >
                  <Stack direction="row" spacing={2}>
                    <Button
                      variant="text"
                      startIcon={<ArrowBackIosIcon />}
                      sx={{ textTransform: "capitalize" }}
                      onClick={() => {
                        navigate("../");
                      }}
                    >
                      back
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={<DeleteIcon sx={{ color: red[700] }} />}
                      onClick={() => {
                        deleteStudent.mutate({
                          _id: `${data?.doc._id}`,
                          _ID_User: `${data?.doc._ID_User}`,
                        });
                      }}
                      sx={{
                        textTransform: "capitalize",
                        bgcolor: red[100],
                        color: red[700],
                        boxShadow: "none",
                        ":hover": {
                          bgcolor: red[100],
                          color: red[700],
                        },
                      }}
                    >
                      delete
                    </Button>
                    <PDFDownloadLink
                      document={<PDFDocument {...PDFinfo} />}
                      fileName="StudentInfo.pdf"
                    >
                      {({ loading }) =>
                        loading ? (
                          <Button
                            variant="contained"
                            startIcon={<PrintIcon />}
                            sx={{
                              textTransform: "capitalize",
                              boxShadow: "none",
                            }}
                          >
                            loading...
                          </Button>
                        ) : (
                          <Button
                            variant="contained"
                            startIcon={<PrintIcon />}
                            sx={{
                              textTransform: "capitalize",
                              boxShadow: "none",
                            }}
                          >
                            print
                          </Button>
                        )
                      }
                    </PDFDownloadLink>
                  </Stack>
                </Box>
              </Grid>
            </Grid>
          </Grid>
          <Box pt={{ xs: 8, sm: 6, md: 2, lg: 2 }} />
        </Box>
      )}
    </div>
  );
};

export default Student;
