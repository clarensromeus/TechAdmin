// external imports of ressources
import * as React from 'react';
import { Box, Typography } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import IconButton from '@mui/material/IconButton';
import TableHead from '@mui/material/TableHead';
import red from '@mui/material/colors/red';
import DeleteIcon from '@mui/icons-material/Delete';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import Stack from '@mui/material/Stack';
import { blue, grey, orange } from '@mui/material/colors';
import Avatar from '@mui/material/Avatar';
import {
  useQuery,
  UseQueryResult,
  useMutation,
  UseMutationResult,
  useQueryClient,
  QueryClient,
} from '@tanstack/react-query';
import axios from 'axios';
import __ from 'lodash';
import { enqueueSnackbar } from 'notistack';
import { FadeLoader } from 'react-spinners';
// internal crafted imports of ressources
import { StyledTableCell, StyledTableRow } from '../MuiStyles/table';
import CalendarForm from '../components/Home/CalendarForm';
import {
  ICalendar,
  Idelete,
  IdeleteResponse,
  Idata,
} from '../Interface/Calendar';
import CalendarICon from '../images/static/coursesCalendar.png';
import useWindowSize from '../hooks/useWindowSize';
import { IWindow } from '../Interface/student';
import { TextFieldTable } from '../MuiStyles/Nav';

interface IResponse {
  message: string;
  success: boolean;
}

