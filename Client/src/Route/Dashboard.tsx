// internal imports of sources
import * as React from "react";
// external imports of sources
import { Box, Typography } from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import GroupsIcon from "@mui/icons-material/Groups";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import orange from "@mui/material/colors/orange";
import green from "@mui/material/colors/green";
import blue from "@mui/material/colors/blue";
import Avatar from "@mui/material/Avatar";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import __ from "lodash";
import { FadeLoader } from "react-spinners";
import grey from "@mui/material/colors/grey";
// internal crafted imports of sources
import TalentedStudent from "../components/Home/TalentedStudents";
import { StyledTableCell, StyledTableRow } from "../MuiStyles/table";
import useWindowSize from "../hooks/useWindowSize";
import { Console } from "console";

interface IadminData<S> {
  Data: {
    id: S;
    _ID_User: S;
    Firstname: S;
    Lastname: S;
    Email: S;
    Image: S;
    PromoCode: S;
    StatusLevel: S;
  }[];
}

interface IStats<N> {
  students: N;
  admins: N;
  teachers: N;
}

const Dashboard: React.FC = () => {
  const [nofstudents, setnofStudents] = React.useState<number>(0);
  const [nofteachers, setnofTeachers] = React.useState<number>(0);
  const [nofadministrators, setnofadministrators] = React.useState<number>(0);

  const { data, isLoading } = useQuery<IadminData<string>, Error>({
    queryKey: ["staff"],
    queryFn: async () => {
      try {
        // declare the url
        const Url: string = "http://localhost:4000/home/dashboard";
        const response = await axios.get<IadminData<string>>(Url);
        return response.data;
      } catch (error) {
        throw new Error(`${error}`);
      }
    },
  });

  const { data: stats } = useQuery<IStats<number>, Error>({
    queryKey: ["stats"],
    queryFn: async () => {
      try {
        // declare the url
        const Url: string = "http://localhost:4000/home/dashboard/stats/total";
        const response = await axios.get<IStats<number>>(Url);
        return response.data;
      } catch (error) {
        throw new Error(`${error}`);
      }
    },
  });

  // memoize the number of students, admins and teachers, for re-rendering prevention
  const activeUsers = React.useMemo(() => {
    return {
      nofstudents,
      nofteachers,
      nofadministrators,
    };
  }, [nofstudents, nofteachers, nofadministrators]);

  const handleStudents = () => {
    if (__.lt(activeUsers.nofstudents, stats?.students ?? 2)) {
      setnofStudents((prev) => prev + 1);
    }
  };

  const handleTeachers = () => {
    if (__.lt(activeUsers.nofteachers, stats?.teachers ?? 2)) {
      setnofTeachers((prev) => prev + 1);
    }
  };

  const handleAdministrators = () => {
    if (__.lt(activeUsers.nofadministrators, stats?.admins ?? 2)) {
      setnofadministrators((prev) => prev + 1);
    }
  };

  React.useEffect(() => {
    setTimeout(handleStudents, 10);
    setTimeout(handleTeachers, 10);
    setTimeout(handleAdministrators, 10);
  }, [
    activeUsers.nofstudents,
    activeUsers.nofadministrators,
    activeUsers.nofteachers,
  ]);

  const statistics = [
    {
      User: "Students",
      Icon: <SchoolIcon sx={{ fontSize: 50, color: orange[700] }} />,
      quantity: activeUsers.nofstudents,
    },
    {
      User: "Administrators",
      Icon: <ManageAccountsIcon sx={{ fontSize: 50, color: green[700] }} />,
      quantity: activeUsers.nofadministrators,
    },
    {
      User: "Teachers",
      Icon: <GroupsIcon sx={{ fontSize: 50, color: blue[700] }} />,
      quantity: activeUsers.nofteachers,
    },
  ];

  const { width }: { width?: number } = useWindowSize();

  return (
    <>
      {isLoading ? (
        <Box
          sx={{
            display: "block",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(50%, 50%)",
          }}
        >
          <FadeLoader
            color="hsla(0, 0%, 80%)"
            loading={isLoading}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </Box>
      ) : (
        <Box
          sx={{
            width: "100%",
            height: "100%",
            pt: 2,
          }}
        >
          <Box
            sx={{
              width: "inherit",
              display: "flex",
              flexDirection: width && width < 700 ? "column" : "row",
              justifyContent: "space-between",
              flexWrap: "wrap",
              alignItems: "flex-start",
              gap: 1,
            }}
          >
            <Box
              sx={{
                width:
                  width && width < 900 && width > 700
                    ? "50%"
                    : width && width < 700
                    ? "100%"
                    : "max(68%, 20%)",
                display: "flex",
                flexDirection: {
                  xs: "column",
                  sm: "column",
                  md: "row",
                  lg: "row",
                },
                flexGrow: { xs: 0, sm: 0, md: 1, lg: 2 },
                gap: { xs: 1, sm: 1, md: 2, lg: 2 },
                justifyContent: "space-between",
                mx: { md: 1, lg: 1 },
              }}
            >
              {statistics.map((stat) => {
                return (
                  <Box
                    key={stat.User}
                    sx={{
                      borderLeftWidth: 2,
                      borderLeftColor:
                        stat.User === "Students"
                          ? orange[700]
                          : stat.User === "Administrators"
                          ? green[700]
                          : blue[700],
                      borderLeftStyle: "solid",
                      width:
                        width && width < 900
                          ? "max(370, 200)"
                          : "max(250px, 100px)",
                      height: 130,
                    }}
                  >
                    <Paper elevation={3}>
                      <Box
                        p={4}
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        flexDirection="row"
                      >
                        <Box>
                          <IconButton sx={{ bgcolor: grey[100] }}>
                            {stat.Icon}
                          </IconButton>
                        </Box>
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                          flexDirection="column"
                        >
                          <Typography
                            variant="body2"
                            fontSize="1em"
                            color="text.secondary"
                          >
                            {stat.User}
                          </Typography>
                          <Typography variant="body2" fontSize="1.3em">
                            {stat.quantity}
                          </Typography>
                        </Box>
                      </Box>
                    </Paper>
                  </Box>
                );
              })}
            </Box>
            <Box
              sx={{
                width:
                  width && width < 900 && width > 700
                    ? "56%"
                    : width && width < 700
                    ? "100%"
                    : "max(29%, 20%)",
                borderBox: "box-sizing",
                position: "sticky",
                top: { lg: 45 },
              }}
            >
              <Box
                sx={{
                  mx: "3px",
                }}
              >
                <TalentedStudent />
              </Box>
            </Box>
            <Box
              sx={{
                mt: { lg: -19 },
                width: width && width < 900 ? "100%" : "max(83%, 30%)",
                overflow: "auto",
                borderBox: "box-sizing",
                mx: { md: 1, lg: 1 },
              }}
            >
              <Box
                sx={{
                  width: "inherit",
                  display: "table",
                  tableLayout: "fixed",
                }}
              >
                <TableContainer component={Paper}>
                  <Typography
                    fontFamily="Andale Mono, monospace"
                    textTransform="capitalize"
                    pl={2}
                  >
                    administrators board
                  </Typography>
                  <Table aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <StyledTableCell align="left">
                          <Typography color="text.secondary">Image</Typography>
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          <Typography color="text.secondary">
                            Firstname
                          </Typography>
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          <Typography color="text.secondary">
                            Lastname
                          </Typography>
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          <Typography color="text.secondary">Email</Typography>
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          <Typography color="text.secondary">
                            PromoCode
                          </Typography>
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          <Typography color="text.secondary">
                            StatusLevel
                          </Typography>
                        </StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data?.Data.map((row) => (
                        <StyledTableRow key={row.Firstname}>
                          <StyledTableCell component="th" scope="row">
                            <Avatar alt="admin image" src={row.Image}>
                              {__.isEqual(row.Image, "") &&
                                `${row.Firstname.toUpperCase().charAt(
                                  0
                                )}${row.Lastname.toUpperCase().charAt(0)}`}
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
                              {row.PromoCode}
                            </Typography>
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            <Typography fontFamily="Lucidatypewriter, monospace">
                              {row.StatusLevel}
                            </Typography>
                          </StyledTableCell>
                        </StyledTableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
};

export default Dashboard;
