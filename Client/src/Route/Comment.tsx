import * as React from "react";
import { Box, IconButton, Typography, Avatar } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import grey from "@mui/material/colors/grey";
import SendIcon from "@mui/icons-material/Send";
import {
  useMutation,
  useQueryClient,
  UseQueryResult,
  useQuery,
  QueryClient,
} from "@tanstack/react-query";
import { useNavigate, NavigateFunction, useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import axios from "axios";
import { nanoid } from "nanoid";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { produce } from "immer";
// externally crafted imports of ressources
import { CssTextField } from "../MuiStyles/Auth";
import { IComment, IGetComment } from "../Interface/Posts";
import StyledBadge from "../MuiStyles/StyledBadge";
import useNotification from "../hooks/useNotifications";
import Context from "../Store/ContextApi";
import { IAuthState } from "../Interface/GlobalState";

type ScrollBehavior = "auto" | "smooth";

const Comment: React.FC = () => {
  const ContextData = React.useContext(Context);
  const ScrollToTheBottom = React.useRef<HTMLDivElement | null>(null);

  const [text, setText] = React.useState<string>();
  const AuthInfo = useRecoilValue<Partial<IAuthState>>(ContextData.GetAuthInfo);

  const handleChangeText = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target as typeof event.target & {
      value: { value: string };
    };
    setText(target.value);
  };

  // it allows to have access to actual date from dayjs
  dayjs.extend(relativeTime);

  const navigate: NavigateFunction = useNavigate();
  const { id }: { id?: string } = useParams<{ id?: string }>();

  const { CreateNotifications } = useNotification();

  const queryClient: QueryClient = useQueryClient();

  const { data }: UseQueryResult<IGetComment, Error> = useQuery<
    IGetComment,
    Error
  >({
    queryKey: ["Comments", id],
    queryFn: async ({ queryKey }) => {
      const CommentResponse = await axios.get(
        `http://localhost:4000/home/Post/comments/${queryKey[1]}`
      );
      return CommentResponse.data;
    },
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchOnMount: true,
  });

  const CommentsMutation = useMutation({
    mutationFn: async (Comments) => {
      const res = await axios.post(
        "http://localhost:4000/home/posts/comments",
        Comments
      );

      return res.data;
    },
    onMutate: async (newComment: IComment) => {
      // cancel any outgoing query, so that they don't overwrite our optimistic update
      queryClient.cancelQueries({ queryKey: ["Comments", id] });

      // snapshot the previous value
      const previousPosts = queryClient.getQueryData(["Comments", id]);

      const updateComments = produce(
        previousPosts,
        (draftData: IGetComment) => {
          draftData.doc.Comments.push({
            createdAt: `${new Date()}`,
            PostId: newComment.PostId,
            Identifier: newComment.Identifier,
            Body: `${newComment.Body}`,
            User: {
              _id: `${AuthInfo.Payload?._id}`,
              Firstname: `${AuthInfo.Payload?.Firstname}`,
              Lastname: `${AuthInfo.Payload?.Lastname}`,
              Image: `${AuthInfo.Payload?.Image}`,
            },
          });
        }
      );

      // optimistically update the query
      queryClient.setQueryData(["Comments", id], updateComments);

      return { previousPosts };
    },
    // If the mutation fails,
    // use the context returned from onMutate to roll back
    onError: (err, newTodo, context) => {
      queryClient.setQueryData(["Comments", id], context?.previousPosts);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["Comments", id] });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Posts"] });
    },
  });

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
    // scroll to the bottom of the list of comments
    ScrollFunc("smooth");
  }, [id, data?.doc.Comments.length]);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: (theme) => theme.zIndex.drawer + 1,
          position: "fixed",
          bgcolor: "rgb(0,0,0,0.8)",
          top: "0%",
          left: "0%",
          width: "100%",
          height: "100%",
        }}
      >
        <Box
          sx={{
            width: 640,
            height: { xs: "inherit", sm: "inherit", md: 600, lg: 600 },
            bgcolor: "#fafafa",
          }}
        >
          <Box
            sx={{
              gap: 2,
              position: "fixed",
              width: "inherit",
              height: 70,
              backdropFilter: "blur(5px)",
              zIndex: 4,
              borderBottom: `1px solid ${grey[200]}`,
            }}
          >
            <Box
              sx={{
                display: "flex",
                height: "inherit",
                alignItems: "center",
              }}
            >
              <IconButton onClick={() => navigate("..")}>
                <ArrowForwardIcon />
              </IconButton>
              <Box>
                <Typography fontWeight="bold" fontSize="1.4rem">
                  Comments
                </Typography>
              </Box>
              <Box pl="5px" pt="4px">
                <Typography
                  fontWeight="italic"
                  fontSize=".9rem"
                  sx={{ color: "green" }}
                >
                  {data?.doc.Comments.length}
                </Typography>
              </Box>
            </Box>
          </Box>
          <Box
            sx={{
              height: "calc(100% - 75px)",
              overflowY: "auto",
            }}
          >
            <Box mx={2} pt={10} sx={{ maxHeight: "inherit", m1: 1 }}>
              {data?.doc.Comments.map((value) => {
                const {
                  Body,
                  createdAt,
                  User: { Image },
                } = value;
                const date = dayjs(`${createdAt}`).fromNow();
                return (
                  <Box
                    sx={{
                      pl: 1,
                      display: "flex",
                      flexDirection: "row",
                      gap: 1,
                      borderBox: "box-sizing",
                    }}
                  >
                    <Box>
                      <Avatar alt="" src={Image}>
                        RC
                      </Avatar>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        maxWidth: 270,
                      }}
                    >
                      <Box
                        sx={{
                          bgcolor: grey[300],
                          borderRadius: 2,
                          AlignText: "center",
                        }}
                        p={1}
                      >
                        <Typography fontWeight="bold">{Body}</Typography>
                      </Box>
                      <Box sx={{ alignSelf: "flex-end" }}>
                        <Typography
                          variant="body1"
                          color="text.secondary"
                          fontSize="0.7em"
                        >
                          {date}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                );
              })}
            </Box>
            <Box
              component="div"
              ref={ScrollToTheBottom}
              sx={{ bgcolor: "red" }}
            />
          </Box>
          <form
            onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
              event.preventDefault();
              CommentsMutation.mutate({
                PostId: `${data?.doc.PostId}`,
                Identifier: `${AuthInfo.Payload?._id}`,
                Body: text,
                User: `${AuthInfo.Payload?._id}`,
                Post: `${data?.doc._id}`,
              });
              CreateNotifications({
                ReceiverId: `${data?.doc.User._id}`,
                NotiId: `${nanoid()}`,
                Sender: `${AuthInfo.Payload?._id}`,
                SendingStatus: false,
                NotiReference: "comments",
                AlertText: `${data?.doc.Title}`,
                User: `${AuthInfo.Payload?._id}`,
              });
              // reset textfield value
              setText("");
            }}
          >
            <Box
              sx={{
                height: "75px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                position: "relative",
                gap: 1,
                mx: 1,
                borderTop: `1px solid ${grey[200]}`,
              }}
            >
              <StyledBadge
                overlap="circular"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                variant="dot"
              >
                <Avatar
                  alt="profileImage"
                  src={AuthInfo.Payload?.Image}
                  sx={{ width: 48, height: 48 }}
                />
              </StyledBadge>

              <CssTextField
                variant="outlined"
                size="small"
                value={text}
                onChange={handleChangeText}
                fullWidth
                placeholder="drop a comment..."
              />
              <Box>
                <IconButton type="submit">
                  <SendIcon />
                </IconButton>
              </Box>
            </Box>
          </form>
        </Box>
      </Box>
    </>
  );
};

export default Comment;