const Calendar: React.FC = () => {
  const [page, setPage] = React.useState<number>(0);

  const queryClient: QueryClient = useQueryClient();

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  // rows of teachers per page
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(5);

  // event handler that defines and show number of teachers per page previously and successively
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const [search, setSearch] = React.useState<string>('');

  const [editData, setEditData] = React.useState<Idata<string>>({
    _id: '',
    Class: '',
    Teacher: '',
    TeacherNumber: '',
    ClassName: '',
    HoursPerWeek: '',
    Day: '',
  });

  const {
    data,
    isLoading,
  }: UseQueryResult<ICalendar<string>, Error> = useQuery<
    ICalendar<string>,
    Error
  >({
    queryKey: ['calendar'],
    queryFn: async () => {
      try {
        // declare the url
        const Url: string = `http://localhost:4000/home/calendar/${9}`;
        const res = await axios.get<ICalendar<string>>(Url);
        return res.data;
      } catch (error) {
        throw new Error(`${error}`);
      }
    },
  });

  const deleteAdmin: UseMutationResult<IdeleteResponse, Error, Idelete> =
    useMutation<IdeleteResponse, Error, Idelete>({
      mutationFn: async (deleteIds: Idelete) => {
        try {
          const res = await axios.delete(
            `http://localhost:4000/home/calendar/delete/${deleteIds._id}`
          );
          return res.data;
        } catch (error) {
          throw new Error(`${error}`);
        }
      },
      onSuccess: (newData: IResponse) => {
        queryClient.invalidateQueries({
          queryKey: ['calendar'],
          exact: true,
        });

        enqueueSnackbar(
          <Typography sx={{ color: grey[600], fontSeize: '0.6rem' }}>
            {newData.message}
          </Typography>,
          {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'center',
            },
            variant: 'success',
            preventDuplicate: true, // prevent noti with the same message to display multiple times
          }
        );
      },
    });

  const handleChangeStudents = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target as typeof event.target & {
      value: { value: string };
    };
    setSearch(target.value);
  };

  const { width }: IWindow = useWindowSize();

  const debounceResult = React.useMemo(() => {
    return __.debounce(handleChangeStudents, 1000);
  }, [search]);

  React.useEffect(() => {
    // cleanup debounce not to perform searching when search gets unmounted
    return () => {
      debounceResult.cancel();
    };
  }, []);

  return (
    <>
      <Box
        pt={1}
        sx={{ width: '100%', boxSizing: 'border-box', px: { md: 1, lg: 1 } }}
      >
        <Box
          pt={2}
          sx={{
            alignSelf: 'center',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',
            bgcolor: orange[100],
            py: 2,
          }}
        >
          <Box pl={2}>
            <Avatar
              alt="courses"
              src={CalendarICon}
              sx={{ height: 65, width: 65 }}
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
                sx={{ fontVariant: 'small-caps' }}
              >
                Courses per Week
              </Typography>
              <Typography
                variant="body2"
                fontWeight="bold"
                fontSize="1.4em"
                sx={{ color: grey[700] }}
              >
                12
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
            Courses Calendar
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
            width: '100%',
            gap: 2,
            overflow: 'auto',
            borderBox: 'box-sizing',
          }}
        >
          <Box
            sx={{
              display: 'table',
              width: 'inherit',
              tableLayout: 'fixed',
              border: 'none',
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
                  '&.MuiTableContainer-root': {
                    boxShadow: 'none',
                    borderBottomRightRadius: 0,
                    borderBottomLeftRadius: 0,
                    borderBottom: 'none',
                  },
                }}
              >
                <Table
                  sx={{
                    '&.MuiTable-root': {
                      borderTop: `7px solid ${grey[100]}`,
                      borderLeft: `7px solid ${grey[100]}`,
                      '&:last-child td': {
                        borderBottom: 0,
                      },
                    },
                  }}
                >
                  <TableHead>
                    <TableRow>
                      <StyledTableCell align="left">
                        <Typography fontWeight="bold" sx={{ color: grey[800] }}>
                          Class
                        </Typography>
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        <Typography fontWeight="bold" sx={{ color: grey[800] }}>
                          Day
                        </Typography>
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        <Typography fontWeight="bold" sx={{ color: grey[800] }}>
                          ClassName
                        </Typography>
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        <Typography fontWeight="bold" sx={{ color: grey[800] }}>
                          Teacher Number
                        </Typography>
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        <Typography fontWeight="bold" sx={{ color: grey[800] }}>
                          Hours Per week
                        </Typography>
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        <Typography fontWeight="bold" sx={{ color: grey[800] }}>
                          Teacher
                        </Typography>
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        <Typography fontWeight="bold" sx={{ color: grey[800] }}>
                          Action
                        </Typography>
                      </StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data?.Data.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                      .filter((courses) =>
                        search.toLowerCase() === ''
                          ? courses
                          : courses.ClassName.toLowerCase().includes(
                              search.toLowerCase()
                            )
                      )
                      .map((row) => (
                        <StyledTableRow key={row._id}>
                          <StyledTableCell component="th" scope="row">
                            {row.Class}
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            <Typography fontFamily="Lucidatypewriter, monospace">
                              {row.Day}
                            </Typography>
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            <Typography fontFamily="Lucidatypewriter, monospace">
                              {row.ClassName}
                            </Typography>
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            <Typography fontFamily="Lucidatypewriter, monospace">
                              {row.TeacherNumber}
                            </Typography>
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            <Typography fontFamily="Lucidatypewriter, monospace">
                              {row.HoursPerWeek}
                            </Typography>
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            <Typography fontFamily="Lucidatypewriter, monospace">
                              {row.Teacher}
                            </Typography>
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            <Stack direction="row" spacing={2}>
                              <IconButton
                                sx={{ bgcolor: red[100] }}
                                onClick={(e: React.MouseEvent) => {
                                  e.preventDefault();
                                  deleteAdmin.mutate({
                                    _id: row._id,
                                  });
                                }}
                              >
                                <DeleteIcon sx={{ color: red[800] }} />
                              </IconButton>
                              <IconButton
                                sx={{ bgcolor: blue[100] }}
                                onClick={(e: React.MouseEvent) => {
                                  e.preventDefault();
                                  const CourseData: Idata<string> = {
                                    _id: row._id,
                                    Class: row.Class,
                                    ClassName: row.ClassName,
                                    TeacherNumber: row.TeacherNumber,
                                    Day: row.Day,
                                    HoursPerWeek: row.HoursPerWeek,
                                    Teacher: row.Teacher,
                                  };
                                  setEditData(CourseData);
                                }}
                              >
                                <RemoveRedEyeIcon sx={{ color: blue[800] }} />
                              </IconButton>
                            </Stack>
                          </StyledTableCell>
                        </StyledTableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
            <TablePagination
              sx={{
                '.MuiTablePagination-toolbar': {
                  border: `1px solid ${grey[200]}`,
                },
              }}
              rowsPerPageOptions={[5, 10, 15, 20]}
              component="div"
              count={data?.Data.length || 0}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Box>
          <Box
            sx={{
              alignSelf: 'flex-end',
              texAlign: 'center',
              width: width && width < 800 ? '100%' : 400,
            }}
          >
            <CalendarForm {...editData} />
          </Box>
          {width && width < 900 ? <Box py={3} /> : <Box py={2} />}
        </Box>
      </Box>
    </>
  );
};

export default Calendar;
