// external imports of ressources
import * as React from "react";
import { Box, Typography } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import TableHead from "@mui/material/TableHead";
import orange from "@mui/material/colors/orange";
import Avatar from "@mui/material/Avatar";
import grey from "@mui/material/colors/grey";
import green from "@mui/material/colors/green";
import blue from "@mui/material/colors/blue";
import red from "@mui/material/colors/red";
import DeleteIcon from "@mui/icons-material/Delete";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import SearchIcon from "@mui/icons-material/Search";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import CloseIcon from "@mui/icons-material/Close";
import Alert from "@mui/material/Alert";
import axios from "axios";
import GroupsIcon from "@mui/icons-material/Groups";
import {
  useQuery,
  UseQueryResult,
  UseMutationResult,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { nanoid } from "nanoid";
import __ from "lodash";
import { useRecoilValue } from "recoil";
// internal crafted imports of ressources
import { StyledTableCell, StyledTableRow } from "../MuiStyles/table";
import TeachersForm from "../components/Home/teachersForm";
import { IdeleteResponse, Idelete, Idata } from "../Interface/teacher";
import { TextFieldTable } from "../MuiStyles/TextFieldStyle2";
import { Iteachers } from "../Interface/teacher";
import useWindowSize from "../hooks/useWindowSize";
import { IWindow } from "../Interface/student";
import { IHistory } from "../Interface/History";
import useHistory from "../hooks/useHistory";
import { IAuthState } from "../Interface/GlobalState";
import Context from "../Store/ContextApi";

interface IState {
  open: boolean;
  message: string;
}

const Students: React.FC = () => {
  const ContextData = React.useContext(Context);
  const [page, setPage] = React.useState<number>(0);

  const [editData, setEditData] = React.useState<Idata>({
    _id: "",
    _ID_User: "",
    Firstname: "",
    Lastname: "",
    Email: "",
    Image: "",
    HoursPerWeek: "",
    PhoneNumber: "",
  });
  const AuthInfo = useRecoilValue<Partial<IAuthState>>(ContextData.GetAuthInfo);

  // rows of teachers per page
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(5);
  const [state, setState] = React.useState<IState>({
    open: false,
    message: "",
  });

  const { open } = state;
  const { CreateHistory } = useHistory();

  const [search, setSearch] = React.useState<string>("");

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

  const queryClient = useQueryClient();

  const {
    data,
  }: UseQueryResult<Iteachers<string>, Error> = useQuery<
    Iteachers<string>,
    Error
  >({
    queryKey: ["teachers"],
    queryFn: async () => {
      // declare the url
      const Url: string = "http://localhost:4000/home/teachers";
      const res = await axios.get<Iteachers<string>>(Url);
      return res.data;
    },
  });

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

  const deleteAdmin: UseMutationResult<IdeleteResponse, Error, Idelete> =
    useMutation<IdeleteResponse, Error, Idelete>({
      mutationFn: async (deleteIds: Idelete) => {
        const res = await axios.delete(
          `http://localhost:4000/home/teacher/delete/${deleteIds._id}/${deleteIds._ID_User}`
        );
        return res.data;
      },
      onSuccess: (newData: IdeleteResponse) => {
        setState({ ...state, open: true, message: newData.message });
        // invalidate and refetch the query to get fresh data
        queryClient.invalidateQueries({
          queryKey: ["teachers"],
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

  const { width }: IWindow = useWindowSize();

  return (
    <>
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
          {state.message}
        </Alert>
      </Snackbar>
      <Box
        pt={1}
        sx={{ width: "100%", px: { md: 1, lg: 1 }, boxSizing: "border-box" }}
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
            <IconButton sx={{ bgcolor: "#ffffff" }} disableRipple>
              <GroupsIcon sx={{ fontSize: 56, color: green[700] }} />
            </IconButton>
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
                Teachers
              </Typography>
              <Typography
                variant="body2"
                fontWeight="bold"
                fontSize="1.4em"
                sx={{ color: grey[700] }}
              >
                23
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
            list of teachers
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
            borderBox: "box-sizing",
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
                        HoursPerWek
                      </Typography>
                    </StyledTableCell>
                    <StyledTableCell align="left">
                      <Typography fontWeight="bold" sx={{ color: grey[800] }}>
                        PhoneNumber
                      </Typography>
                    </StyledTableCell>
                    {__.isEqual(AuthInfo.Payload?.PersonStatus, "Admin") && (
                      <StyledTableCell align="left">
                        <Typography fontWeight="bold" sx={{ color: grey[800] }}>
                          Action
                        </Typography>
                      </StyledTableCell>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data?.doc
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .filter((teacher) =>
                      search.toLowerCase() === ""
                        ? teacher
                        : teacher.Firstname.toLowerCase().includes(search)
                    )
                    .map((row) => (
                      <StyledTableRow key={row.Firstname}>
                        <StyledTableCell component="th" scope="row">
                          <Avatar alt="teacher image" src={row.Image}>
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
                            {row.HoursPerWeek}
                          </Typography>
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          <Typography fontFamily="Lucidatypewriter, monospace">
                            {row.PhoneNumber}
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
                                  deleteAdmin.mutate({
                                    _id: row._id,
                                    _ID_User: row._ID_User,
                                  });

                                  // data for creating histories
                                  const HistoryData: IHistory<string> = {
                                    ActionPerformer: `${AuthInfo.Payload?._id}`,
                                    NotiId: `${nanoid()}`,
                                    ActionCreator: {
                                      Status: "teacher",
                                      Firstname: row.Firstname,
                                      Lastname: row.Lastname,
                                      Image: row.Image,
                                    },
                                    NotiReference: "delete",
                                    AlertText: "a is deleted by ",
                                    User: "64bb0a381e5ce1722e328401", // the platform administrator id
                                  };
                                  CreateHistory(HistoryData);
                                }}
                              >
                                <DeleteIcon sx={{ color: red[800] }} />
                              </IconButton>
                              <IconButton
                                onClick={(e: React.MouseEvent) => {
                                  e.preventDefault();
                                  const newData: Idata = {
                                    _id: row._id,
                                    _ID_User: row._ID_User,
                                    Firstname: row.Firstname,
                                    Lastname: row.Lastname,
                                    Email: row.Email,
                                    Image: "",
                                    HoursPerWeek: row.HoursPerWeek,
                                    PhoneNumber: row.PhoneNumber,
                                  };
                                  setEditData(newData);
                                }}
                                sx={{ bgcolor: blue[100] }}
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
              <TeachersForm {...editData} />
            )}
          </Box>
        </Box>
        {width && width < 900 ? <Box py={3} /> : <Box py={2} />}
      </Box>
    </>
  );
};

export default Students;
