// external imports of ressources
import * as React from "react";
import { Box, Typography } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import IconButton from "@mui/material/IconButton";
import TableHead from "@mui/material/TableHead";
import red from "@mui/material/colors/red";
import DeleteIcon from "@mui/icons-material/Delete";
import InputAdornment from "@mui/material/InputAdornment";
import TablePagination from "@mui/material/TablePagination";
import blue from "@mui/material/colors/blue";
import SearchIcon from "@mui/icons-material/Search";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import Stack from "@mui/material/Stack";
import { orange, grey } from "@mui/material/colors";
import Avatar from "@mui/material/Avatar";
import Snackbar from "@mui/material/Snackbar";
import CloseIcon from "@mui/icons-material/Close";
import Alert from "@mui/material/Alert";
import {
  useQuery,
  UseQueryResult,
  useMutation,
  UseMutationResult,
  useQueryClient,
  QueryClient,
} from "@tanstack/react-query";
import axios from "axios";
import __ from "lodash";
import { FadeLoader } from "react-spinners";
import { useRecoilValue } from "recoil";
// internally crafted imports of ressources
import { StyledTableCell, StyledTableRow } from "../MuiStyles/table";
import PaymentForm from "../components/Home/PaymentForm";
import { TextFieldTable } from "../MuiStyles/Nav";
import {
  IPayResponse,
  IGetPayment,
  IDelete,
  IPayment,
} from "../Interface/payment";
import Context from "../Store/ContextApi";
import braintreeImage from "../images/static/braintreePayment.png";
import useWindowSize from "../hooks/useWindowSize";
import { IWindow } from "../Interface/student";
import { IAuthState } from "../Interface/GlobalState";

interface IState {
  open: boolean;
  message: string;
}

const Payment: React.FC = () => {
  const ContextData = React.useContext(Context);

  const [search, setSearch] = React.useState<string>("");
  const [EditData, setEditData] = React.useState<
    Omit<IPayment, "payment_method_nonce" | "Amount">
  >({} as Omit<IPayment, "payment_method_nonce" | "Amount">);

  // state to hold payment data
  const [page, setPage] = React.useState<number>(0);
  // rows of payment per page
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const AuthInfo = useRecoilValue<Partial<IAuthState>>(ContextData.GetAuthInfo);

  const [state, setState] = React.useState<IState>({
    open: false,
    message: "",
  });

  const { open } = state;

  const queryClient: QueryClient = useQueryClient();

  const { width }: IWindow = useWindowSize();

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

  const { data, isLoading }: UseQueryResult<IGetPayment, Error> = useQuery<
    IGetPayment,
    Error
  >({
    queryKey: ["payments"],
    queryFn: async () => {
      try {
        const payment = await axios.get(
          "http://localhost:4000/home/payment/paid"
        );
        return payment.data;
      } catch (error) {
        throw new Error(`${error}`);
      }
    },
  });

  const deleteStudent: UseMutationResult<IPayResponse, Error, IDelete> =
    useMutation<IPayResponse, Error, IDelete>({
      mutationFn: async (deleteIds: IDelete) => {
        try {
          const res = await axios.delete(
            `http://localhost:4000/home/student/delete/${deleteIds._id}/${deleteIds.ID}`
          );
          return res.data;
        } catch (error) {
          throw new Error(`${error}`);
        }
      },
      onSuccess: () => {
        setState({
          ...state,
          open: true,
          message: "student Deleted with success",
        });
        // invalidate and refetch the query to get fresh data
        queryClient.invalidateQueries({
          queryKey: ["students"],
          exact: true,
        });
      },
    });

  const handleChangeEvent = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target as typeof event.target & {
      value: { value: string };
    };
    setSearch(target.value);
  };

  const debounceResult = React.useMemo(() => {
    // debouncing after 1 second
    return __.debounce(handleChangeEvent, 1000);
  }, [search]);

  React.useEffect(() => {
    return () => {
      // clean up debounce not to trigger another searching while search gets unmounted
      debounceResult.cancel();
    };
  }, []);

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
            <Avatar
              alt="payment"
              src={braintreeImage}
              sx={{ width: 65, height: 65 }}
            />
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
                Paid students
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
            List of paid students
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
                          Class
                        </Typography>
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        <Typography fontWeight="bold" sx={{ color: grey[800] }}>
                          ClassName
                        </Typography>
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        <Typography fontWeight="bold" sx={{ color: grey[800] }}>
                          ID
                        </Typography>
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        <Typography fontWeight="bold" sx={{ color: grey[800] }}>
                          Fee
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
                      .filter((student) =>
                        search.toLowerCase() === ""
                          ? student
                          : student.Firstname.toLowerCase().includes(
                              search.toLowerCase()
                            )
                      )
                      .map((row) => (
                        <StyledTableRow key={row.Firstname}>
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
                              {row.Class}
                            </Typography>
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            <Typography fontFamily="Lucidatypewriter, monospace">
                              {row.ClassName}
                            </Typography>
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            <Typography fontFamily="Lucidatypewriter, monospace">
                              {row.ID}
                            </Typography>
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            <Typography fontFamily="Lucidatypewriter, monospace">
                              {row.Fee}
                            </Typography>
                          </StyledTableCell>
                          {__.isEqual(
                            AuthInfo.Payload?.PersonStatus,
                            "Admin"
                          ) && (
                            <StyledTableCell align="left">
                              <Stack direction="row" spacing={2}>
                                <IconButton
                                  sx={{ bgcolor: red[100] }}
                                  onClick={async (e: React.MouseEvent) => {
                                    try {
                                      e.preventDefault();
                                      await deleteStudent.mutate({
                                        _id: `${row._id}`,
                                        ID: row.ID,
                                      });
                                    } catch (error) {
                                      throw new Error(`${error}`);
                                    }
                                  }}
                                >
                                  <DeleteIcon sx={{ color: red[800] }} />
                                </IconButton>
                                <IconButton
                                  sx={{ bgcolor: blue[100] }}
                                  onClick={(e: React.MouseEvent) => {
                                    e.preventDefault();
                                    const Data: Omit<
                                      IPayment,
                                      "payment_method_nonce" | "Amount"
                                    > = {
                                      _id: row._id,
                                      ID: row.ID,
                                      Firstname: row.Firstname,
                                      Lastname: row.Lastname,
                                      Fee: row.Fee,
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
              <PaymentForm {...EditData} />
            )}
          </Box>
          {width && width < 900 ? <Box py={3} /> : <Box py={1} />}
        </Box>
      </Box>
    </>
  );
};

export default Payment;
