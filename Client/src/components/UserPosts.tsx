// internal imports of ressources
import * as React from 'react';
// external import of ressources
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import grey from '@mui/material/colors/grey';
import Button from '@mui/material/Button';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import {
  useQuery,
  UseQueryResult,
  useMutation,
  useQueryClient,
  QueryClient,
} from '@tanstack/react-query';
import axios from 'axios';
import __ from 'lodash';
import { useRecoilValue } from 'recoil';
import { produce, original } from 'immer';
// external imports of ressources
import Context from '../Store/ContextApi';
import { IAuthState } from '../Interface/GlobalState';
import {
  IPost,
  ILike,
  postData,
  IAction,
  IRetweetData,
  IRetweet,
  IPostAction,
} from '../Interface/Posts';
import UserShortComments from './Home/UserShortComments';
import Retweet from './Home/Retweet';
import PostActions from './Home/PostActions';

const UserPosts: React.FC = () => {
  const ContextData = React.useContext(Context);

  const AuthInfo = useRecoilValue<Partial<IAuthState>>(
    ContextData?.GetAuthInfo
  );
  // it allows to have access to actual date from dayjs
  dayjs.extend(relativeTime);

  const queryClient: QueryClient = useQueryClient();

  const [actionData, setActionData] = React.useState<IAction>({} as IAction);
  const [openPopper, setOpenPopper] = React.useState(false);

  const [retweetData, setRetweetData] = React.useState<IRetweetData>(
    {} as IRetweetData
  );

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const [anchorElPopper, setAnchorElPopper] =
    React.useState<HTMLButtonElement | null>(null);
  // listener to close post menu
  const handleClose = () => {
    setAnchorEl(null);
  };

  const RetweetProps: IRetweet = {
    openPopper,
    anchorElPopper,
    Data: retweetData,
  };

  const PostAction: IPostAction = {
    open,
    anchorEl,
    setAnchorEl,
    handleClose,
    Data: actionData,
  };

  const { data }: UseQueryResult<IPost, Error> = useQuery<IPost, Error>({
    queryKey: ['UserPosts'],
    queryFn: async () => {
      // declare the url
      const Url: string = `http://localhost:4000/home/profile/user/posts/${AuthInfo.Payload?._id}`;
      const res = await axios.get<IPost>(Url);
      return res.data;
    },
    retryDelay: 1000, // retry after a delay of 1000 ms if query errored out
  });

  const LikesMutation = useMutation({
    mutationFn: async (Like) => {
      try {
        const res = await axios.post(
          'http://localhost:4000/home/posts/likes',
          Like
        );

        return res.data;
      } catch (error) {
        throw new Error(`${error}`);
      }
    },
    onMutate: async (newLike: ILike) => {
      // cancel any outgoing query, so that they don't overwrite our optimistic update
      queryClient.cancelQueries({ queryKey: ['UserPosts'] });

      // snapshot the previous value
      const previousPosts = queryClient.getQueryData(['UserPosts']);
      // making use of Immer to update data only by a specified reference
      const updateLikes = produce(previousPosts, (draftData: IPost) => {
        draftData.doc.map((post) => {
          // for searching in large data set
          const originalData: postData | undefined = original(post);

          if (originalData?.PostId.includes(newLike.PostId)) {
            const isLike: boolean = post.Likes.map((like) => like._id).includes(
              `${AuthInfo.Payload?._id}`
            );

            const userIndex: number = __.findIndex(originalData?.Likes, (o) => {
              return o.User._id === `${AuthInfo.Payload?._id}`;
            });

            if (isLike) {
              // check whether the user already like the post, just to unlike
              /* eslint no-param-reassign: "error" */
              post.Likes[userIndex] = post.Likes[post.Likes.length - 1];
              post.Likes.pop(); // very much faster than splice
            }

            if (__.isNil(isLike) && userIndex === -1) {
              // if user nerver likes, make sure a new like added in the list of the post likes
              post.Likes.push({
                _id: newLike._id,
                Identifier: newLike.Identifier,
                PostId: newLike.PostId,
                User: {
                  _id: `${AuthInfo.Payload?._id}`,
                  Firstname: `${AuthInfo.Payload?.Firstname}`,
                  Lastname: `${AuthInfo.Payload?.Lastname}`,
                },
              });
            }
          }
        });
      });

      // optimistically update the query
      queryClient.setQueryData(['UserPosts'], updateLikes);

      return { previousPosts };
    },
    // If the mutation fails,
    // use the context returned from onMutate to roll back
    onError: (err, newTodo, context) => {
      queryClient.setQueryData(['UserPosts'], context?.previousPosts);
    },
    // invalidate the query after either success or fail
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['UserPosts'] });
    },
  });

  return (
    <>
      {data?.doc.map((val) => {
        // get the date and time from the moment the user drop the post
        const date = dayjs(`${val.createdAt}`).fromNow();
        return (
          <Box key={val.PostId} py={2}>
            <Retweet {...RetweetProps} />
            <Card sx={{ maxWidth: 500 }}>
              <PostActions {...PostAction} />
              <CardHeader
                avatar={
                  <Avatar
                    sx={{ bgcolor: red[500] }}
                    aria-label="recipe"
                    src={`${val.User.Image}`}
                  />
                }
                action={
                  <IconButton
                    aria-label="settings"
                    onClick={(event: React.MouseEvent<HTMLElement>) => {
                      setAnchorEl(event.currentTarget);
                      setActionData({
                        _id: `${val._id}`,
                        UserPostId: val.User._id,
                        PostId: val.PostId,
                        Title: `${val.Title}`,
                        Image: `${val.Image}`,
                      });
                    }}
                  >
                    <MoreVertIcon />
                  </IconButton>
                }
                title={
                  <span>{`${val.User.Firstname} ${val.User.Lastname}`}</span>
                }
                subheader={date}
              />
              {__.isBoolean(val.Retweeted) &&
              __.isEqual(val.Retweeted, true) ? (
                <CardMedia sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Card
                    sx={{
                      width: {
                        xs: '94%',
                        sm: '94%',
                        md: `max(${470},${300})`,
                        lg: `max(${470},${300})`,
                      },
                      boxShadow: 0,
                      border: `1px solid ${grey[100]}`,
                      boxSizing: 'border-box',
                    }}
                  >
                    <CardHeader
                      avatar={
                        <Avatar
                          sx={{ bgcolor: red[500] }}
                          aria-label="recipe"
                          src={`${val.RetweetedPost?.User.Image}`}
                        />
                      }
                      title={
                        <span>
                          {`${val.RetweetedPost?.User.Firstname} ${val.RetweetedPost?.User.Lastname}`}
                        </span>
                      }
                      subheader={dayjs(
                        `${val.RetweetedPost?.createdAt}`
                      ).fromNow()}
                    />
                    <CardMedia
                      component="img"
                      height="200"
                      sx={{ objectFit: 'cover' }}
                      image={val.RetweetedPost?.Image}
                      alt="Paella dish"
                    />
                    <CardContent>
                      <Typography variant="body2" color="text.secondary">
                        {val.RetweetedPost?.Title}
                      </Typography>
                    </CardContent>
                    <CardActions sx={{ display: 'flex', bgcolor: grey[200] }}>
                      <Box sx={{ alignSelf: 'flex-end' }}>
                        <Button variant="contained">follow</Button>
                      </Box>
                    </CardActions>
                  </Card>
                </CardMedia>
              ) : __.isEmpty(val.Image) && __.isEqual(val.Retweeted, false) ? (
                /* eslint react/jsx-indent: ["off"]  */
                <CardMedia
                  component="img"
                  height="0"
                  sx={{ bgcolor: 'red' }}
                  image={val.Image}
                  alt="Paella dish"
                />
              ) : (
                <CardMedia
                  component="img"
                  height="350"
                  sx={{ objectFit: 'cover' }}
                  image={val.Image}
                  alt="Paella dish"
                />
              )}
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  {val.Title}
                </Typography>
                <Box sx={{ pr: 46, pt: 1 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'row',
                      gap: 1,
                      width: 230,
                    }}
                  >
                    <Avatar
                      alt={AuthInfo.Payload?.Image}
                      src={AuthInfo.Payload?.Image}
                    />
                    <UserShortComments
                      PostInfo={{
                        PostId: val.PostId,
                        Identifier: `${AuthInfo.Payload?._id}`,
                        User: `${AuthInfo.Payload?._id}`,
                        Post: `${val._id}`,
                        Title: `${val.Title}`,
                        ReceiverId: `${val.MakerId}`,
                      }}
                    />
                  </Box>
                </Box>
              </CardContent>
              <CardActions>
                <Box
                  sx={{
                    width: 480,
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    '& > .box': {
                      display: 'flex',
                      flexDirection: 'row',
                    },
                  }}
                >
                  <Box className="box">
                    <IconButton
                      onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                        event.preventDefault();
                        LikesMutation.mutate({
                          _id: `${AuthInfo.Payload?._id}`,
                          PostId: val.PostId,
                          Identifier: `${AuthInfo.Payload?._id}`,
                          Preference: 'likes',
                          User: `${AuthInfo.Payload?._id}`,
                          Post: val._id,
                        });
                      }}
                    >
                      <ThumbUpOutlinedIcon
                        sx={{
                          color: val.Likes?.map((Like) =>
                            Like.User._id.includes(`${AuthInfo.Payload?._id}`)
                              ? 'blue'
                              : null
                          ),
                        }}
                      />
                    </IconButton>
                    <Typography
                      sx={{
                        pt: 1,
                        color: val.Likes?.map((Like) =>
                          Like.User._id.includes(`${AuthInfo.Payload?._id}`)
                            ? 'blue'
                            : null
                        ),
                      }}
                    >
                      <span>{val.Likes?.length}</span>
                    </Typography>
                  </Box>
                  <Box className="box">
                    <IconButton>
                      <ChatOutlinedIcon />
                    </IconButton>
                    <Typography sx={{ pt: 1 }}>
                      <span>{val.Comments?.length}</span>
                    </Typography>
                  </Box>
                  <Box className="box">
                    <IconButton
                      onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                        setAnchorElPopper(event.currentTarget);
                        setOpenPopper((prev) => !prev);
                        setRetweetData({
                          _id: `${val._id}`,
                          PostId: val.PostId,
                          UserRetweetId: `${AuthInfo.Payload?._id}`,
                          TweetOwnerId: val.User._id,
                          UserId: `${AuthInfo.Payload?._id}`,
                          MakerId: `${AuthInfo.Payload?._id}`,
                          Title: `${val.Title}`,
                        });
                      }}
                    >
                      <RotateLeftIcon />
                    </IconButton>
                    <Typography sx={{ pt: 1 }}>
                      {val.Retweets.length}
                    </Typography>
                  </Box>
                </Box>
              </CardActions>
            </Card>
          </Box>
        );
      })}
    </>
  );
};

export default UserPosts;
