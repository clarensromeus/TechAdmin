import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import SendIcon from "@mui/icons-material/Send";
import { blueGrey, orange, grey } from "@mui/material/colors";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Avatar from "@mui/material/Avatar";
import InputAdornment from "@mui/material/InputAdornment";
import ImageIcon from "@mui/icons-material/Image";
import { useRecoilValue } from "recoil";
import axios from "axios";
import { nanoid } from "nanoid";
import __ from "lodash";
import {
  useMutation,
  useQueryClient,
  QueryClient,
} from "@tanstack/react-query";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {
  useOutletContext,
  useParams,
  useNavigate,
  NavigateFunction,
} from "react-router-dom";
import { produce } from "immer";
// internal crafted imports of ressources
import { ChatTextField } from "../MuiStyles/TextFieldStyle";
import { IChat, IChatting, IFriends } from "../Interface/Chat";
import Context from "../Store/ContextApi";
import { IAuthState } from "../Interface/GlobalState";
import SearchingDrawer from "../components/Home/Follow";
import useNotification from "../hooks/useNotifications";
import SendImageFrame from "../components/Home/SendImageFrame";
import { ISendImageFrameProps } from "../Interface/Chat";
import useWindowSize from "../hooks/useWindowSize";
import { IWindow } from "../Interface/student";
import UploadFile from "../components/Home/UploadFile";

interface IDrawer {
  DialogOpen: boolean;
  CloseDialog: () => void;
}

type ScrollBehavior = "auto" | "smooth";

