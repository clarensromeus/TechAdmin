// external imports of ressources
import * as React from "react";
import { Box, TablePagination, Typography } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import IconButton from "@mui/material/IconButton";
import TableHead from "@mui/material/TableHead";
import orange from "@mui/material/colors/orange";
import Avatar from "@mui/material/Avatar";
import grey from "@mui/material/colors/grey";
import DeleteIcon from "@mui/icons-material/Delete";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import __ from "lodash/";
import {
  useQuery,
  useMutation,
  useQueryClient,
  UseMutationResult,
  UseQueryResult,
} from "@tanstack/react-query";
import axios from "axios";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import InputAdornment from "@mui/material/InputAdornment";
import red from "@mui/material/colors/red";
import blue from "@mui/material/colors/blue";
import { FadeLoader } from "react-spinners";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { useRecoilValue } from "recoil";
import { nanoid } from "nanoid";
// internal crafted imports of ressources
import { StyledTableCell, StyledTableRow } from "../MuiStyles/table";
import AdminForm from "../components/Home/adminForm";
import { Idata, Idelete, IdeleteResponse, Iadmin } from "../Interface/admin";
import useWindowSize from "../hooks/useWindowSize";
import { TextFieldTable } from "../MuiStyles/TextFieldStyle2";
import { IWindow } from "../Interface/student";
import { IHistory } from "../Interface/History";
import useHistory from "../hooks/useHistory";
import Context from "../Store/ContextApi";
import { IAuthState } from "../Interface/GlobalState";
import Administrator from "../images/static/administrator.png";

interface IState {
  open: boolean;
  message: string;
}

const Admin: React.FC = () => {
  const ContextData = React.useContext(Context);
  // state to hold admin data
  const [page, setPage] = React.useState<number>(0);
  // rows of administrator per page
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(5);
  const AuthInfo = useRecoilValue<Partial<IAuthState>>(ContextData.GetAuthInfo);

  const [editData, setEditData] = React.useState<Idata>({
    _id: "",
    _ID_User: "",
    Firstname: "",
    Lastname: "",
    Password: "",
    ConfirmPassword: "",
    Email: "",
    StatusLevel: "",
    PromoCode: "",
  });

  const [state, setState] = React.useState<IState>({
    open: false,
    message: "",
  });
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

  const queryClient = useQueryClient();

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  // event handler that defines and show number of admins per page previously and successively
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const {
    data,
    isLoading,
  }: UseQueryResult<Iadmin<string>, Error> = useQuery<
    Iadmin<string>,
    Error,
    Iadmin<string>
  >({
    queryKey: ["administrators"],
    queryFn: async () => {
      // declare the url
      const Url: string = `http://localhost:4000/home/administrators/${9}`;
      const res = await axios.get<Iadmin<string>>(Url);
      return res.data;
    },
  });

  const handleChangeStudents = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target as typeof event.target & {
      value: { value: string };
    };
    setSearch(target.value);
  };

  const { width }: IWindow = useWindowSize();
  const { CreateHistory } = useHistory();

  const debounceResult = React.useMemo(() => {
    return __.debounce(handleChangeStudents, 1000);
  }, [search]);

  const deleteAdmin: UseMutationResult<IdeleteResponse, Error, Idelete> =
    useMutation<IdeleteResponse, Error, Idelete>({
      mutationFn: async (deleteIds: Idelete) => {
        const res = await axios.delete(
          `http://localhost:4000/home/admin/delete/${deleteIds._id}/${deleteIds._ID_User}`
        );
        return res.data;
      },
      onSuccess: (newData: IdeleteResponse) => {
        setState({
          ...state,
          message: newData.message,
          open: true,
        });
        // invalidate and refetch the query to get fresh data
        queryClient.invalidateQueries({
          queryKey: ["administrators"],
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
    <>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
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
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          {state.message}
        </Alert>
      </Snackbar>
      <Box
        pt={1}
        sx={{ width: "100%", boxSizing: "border-box", px: { md: 1, lg: 1 } }}
      >
        <Box
          pt={2}
          sx={{
            alignSelf: "center",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
            bgcolor: orange[100],
            py: 2,
          }}
        >
          <Box pl={2}>
            <Avatar alt="" src={Administrator} sx={{ width: 56, height: 56 }} />
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
                color="text.secondary"
                fontSize="1.2em"
                fontWeight="bold"
                sx={{ fontVariant: "small-caps" }}
              >
                Administrators
              </Typography>
              <Typography
                variant="body2"
                fontWeight="bold"
                fontSize="1.4em"
                sx={{ color: grey[700] }}
              >
                50
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
            List of administrators
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            width: "100%",
            gap: 2,
            overflow: "auto",
            borderBox: "box-sizing",
          }}
        >
          <Box
            sx={{
              display: "table",
              width: "inherit",
              tableLayout: "fixed",
              border: "none",
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
                />
              </Box>
            ) : (
              <TableContainer
                sx={{
                  "&.MuiTableContainer-root": {
                    boxShadow: "none",
                    borderBottomRightRadius: 0,
                    borderBottomLeftRadius: 0,
                    borderBottom: "none",
                  },
                }}
              >
                <Table
                  sx={{
                    "&.MuiTable-root": {
                      borderTop: `7px solid ${grey[100]}`,
                      borderLeft: `7px solid ${grey[100]}`,
                      "&:last-child td": {
                        borderBottom: 0,
                      },
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
                          StatusLevel
                        </Typography>
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        <Typography fontWeight="bold" sx={{ color: grey[800] }}>
                          PromoCode
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
                      .filter((admin) =>
                        search.toLowerCase() === ""
                          ? admin
                          : admin.Firstname.toLowerCase().includes(
                              search.toLowerCase()
                            )
                      )
                      .map((row) => (
                        <StyledTableRow key={row.Firstname}>
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
                              {row.StatusLevel}
                            </Typography>
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            <Typography fontFamily="Lucidatypewriter, monospace">
                              {row.PromoCode}
                            </Typography>
                          </StyledTableCell>
                          {__.isEqual(
                            AuthInfo.Payload?.PersonStatus,
                            "Admin"
                          ) && (
                            <StyledTableCell align="left">
                              <Stack direction="row" spacing={2}>
                                <IconButton
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
                                        Status: "administrator",
                                        Firstname: row.Firstname,
                                        Lastname: row.Lastname,
                                        Image: row.Image || "",
                                      },
                                      NotiReference: "delete",
                                      AlertText: "a is deleted by ",
                                      User: "64bb0a381e5ce1722e328401", // the platform administrator id
                                    };
                                    CreateHistory(HistoryData);
                                  }}
                                  sx={{ bgcolor: red[100] }}
                                >
                                  <DeleteIcon sx={{ color: red[800] }} />
                                </IconButton>
                                <IconButton
                                  onClick={(e: React.MouseEvent) => {
                                    e.preventDefault();
                                    const Data: Idata = {
                                      _id: row._id,
                                      _ID_User: row._ID_User,
                                      Firstname: row.Firstname,
                                      Lastname: row.Lastname,
                                      Password: row.Password,
                                      ConfirmPassword: row.ConfirmPassword,
                                      Email: row.Email,
                                      StatusLevel: row.StatusLevel,
                                      PromoCode: row.PromoCode,
                                    };
                                    setEditData(Data);
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
              <AdminForm {...editData} />
            )}
          </Box>
          {width && width < 900 ? <Box py={3} /> : <Box py={1} />}
        </Box>
      </Box>
    </>
  );
};

export default Admin;
