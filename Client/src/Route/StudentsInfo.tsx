// external imports of ressources
import * as React from "react";
import { Box, Typography } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import IconButton from "@mui/material/IconButton";
import TableHead from "@mui/material/TableHead";
import orange from "@mui/material/colors/orange";
import Avatar from "@mui/material/Avatar";
import grey from "@mui/material/colors/grey";
import red from "@mui/material/colors/red";
import blue from "@mui/material/colors/blue";
import DeleteIcon from "@mui/icons-material/Delete";
import Stack from "@mui/material/Stack";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import axios from "axios";
import { NavigateFunction, useNavigate } from "react-router-dom";
import __ from "lodash";
import {
  useQuery,
  UseQueryResult,
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import { FadeLoader } from "react-spinners";
import { nanoid } from "nanoid";
import { useRecoilValue } from "recoil";
// internally crafted imports of ressources
import { StyledTableCell, StyledTableRow } from "../MuiStyles/table";
import StudentsForm from "../components/Home/studentsForm";
import { editData } from "../Interface/student";
import {
  IdeleteResponse,
  Idelete,
  IStudentData,
  IState,
  IWindow,
} from "../Interface/student";
import useWindowSize from "../hooks/useWindowSize";
import { TextFieldTable } from "../MuiStyles/Nav";
import GraduatedHot from "../images/static/students.png";
import Context from "../Store/ContextApi";
import useHistory from "../hooks/useHistory";
import { IHistory } from "../Interface/History";
import { IAuthState } from "../Interface/GlobalState";

const StudentsInfo: React.FC = () => {
  const navigate: NavigateFunction = useNavigate();
  const ContextData = React.useContext(Context);
  const { CreateHistory } = useHistory();

  const [state, setState] = React.useState<IState>({
    open: false,
  });
  const AuthInfo = useRecoilValue<Partial<IAuthState>>(ContextData.GetAuthInfo);

  const { open } = state;

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

  const queryClient = useQueryClient();

  const [editdata, setEditData] = React.useState<editData>({
    _id: "",
    _ID_User: "",
    Firstname: "",
    Lastname: "",
    Email: "",
    Password: "",
    ConfirmPassword: "",
    Class: "",
    SchoolLevel: "",
    ClassName: "",
  });

  const [page, setPage] = React.useState<number>(0);
  // rows of teachers per page
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(5);
  const [search, setSearch] = React.useState<string>("");

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  // event handler that defines and show number of teachers per page previously and successively
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleChangeStudents = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target as typeof event.target & {
      value: { value: string };
    };
    // just trigger the search after an interval of 2 second
    setSearch(target.value);
  };

  const debounceResult = React.useMemo(() => {
    return __.debounce(handleChangeStudents, 1000);
  }, [search]);

  const {
    data,
    isLoading,
  }: UseQueryResult<IStudentData<string>, Error> = useQuery<
    IStudentData<string>,
    Error
  >({
    queryKey: ["students"],
    queryFn: async () => {
      // declare the url
      const Url: string = "http://localhost:4000/home/students";
      const res = await axios.get<IStudentData<string>>(Url);
      return res.data;
    },
  });

  const { width }: IWindow = useWindowSize();

  const deleteStudent: UseMutationResult<IdeleteResponse, Error, Idelete> =
    useMutation<IdeleteResponse, Error, Idelete>({
      mutationFn: async (deleteIds: Idelete) => {
        const res = await axios.delete(
          `http://localhost:4000/home/student/delete/${deleteIds._id}/${deleteIds._ID_User}`
        );
        return res.data;
      },
      onSuccess: () => {
        setState({
          ...state,
          open: true,
        });
        // invalidate and refetch the query to get fresh data
        queryClient.invalidateQueries({
          queryKey: ["students"],
          exact: true,
        });
      },
    });

  React.useEffect(() => {
    // cleanup debounce not to perform searching when search gets unmounted
    return () => {
      debounceResult.cancel();
    };
  }, []);

  return (
    <div>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={open}
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
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          the student is successfully Deleted
        </Alert>
      </Snackbar>
      <Box
        pt={1}
        sx={{
          width: "100%",
          boxSizing: "border-box",
          px: { md: 1, lg: 1 },
        }}
      >
        <Box
          sx={{
            alignSelf: "center",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            width: "inherit",
            bgcolor: orange[100],
            py: 2,
          }}
        >
          <Box pl={2}>
            <Avatar alt="" src={GraduatedHot} sx={{ height: 70, width: 70 }} />
          </Box>
          <Box pr={2}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              flexDirection="column"
            >
              <Typography
                variant="body2"
                fontSize="1.2em"
                fontWeight="bold"
                sx={{ fontVariant: "small-caps" }}
              >
                Students
              </Typography>
              <Typography
                variant="body2"
                fontWeight="bold"
                fontSize="1.4em"
                sx={{ color: grey[700] }}
              >
                78
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box pt={2} mx={{ md: 1, lg: 1 }}>
        <Box mb="5px">
          <Typography
            fontFamily="Andale Mono, monospace"
            textTransform="capitalize"
          >
            List of students
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 2,
            flexDirection: "column",
            width: "100%",
            overflow: "auto",
            boxSizing: "border-box",
          }}
        >
          <Box
            sx={{
              display: "table",
              width: "inherit",
              tableLayout: "fixed",
              borderTopWidth: 0,
            }}
          >
            <Box>
              <TextFieldTable
                variant="outlined"
                size="small"
                fullWidth
                onChange={debounceResult}
                placeholder="search..."
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            {isLoading ? (
              <Box pt={13} pl={40}>
                <FadeLoader
                  color="hsla(0, 0%, 80%)"
                  loading={isLoading}
                  aria-label="Loading Spinner"
                  data-testid="loader"
                />
              </Box>
            ) : (
              <TableContainer
                sx={{
                  "&.MuiTableContainer-root": {
                    boxShadow: "none",
                    borderTopWidth: 0,
                    borderBottomRightRadius: 0,
                    borderBottomLeftRadius: 0,
                  },
                }}
              >
                <Table
                  aria-label="simple table"
                  sx={{
                    "&.MuiTable-root": {
                      borderTop: `7px solid ${grey[100]}`,
                      borderLeft: `7px solid ${grey[100]}`,
                    },
                  }}
                >
                  <TableHead>
                    <TableRow>
                      <StyledTableCell align="left">
                        <Typography fontWeight="bold" sx={{ color: grey[800] }}>
                          Image
                        </Typography>
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        <Typography fontWeight="bold" sx={{ color: grey[800] }}>
                          Firstname
                        </Typography>
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        <Typography fontWeight="bold" sx={{ color: grey[800] }}>
                          Lastname
                        </Typography>
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        <Typography fontWeight="bold" sx={{ color: grey[800] }}>
                          Email
                        </Typography>
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        <Typography fontWeight="bold" sx={{ color: grey[800] }}>
                          SchooleLevel
                        </Typography>
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        <Typography fontWeight="bold" sx={{ color: grey[800] }}>
                          Class
                        </Typography>
                      </StyledTableCell>
                      {__.isEqual(AuthInfo.Payload?.PersonStatus, "Admin") && (
                        <StyledTableCell align="left">
                          <Typography
                            fontWeight="bold"
                            sx={{ color: grey[800] }}
                          >
                            Action
                          </Typography>
                        </StyledTableCell>
                      )}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data?.doc
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .filter((value) => {
                        return search.toLowerCase() === ""
                          ? value
                          : value.Firstname.toLowerCase().includes(search);
                      })
                      .map((row) => (
                        <StyledTableRow
                          key={row.Firstname}
                          onClick={() =>
                            navigate(row._id, {
                              replace: true,
                            })
                          }
                        >
                          <StyledTableCell component="th" scope="row">
                            <Avatar alt="admin image" src={row.Image}>
                              {__.isEqual(row.Image, "") && (
                                <Typography>
                                  {row.Firstname.toUpperCase().charAt(0)}
                                  {row.Lastname.toUpperCase().charAt(0)}
                                </Typography>
                              )}
                            </Avatar>
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            <Typography fontFamily="Lucidatypewriter, monospace">
                              {row.Firstname}
                            </Typography>
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            <Typography fontFamily="Lucidatypewriter, monospace">
                              {row.Lastname}
                            </Typography>
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            <Typography fontFamily="Lucidatypewriter, monospace">
                              {row.Email}
                            </Typography>
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            <Typography fontFamily="Lucidatypewriter, monospace">
                              {row.SchoolLevel}
                            </Typography>
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            <Typography fontFamily="Lucidatypewriter, monospace">
                              {row.Class}
                            </Typography>
                          </StyledTableCell>
                          {__.isEqual(
                            AuthInfo.Payload?.PersonStatus,
                            "Admin"
                          ) && (
                            <StyledTableCell align="left">
                              <Stack direction="row" spacing={1}>
                                <IconButton
                                  sx={{ bgcolor: red[100] }}
                                  onClick={(e: React.MouseEvent) => {
                                    e.preventDefault();
                                    deleteStudent.mutate({
                                      _id: row._id,
                                      _ID_User: row._ID_User,
                                    });

                                    // data for creating histories
                                    const HistoryData: IHistory<string> = {
                                      ActionPerformer: `${AuthInfo.Payload?._id}`,
                                      NotiId: `${nanoid()}`,
                                      ActionCreator: {
                                        Status: "student",
                                        Firstname: row.Firstname,
                                        Lastname: row.Lastname,
                                        Image: row.Image,
                                      },
                                      NotiReference: "delete",
                                      AlertText: " is deleted by ",
                                      User: "64bb0a381e5ce1722e328401", // the platform administrator id
                                    };
                                    CreateHistory(HistoryData);
                                  }}
                                >
                                  <DeleteIcon sx={{ color: red[800] }} />
                                </IconButton>
                                <IconButton
                                  sx={{ bgcolor: blue[100] }}
                                  onClick={(e: React.MouseEvent) => {
                                    e.preventDefault();
                                    const Data: editData = {
                                      _id: row._id,
                                      _ID_User: row._ID_User,
                                      Firstname: row.Firstname,
                                      Lastname: row.Lastname,
                                      Password: row.Password,
                                      ConfirmPassword: row?.ConfirmPassword,
                                      Email: row?.Email,
                                      SchoolLevel: row.SchoolLevel,
                                      Class: row.Class,
                                      ClassName: row.ClassName,
                                    };
                                    setEditData(Data);
                                  }}
                                >
                                  <RemoveRedEyeIcon sx={{ color: blue[800] }} />
                                </IconButton>
                              </Stack>
                            </StyledTableCell>
                          )}
                        </StyledTableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
            <TablePagination
              sx={{
                ".MuiTablePagination-toolbar": {
                  border: `1px solid ${grey[200]}`,
                },
              }}
              rowsPerPageOptions={[5, 10, 15, 20]}
              component="div"
              count={data?.doc.length || 0}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Box>
          <Box
            sx={{
              alignSelf: "flex-end",
              texAlign: "center",
              width: width && width < 800 ? "100%" : 400,
            }}
          >
            {__.isEqual(AuthInfo.Payload?.PersonStatus, "Admin") && (
              <StudentsForm {...editdata} />
            )}
          </Box>
        </Box>
        {width && width < 900 ? <Box py={4} /> : <Box py={1} />}
      </Box>
    </div>
  );
};

export default StudentsInfo;
