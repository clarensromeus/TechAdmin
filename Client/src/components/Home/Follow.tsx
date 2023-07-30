import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import SearchIcon from "@mui/icons-material/Search";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemButton from "@mui/material/ListItemButton";
import grey from "@mui/material/colors/grey";
import {
  useQuery,
  UseQueryResult,
  useMutation,
  UseMutationResult,
  QueryClient,
  useQueryClient,
} from "@tanstack/react-query";
import { FadeLoader } from "react-spinners";
import axios from "axios";
import { nanoid } from "nanoid";
import { useRecoilValue } from "recoil";
// internal crafted imports of ressources
import { CssTextField } from "../../MuiStyles/TextFieldStyle";
import { IFriend } from "../../Interface/Posts";
import Context from "../../Store/ContextApi";
import { IAuthState } from "../../Interface/GlobalState";
import { Iunfollow, IunfollowResponse } from "../../Interface/student";
import useNotification from "../../hooks/useNotifications";

interface User {
  _id: string;
  Firstname: string;
}

interface IstudentData<T> {
  doc: {
    _id: T;
    Firstname: T;
    Lastname: T;
    Email: T;
    Image: T;
    NoteLevel: T;
    Friends: {
      User: User;
    }[];
  }[];
}

interface IDrawer {
  DialogOpen: boolean;
  CloseDialog: () => void;
}

const Follow: React.FC<IDrawer> = ({ DialogOpen, CloseDialog }) => {
  const ContextData = React.useContext(Context);

  const [selected, setselected] = React.useState<{ indexLink: number }>({
    indexLink: 0,
  });

  const AuthInfo = useRecoilValue<Partial<IAuthState>>(ContextData.GetAuthInfo);
  const queryClient: QueryClient = useQueryClient();
  const { CreateNotifications } = useNotification();

  const Mutation: UseMutationResult<IFriend, Error, IFriend> = useMutation<
    IFriend,
    Error,
    IFriend
  >({
    mutationFn: async (Friends: IFriend) => {
      try {
        const res = await axios.post(
          "http://localhost:4000/home/students/friends",
          Friends
        );

        return res.data;
      } catch (error) {
        throw new Error(`${error}`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["StudentsSuggestion"],
      });
    },
  });

  const UnfollowMutation: UseMutationResult<
    IunfollowResponse,
    Error,
    Iunfollow
  > = useMutation<IunfollowResponse, Error, Iunfollow>({
    mutationFn: async (deleteData: Iunfollow) => {
      try {
        const res = await axios.delete(
          `http://localhost:4000/home/friend/unfollow/${deleteData._id}/${deleteData.User}`
        );

        return res.data;
      } catch (error) {
        throw new Error(`${error}`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["StudentsSuggestion"],
      });
    },
  });

  const {
    data,
    isLoading,
  }: UseQueryResult<IstudentData<string>, Error> = useQuery<
    IstudentData<string>,
    Error
  >({
    queryKey: ["StudentsSuggestion"],
    queryFn: async () => {
      // declare the url
      const Url: string = "http://localhost:4000/home/students/suggestion";
      const response = await axios.get<IstudentData<string>>(Url);
      return response.data;
    },
    retry: 2, // retry twice if query errored out
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["StudentsSugestion"],
      });
    },
  });

  return (
    <>
      <Box>
        <Dialog
          open={DialogOpen}
          onClose={CloseDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <form>
            <DialogTitle
              sx={{
                display: "flex",
                flexDirection: "column",
                fontSize: "1.5em",
                color: "text.secondary",
              }}
            >
              <Box>
                <IconButton onClick={CloseDialog}>
                  <ArrowForwardIcon sx={{ color: "black" }} />
                </IconButton>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <CssTextField
                  variant="outlined"
                  size="small"
                  fullWidth
                  placeholder="search friends..."
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
            </DialogTitle>
            <DialogContent
              sx={{
                width: 600,
                height: 400,
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "flex-start",
              }}
            >
              {isLoading ? (
                <Box pt={13} pl={40}>
                  <FadeLoader
                    color="hsla(0, 0%, 80%)"
                    loading={isLoading}
                    aria-label="Loading Spinner"
                  />
                </Box>
              ) : (
                <List sx={{ width: 550 }}>
                  {data?.doc.map((val, ind) => {
                    const { _id, Firstname, Lastname, Email, Image } = val;
                    const sel = selected.indexLink;
                    const isFollowed: boolean = val.Friends.map(
                      (friend) => friend.User._id
                    ).includes(`${AuthInfo.Payload?._id}`);
                    return (
                      <ListItem
                        button
                        key={_id}
                        disableRipple
                        divider
                        sx={{ bgcolor: sel === ind ? grey[200] : null }}
                        onClick={(e) => {
                          setselected({ indexLink: ind });
                          e.preventDefault;
                        }}
                        disablePadding
                      >
                        <ListItemButton disableRipple>
                          <ListItemAvatar>
                            <Avatar alt="image" src={Image}>
                              {`${Firstname.toUpperCase().charAt(
                                0
                              )}${Lastname.toUpperCase().charAt(0)}`}
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  boxSizing: "border-box",
                                }}
                              >
                                <Typography
                                  sx={{ pt: 1 }}
                                  component="div"
                                  display="flex"
                                  justifyContent="space-between"
                                >
                                  <span>{`${Firstname} ${Lastname}`}</span>
                                </Typography>
                                <Button
                                  variant={
                                    isFollowed ? "outlined" : "contained"
                                  }
                                  onClick={async () => {
                                    try {
                                      isFollowed
                                        ? await UnfollowMutation.mutate({
                                            _id: val._id,
                                            User: `${AuthInfo.Payload?._id}`,
                                          })
                                        : Mutation.mutate({
                                            status: "student",
                                            FriendId: `${nanoid()}`,
                                            Identifier: val._id,
                                            User: `${AuthInfo.Payload?._id}`,
                                          });

                                      await CreateNotifications({
                                        ReceiverId: val._id,
                                        NotiId: `${nanoid()}`,
                                        NotiReference: isFollowed
                                          ? "unfollow"
                                          : "follow",
                                        Sender: `${AuthInfo.Payload?._id}`,
                                        AlertText: isFollowed
                                          ? "unfollow"
                                          : "follow",
                                        SendingStatus: false,
                                        User: `${AuthInfo.Payload?._id}`,
                                      });
                                    } catch (error) {
                                      throw new Error(`${error}`);
                                    }
                                  }}
                                >
                                  {isFollowed ? "unfollow" : "follow"}
                                </Button>
                              </Box>
                            }
                            secondary={Email}
                          />
                        </ListItemButton>
                      </ListItem>
                    );
                  })}
                </List>
              )}
            </DialogContent>
          </form>
        </Dialog>
      </Box>
    </>
  );
};

export default Follow;
