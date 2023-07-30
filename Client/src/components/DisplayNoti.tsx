import * as React from "react";
import { Box, IconButton, Typography } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import InputAdornment from "@mui/material/InputAdornment";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import List from "@mui/material/List";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import __ from "lodash";
import { useNavigate, NavigateFunction } from "react-router-dom";
// internally crafted imports of ressources
import { IDisplayNotiProps } from "../Interface/Notifications";
import { SugestionTextField } from "../MuiStyles/TextFieldStyle";

const DisplayNotifications: React.FC<IDisplayNotiProps> = ({
  openNoti,
  setOpenNoti,
  Notifications,
}) => {
  const [search, setSearch] = React.useState<string>("");

  const handleChangeEvent = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target as typeof event.target & {
      value: { value: string };
    };
    setSearch(target.value);
  };

  const navigate: NavigateFunction = useNavigate();

  // create debounce function
  const debounceResult = React.useMemo(() => {
    return __.debounce(handleChangeEvent, 1000);
  }, [search]);

  React.useEffect(() => {
    return () => {
      debounceResult.cancel();
    };
  }, []);

  return (
    <>
      <Box
        sx={{
          display: openNoti ? "block" : "none",
          width: 310,
          zIndex: (theme) => theme.zIndex.drawer + 3,
          position: "fixed",
          top: "9%",
          left: "58%",
        }}
      >
        <Paper elevation={2}>
          <Box py={1} px={2} sx={{ display: "flex", flexDirection: "column" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography pt={1} fontWeight="bold">
                notifications
              </Typography>
              <IconButton>
                <EditIcon color="success" />
              </IconButton>
            </Box>
            <Box>
              <SugestionTextField
                size="small"
                variant="outlined"
                placeholder="search.."
                onChange={debounceResult}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            <Divider sx={{ pt: 2 }} />
            <Box>
              <List
                dense
                sx={{
                  width: "100%",
                  position: "relative",
                  overflow: "auto",
                  maxHeight: 240,
                  maxWidth: 280,
                  bgcolor: "background.paper",
                }}
              >
                {Notifications?.filter((noti) =>
                  search.toLowerCase() === ""
                    ? noti
                    : noti.User.Firstname.toLowerCase().includes(
                        search.toLowerCase()
                      )
                ).map((noti) => {
                  // const date: string = dayjs(student).format('LL');
                  return (
                    <ListItem key={noti._id} disablePadding>
                      <ListItemAvatar>
                        <Avatar alt={noti._id} src={noti.User.Image} />
                      </ListItemAvatar>
                      <ListItemText
                        id={`${noti._id}`}
                        primary={
                          <Box sx={{ display: "flex", gap: 1 }}>
                            <Typography fontWeight="bold">
                              {noti.User.Firstname.toLowerCase().charAt(0)}.
                              {noti.User.Lastname.toLowerCase()}
                            </Typography>
                            <Typography>
                              {__.isEqual(noti.NotiReference, "likes") ||
                              __.isEqual(noti.NotiReference, "dislikes")
                                ? `${noti.NotiReference} your post`
                                : __.isEqual(noti.NotiReference, "messaged")
                                ? "messaged you"
                                : __.isEqual(noti.NotiReference, "comments")
                                ? "comments your post"
                                : __.isEqual(noti.NotiReference, "shares")
                                ? "shares your post"
                                : __.isEqual(noti.NotiReference, "Retweeted")
                                ? "retweets a post"
                                : __.isEqual(noti.NotiReference, "unfollow")
                                ? "unfollows you"
                                : "follows you"}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          __.gt(__.size(noti.AlertText), 1) && (
                            <Typography color="text.secondary">
                              &quot; {noti.AlertText.slice(0, 20)}... &quot;
                            </Typography>
                          )
                        }
                      />
                    </ListItem>
                  );
                })}
              </List>
            </Box>
            <Divider />
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Button
                variant="text"
                color="primary"
                sx={{ textTransform: "capitalize" }}
                onClick={() => {
                  navigate("/home/notifications");
                  setOpenNoti(false);
                }}
              >
                see more...
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </>
  );
};

export default DisplayNotifications;