const ChatSpace: React.FC = () => {
  // it allows to have access to actual date from dayjs
  dayjs.extend(relativeTime);
  const ScrollToTheBottom = React.useRef<HTMLDivElement | null>(null);

  const { CreateNotifications } = useNotification();

  const { GuessData, ClientData } = useOutletContext<IChatting>();

  const ContextData = React.useContext(Context);
  const { width }: IWindow = useWindowSize();
  // state to open and close the dialog
  const [OpenDialog, setOpenDialog] = React.useState<boolean>(false);
  const [text, setText] = React.useState<string>("");
  const [file, setFile] = React.useState<any>();
  const [state, setState] = React.useState<string>("none");
  const [showPicker, setShowPicker] = React.useState<boolean>(false);

  const AuthInfo = useRecoilValue<Partial<IAuthState>>(ContextData.GetAuthInfo);
  const { id }: { id?: string } = useParams<{ id: string }>();

  const navigate: NavigateFunction = useNavigate();

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleChangeText = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target as typeof event.target & {
      value: { value: string };
    };
    setText(target.value);
  };
  const { PreviewImage, imageState, imageType } = UploadFile({
    file,
  });

  const onEmojiClick = (emojiData: EmojiClickData, event: MouseEvent) => {
    setText((prevInput) => prevInput + emojiData.emoji);
    setShowPicker(false);
  };

  const changeFileHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // move forward to next step if file exists
    if (e.target.files) {
      const getFile = e.target.files[0];
      setFile(getFile);
      if (imageState === 2) {
        setState("flex");
      }
    }
  };

  const DrawerState: IDrawer = {
    DialogOpen: OpenDialog,
    CloseDialog: handleCloseDialog,
  };

  const queryClient: QueryClient = useQueryClient();

  const stateFrame: ISendImageFrameProps = {
    state,
    setState,
    PreviewImage,
    imageType,
    file,
    _id: `${id}`,
    Sender: `${AuthInfo.Payload?._id}`,
  };

  const Mutation = useMutation({
    mutationFn: async (Friends) => {
      try {
        const ChatResponse = await axios.post(
          "http://localhost:4000/home/Chat/messages",
          Friends
        );

        return ChatResponse.data;
      } catch (error) {
        throw new Error(`${error}`);
      }
    },
    onMutate: async (newChat: IChat<string>) => {
      // cancel any outgoing query so that they don't overwrite
      // the optimistic update
      queryClient.cancelQueries(["ChatFriends"]);

      // take a snapshot of the  previous query
      const PreviousData = queryClient.getQueryData<IFriends>(["ChatFriends"]);

      const updateChats: IFriends | undefined = produce(
        PreviousData,
        (draftData: IFriends) => {
          draftData.doc.Friends.map((friend) => {
            // optimistically push the chat to the specific user channel
            if (friend.User._id.includes(`${id}`)) {
              friend.User.Chat.push({
                Identifier: newChat.Identifier,
                Sender: newChat.Sender,
                Message: newChat.Message,
                createdAt: `${new Date()}`,
                User: {
                  Image: `${AuthInfo.Payload?.Image}`,
                },
              });
            }
          });
        }
      );

      // optimistically update the query
      queryClient.setQueryData(["ChatFriends"], updateChats);

      return { PreviousData };
    },
    onError: (err, variables, context) => {
      // in case the query fail
      // roll back to the previous to avoid unexpected result
      queryClient.setQueryData(["ChatFriends"], context?.PreviousData);
    },
    onSettled: () => {
      // refetch and invalidate the query
      queryClient.invalidateQueries({
        queryKey: ["ChatFriends"],
      });
    },
  });

  // filter the active user chat with the guest user id
  const FilterReceivedMessage = __.reject(ClientData, (val) => {
    return val.Sender !== `${id}`;
  });

  const FilterSentMessage = __.reject(GuessData, (val) => {
    return val.User._id !== `${id}`;
  });

  // combine the active and the guest user messages together
  // and filter them in ascending order
  const ChatBox = FilterSentMessage[0].User.Chat.concat(
    FilterReceivedMessage
  ).sort(
    (a, b) => new Date(a.createdAt).valueOf() - new Date(b.createdAt).valueOf()
  );

  const ScrollFunc = React.useCallback(
    (behavior: ScrollBehavior | undefined) => {
      ScrollToTheBottom.current?.scrollIntoView({
        behavior,
        block: "start",
        inline: "nearest",
      });
    },
    [id]
  );

  React.useEffect(() => {
    // scroll to the bottom of the list of messages
    ScrollFunc("smooth");
  }, [id, ChatBox.length]);

  return (
    <>
      <SearchingDrawer {...DrawerState} />
      <SendImageFrame {...stateFrame} />
      <Box sx={{ width: "100%", height: "100%" }}>
        <Box
          sx={{
            width: "inherit",
            height: "60px",
            bgcolor: "transparent",
            position: "fixed",
            display: "flex",
            backdropFilter: "blur(7px)",
            alignItems: "center",
            borderBottom: `1px solid ${grey[300]}`,
            zIndex: 4,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              width: "100%",
            }}
          >
            <IconButton onClick={() => navigate("..")}>
              <ArrowForwardIcon />
            </IconButton>
            <Box sx={{ display: "flex", pr: 2 }}>
              <Typography sx={{ pt: 1, pr: 1 }}>
                {FilterSentMessage[0].User.Firstname}{" "}
                {FilterSentMessage[0].User.Lastname}
              </Typography>
              <Avatar src={FilterSentMessage[0].User.Image} />
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            width: "inherit",
            height: "calc(100vh - 21.5vh)",
            overflowY: "auto",
          }}
        >
          <Box sx={{ maxHeight: 400, px: 2, pt: 10 }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                width: "inherit",
                gap: 1,
                textAlign: "center",
              }}
            >
              {ChatBox?.map((value, index) => {
                // display date when any message is sent
                const date = dayjs(`${value?.createdAt}`).fromNow();
                const isGuest: boolean =
                  value.Identifier === AuthInfo.Payload?._id;
                return (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignSelf:
                        value?.Identifier === AuthInfo.Payload?._id
                          ? "end"
                          : "start",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        gap: 1,
                      }}
                    >
                      <Box sx={{ order: isGuest ? "2" : "1" }}>
                        <Avatar
                          alt="chatProfile"
                          src={value.User ? value.User.Image : ""}
                        />
                      </Box>
                      <Box
                        p={1}
                        sx={{
                          bgcolor:
                            value?.Identifier === AuthInfo.Payload?._id
                              ? blueGrey[200]
                              : orange[200],
                          borderRadius: 2,
                          order: isGuest ? "1" : "2",
                          AlignText: "center",
                        }}
                      >
                        {!__.isUndefined(value.Message) &&
                          __.gt(value?.Message.length, 1) &&
                          __.isUndefined(value.PicturedMessage) && (
                            <Typography variant="body1">
                              {value?.Message}
                            </Typography>
                          )}
                        {!__.isUndefined(value.PicturedMessage) &&
                          __.gt(value?.PicturedMessage?.length, 1) &&
                          __.isUndefined(value.Message) && (
                            <img
                              style={{ width: 200, height: 140 }}
                              alt={value.PicturedMessage}
                              src={value.PicturedMessage}
                            />
                          )}
                        {!__.isUndefined(value.PicturedMessage) &&
                          __.gt(__.size(value?.PicturedMessage), 1) &&
                          __.gt(__.size(value?.Message), 1) &&
                          !__.isUndefined(value?.Message) && (
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                              }}
                            >
                              <Box sx={{ width: 200, height: 140 }}>
                                <img
                                  style={{
                                    width: "inherit",
                                    height: "inherit",
                                  }}
                                  alt={value.PicturedMessage}
                                  src={value.PicturedMessage}
                                />
                              </Box>
                              <Box
                                p={1}
                                sx={{
                                  bgcolor: grey[200],
                                  alignText: "center",
                                  maxWidth: 185,
                                }}
                              >
                                <Typography>{value?.Message}</Typography>
                              </Box>
                            </Box>
                          )}
                      </Box>
                    </Box>
                    <Box
                      sx={{ alignSelf: isGuest ? "flex-start" : "flex-end" }}
                    >
                      <Typography
                        variant="body1"
                        color="text.secondary"
                        fontSize="0.7em"
                      >
                        {date}
                      </Typography>
                    </Box>
                  </Box>
                );
              })}
            </Box>
            <Box ref={ScrollToTheBottom} />
          </Box>
        </Box>
        <form
          onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            Mutation.mutate({
              Identifier: `${id}`,
              ChatId: `${nanoid()}`,
              Message: text,
              Sender: `${AuthInfo.Payload?._id}`,
              User: `${AuthInfo.Payload?._id}`,
            });
            CreateNotifications({
              ReceiverId: id,
              NotiId: `${nanoid()}`,
              Sender: `${AuthInfo.Payload?._id}`,
              SendingStatus: false,
              NotiReference: "messaged",
              AlertText: text,
              User: `${AuthInfo.Payload?._id}`,
            });

            setText("");
          }}
        >
          <Box
            sx={{
              width: "inherit",
              height: "70px",
              position: "relative",
              borderTop: `1px solid ${grey[300]}`,
            }}
          >
            <Box
              mx={width && width < 700 ? 1 : 2}
              my={2}
              sx={{
                border: "1px solid",
                borderColor: "divider",
                borderWidth: 0,
              }}
            >
              <ChatTextField
                variant="outlined"
                size="small"
                value={text}
                onChange={handleChangeText}
                fullWidth
                placeholder="write a text..."
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton type="submit">
                        <SendIcon sx={{ color: blueGrey[400] }} />
                      </IconButton>
                    </InputAdornment>
                  ),
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconButton
                        color="primary"
                        aria-label="upload picture"
                        component="label"
                      >
                        <input
                          hidden
                          accept="image/*"
                          type="file"
                          onChange={changeFileHandler}
                        />
                        <ImageIcon sx={{ color: blueGrey[400] }} />
                      </IconButton>
                      <IconButton
                        color="primary"
                        aria-label="emoji picker"
                        component="label"
                        onClick={() => setShowPicker((val) => !val)}
                      >
                        <EmojiEmotionsIcon sx={{ color: blueGrey[400] }} />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            <Box>
              <Box
                sx={{
                  position: "absolute",
                  top: "-554%",
                  left: width && width < 700 ? "2%" : "3%",
                }}
              >
                {showPicker && (
                  <EmojiPicker
                    height={380}
                    width={width && width < 700 ? 340 : 400}
                    autoFocusSearch={false}
                    onEmojiClick={onEmojiClick}
                  />
                )}
              </Box>
            </Box>
          </Box>
        </form>
      </Box>
    </>
  );
};

export default ChatSpace;
