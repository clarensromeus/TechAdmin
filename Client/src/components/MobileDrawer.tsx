import * as React from "react";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import orange from "@mui/material/colors/orange";
import { useNavigate, NavigateFunction } from "react-router-dom";
import {
  AccountCircle,
  LockOpenOutlined,
  SettingsOutlined,
  PowerSettingsNew,
} from "@mui/icons-material";
import { decodeToken } from "react-jwt";
import __ from "lodash";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { grey } from "@mui/material/colors";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import BookmarksIcon from "@mui/icons-material/Bookmarks";
// external imports of ressources
import { IMobileDrawerProps } from "../Interface/Notifications";
import { IAuthState } from "../Interface/GlobalState";
import Context from "../Store/ContextApi";
import { useRecoilValue } from "recoil";

interface IDest {
  destination: string;
  Icon: React.ReactElement;
  path: string;
}

const MobileDrawer: React.FC<IMobileDrawerProps> = ({
  _id,
  Firstname,
  Lastname,
  Image,
  openMoDrawer,
  setOpenMoDrawer,
}) => {
  const [selectedIndex, setSelectedIndex] = React.useState<number>(1);
  const TokenInfo: any = decodeToken(
    `${window.localStorage.getItem("TOKEN") || ""}`
  );

  const ContextData = React.useContext(Context);

  const AuthInfo = useRecoilValue<Partial<IAuthState>>(ContextData.GetAuthInfo);

  const handleListItemClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number
  ) => {
    setSelectedIndex(index);
  };

  const handleCloseDrawerClose = () => {
    setOpenMoDrawer(false);
  };

  const Destinations: IDest[] = [
    {
      destination: "Teacher",
      Icon: <PeopleAltIcon />,
      path: "/home/teachers",
    },
    {
      destination: "Calendar",
      Icon: <BookmarksIcon />,
      path: "/home/calendar",
    },
  ];

  const Profile: IDest[] = [
    {
      destination: "Profile",
      Icon: <AccountCircle sx={{ color: orange[700] }} />,
      path: `/home/profile/${AuthInfo.Payload?.PersonStatus}/${AuthInfo.Payload?._id}`,
    },
    {
      destination: "Lock",
      Icon: <LockOpenOutlined sx={{ color: orange[700] }} />,
      path: "/lockscreen",
    },
    {
      destination: "Settings",
      Icon: <SettingsOutlined sx={{ color: orange[700] }} />,
      path: "/home/settings",
    },
    {
      destination: "LogOut",
      Icon: <PowerSettingsNew sx={{ color: orange[700] }} />,
      path: "/login",
    },
  ];

  const navigate: NavigateFunction = useNavigate();

  return (
    <>
      <Drawer
        anchor="top"
        open={openMoDrawer}
        onClose={handleCloseDrawerClose}
        sx={{ height: "100%" }}
      >
        <Box pt={7} sx={{ width: "100%" }}>
          <Box sx={{ display: "flex", gap: 2 }} p={2}>
            <Box>
              <Avatar alt="profile" src={Image} />
            </Box>
            <Box pt={1}>
              <Typography textTransform="capitalize" fontWeight="bold">
                {`${Firstname}  ${Lastname}`}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Divider />
        <Box sx={{ bgcolor: grey[100], width: "inherit" }} px={2} py={1}>
          <Typography>See navigations</Typography>
        </Box>
        <Box sx={{ width: "inherit" }}>
          <List component="nav" aria-label="main mailbox folders">
            {Destinations.map((dest, index) => {
              const { destination, Icon, path }: IDest = dest;
              return (
                <ListItem key={index}>
                  <ListItemButton
                    onClick={() => {
                      if (__.isEqual("/login", path)) {
                        window.localStorage.removeItem("TOKEN");
                        navigate(path);
                      }
                      navigate(path);
                      setOpenMoDrawer(false);
                    }}
                  >
                    <ListItemIcon>{Icon}</ListItemIcon>
                    <ListItemText primary={destination} />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </Box>
        <Box sx={{ bgcolor: grey[100], width: "inherit" }} px={2} py={1}>
          <Typography>User related go-to</Typography>
        </Box>
        <Box sx={{ width: "inherit" }}>
          <List component="nav" aria-label="main mailbox folders">
            {Profile.map((dest, index) => {
              const { destination, Icon, path }: IDest = dest;
              return (
                <ListItem key={index}>
                  <ListItemButton
                    disableRipple
                    selected={selectedIndex === 1}
                    onClick={(event) => {
                      handleListItemClick(event, 1);
                      navigate(path);
                      setOpenMoDrawer(false);
                    }}
                  >
                    <ListItemIcon>{Icon}</ListItemIcon>
                    <ListItemText primary={destination} />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
          <Box sx={{ p: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => {
                navigate(`/home/students/${_id}`);
                setOpenMoDrawer(false);
              }}
            >
              self-assessment
            </Button>
          </Box>
        </Box>
        <Box pt={2} />
      </Drawer>
    </>
  );
};

export default MobileDrawer;
