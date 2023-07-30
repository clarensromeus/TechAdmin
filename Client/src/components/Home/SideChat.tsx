import * as React from "react";
// external imports  of ressources
import { useRecoilValue } from "recoil";
import Typography from "@mui/material/Typography";
import grey from "@mui/material/colors/grey";
import EditIcon from "@mui/icons-material/Edit";
import { IconButton, List, ListItemText } from "@mui/material";
import Divider from "@mui/material/Divider";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemButton from "@mui/material/ListItemButton";
import ListItem from "@mui/material/ListItem";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Badge, { BadgeProps } from "@mui/material/Badge";
import { useNavigate, NavigateFunction } from "react-router-dom";
import MailIcon from "@mui/icons-material/Mail";
import { styled } from "@mui/material/styles";
import __ from "lodash";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
// internally crafted imports of ressources
import Context from "../../Store/ContextApi";
import { IAuthState } from "../../Interface/GlobalState";
import useNotification from "../../hooks/useNotifications";
import { CssTextField } from "../../MuiStyles/TextFieldStyle";
import { ISidechat, IseenMessage } from "../../Interface/Chat";

const SideChat: React.FC<ISidechat> = ({ Friends, Chat }) => {
  const ContextData = React.useContext(Context);

  const AuthInfo = useRecoilValue<Partial<IAuthState>>(ContextData.GetAuthInfo);

  const [search, setSearch] = React.useState<string>("");

  const { GetNotifications } = useNotification();
  const dataNoti = GetNotifications();

  const [selected, setselected] = React.useState<{ indexLink: number }>({
    indexLink: 0,
  });

  const navigate: NavigateFunction = useNavigate();

  const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
    "& .MuiBadge-badge": {
      right: -3,
      top: 13,
      border: `2px solid ${theme.palette.background.paper}`,
      padding: "0 4px",
    },
  }));

  const isSeenMessages = useMutation({
    mutationFn: async (newData: IseenMessage) => {
      try {
        const seenMessages = await axios.patch(
          "http://localhost:4000/home/chat/isSeen",
          newData
        );

        return seenMessages.data;
      } catch (error) {
        throw new Error(`${error}`);
      }
    },
  });

  const handleChangeEvent = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target as typeof event.target & {
      value: { value: string };
    };
    setSearch(target.value);
  };

  const debounceResult = React.useMemo(() => {
    return __.debounce(handleChangeEvent, 1000);
  }, [search]);

  return (
    <>
      <Box
        sx={{
          height: "100%",
          maxWidth: "100%",
          border: `1px solid ${grey[300]}`,
          borderTop: "none",
        }}
      >
        <Box
          sx={{
            position: "relative",
            top: 0,
            left: "0",
            width: "inherit",
            height: "11vh",
          }}
        >
          <Box
            py={1}
            pl={1}
            sx={{
              width: "98%",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              flexWrap: "wrap",
            }}
          >
            <Box>
              <IconButton aria-label="cart">
                <StyledBadge
                  badgeContent={
                    dataNoti?.Notifications?.filter(
                      (val) => val.NotiReference === "messaged"
                    )?.length
                  }
                  color="primary"
                >
                  <MailIcon />
                </StyledBadge>
              </IconButton>
            </Box>
            <Box>
              <Typography fontWeight="bold" fontSize="1.5em">
                chats
              </Typography>
            </Box>
            <Box>
              <IconButton>
                <EditIcon sx={{ color: "green" }} />
              </IconButton>
            </Box>
          </Box>
        </Box>
        <Divider />
        <Box
          sx={{
            position: "relative",
            top: 0,
            left: "0",
            width: "inherit",
            height: "10vh",
          }}
        >
          <Box pt="12px" pl={1} sx={{ width: "94%" }}>
            <CssTextField
              variant="outlined"
              size="small"
              fullWidth
              placeholder="search..."
              onChange={debounceResult}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </Box>
        <Divider />
        <Box
          sx={{
            position: "relative",
            width: "inherit",
            height: "calc(100vh - 31.7vh)",
            overflowY: "auto",
            boxSizing: "border-box",
          }}
        >
          <Box sx={{ maxHeight: "inherit" }}>
            <List
              sx={{
                overflowY: "auto",
                maxHeight: "inherit",
              }}
            >
              {Friends.filter((friend) =>
                search.toLowerCase() === ""
                  ? friend
                  : friend.User.Firstname.toLowerCase().includes(search)
              ).map((val, ind) => {
                const {
                  User: { _id, Image, Firstname, Lastname },
                } = val;
                const sel = selected.indexLink;

                return (
                  <ListItem
                    button
                    key={ind}
                    disableRipple
                    divider
                    sx={{ bgcolor: sel === ind ? grey[200] : null }}
                    onClick={() => {
                      setselected({ indexLink: ind });
                      navigate(`${val.User._id}`);
                    }}
                    disablePadding
                  >
                    <ListItemButton disableRipple>
                      <ListItemAvatar>
                        <Badge
                          badgeContent={
                            Chat.map((text) => text.Sender).includes(`${_id}`)
                              ? Chat.filter((text) =>
                                  text.Sender.toLowerCase().includes(`${_id}`)
                                ).length
                              : null
                          }
                          color="primary"
                          anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "right",
                          }}
                        >
                          <Avatar alt="image" src={Image}>
                            {Firstname.toLowerCase().charAt(0)}
                            {Lastname.toLowerCase().charAt(0)}
                          </Avatar>
                        </Badge>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography
                            component="div"
                            display="flex"
                            justifyContent="space-between"
                          >
                            <span>{`${Firstname} ${Lastname}`}</span>
                            <span
                              style={{
                                color: "green",
                                fontStyle: "italic",
                                fontSize: "0.8em",
                              }}
                            >
                              online
                            </span>
                          </Typography>
                        }
                        secondary={
                          <Typography>
                            {Chat.map((value) => value.Sender).includes(
                              `${_id}`
                            )
                              ? Chat[
                                  __.findLastIndex(Chat, {
                                    Sender: `${_id}`,
                                  })
                                ].Message
                              : '"No message"'}
                          </Typography>
                        }
                      />
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default SideChat;
