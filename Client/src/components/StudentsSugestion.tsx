import * as React from 'react';
import { Box, Typography } from '@mui/material';
import {
  useQuery,
  UseQueryResult,
  UseMutationResult,
  useQueryClient,
  useMutation,
  QueryClient,
} from '@tanstack/react-query';
import Avatar from '@mui/material/Avatar';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import blueGrey from '@mui/material/colors/blueGrey';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import __ from 'lodash';
import InputAdornment from '@mui/material/InputAdornment';
import grey from '@mui/material/colors/grey';
import axios from 'axios';
import { nanoid } from 'nanoid';
import { useRecoilValue } from 'recoil';
// external crafted imports of ressources
import { CommentTextField } from '../MuiStyles/Auth';
import { IFriend } from '../Interface/Posts';
import { IAuthState } from '../Interface/GlobalState';
import Context from '../Store/ContextApi';
import useNotification from '../hooks/useNotifications';
import { Iunfollow, IunfollowResponse } from '../Interface/student';
import useWindowSize from '../hooks/useWindowSize';

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

const StudentsSugestion: React.FC = () => {
  const ContextData = React.useContext(Context);

  const [search, setSearch] = React.useState<string>('');

  const AuthInfo = useRecoilValue<Partial<IAuthState>>(ContextData.GetAuthInfo);

  const { CreateNotifications } = useNotification();
  const queryClient: QueryClient = useQueryClient();
  const { width }: { width?: number } = useWindowSize();

  const {
    data,
  }: UseQueryResult<IstudentData<string>, Error> = useQuery<
    IstudentData<string>,
    Error
  >({
    queryKey: ['StudentsSuggestion'],
    queryFn: async () => {
      // declare the url
      const Url: string = 'http://localhost:4000/home/students/suggestion';
      const response = await axios.get<IstudentData<string>>(Url);
      return response.data;
    },
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    retry: 2, // retry twice if query errored out
  });

  const Mutation: UseMutationResult<IFriend, Error, IFriend> = useMutation<
    IFriend,
    Error,
    IFriend
  >({
    mutationFn: async (Friends: IFriend) => {
      const res = await axios.post(
        'http://localhost:4000/home/students/friends',
        Friends
      );

      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['StudentsSuggestion'],
      });
    },
  });

  const UnfollowMutation: UseMutationResult<
    IunfollowResponse,
    Error,
    Iunfollow
  > = useMutation<IunfollowResponse, Error, Iunfollow>({
    mutationFn: async (deleteData: Iunfollow) => {
      const res = await axios.delete(
        `http://localhost:4000/home/friend/unfollow/${deleteData._id}/${deleteData.User}`
      );

      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['StudentsSuggestion'],
      });
    },
  });

  const handleChangeEvent = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target as typeof event.target & {
      value: { value: string };
    };
    setSearch(target.value);
  };

  // define the debounce
  const debounceResult = React.useMemo(() => {
    return __.debounce(handleChangeEvent, 1000);
  }, [search]);

  React.useEffect(() => {
    // cleanup debounce not to perform searching when search gets unmounted
    return () => {
      debounceResult.cancel();
    };
  });

  return (
    <div>
      <Box
        sx={{
          width: width && width < 900 ? '100%' : 'max(65%, 30%)',
        }}
      >
        <Box>
          <Typography
            textTransform="capitalize"
            fontSize="1.3em"
            fontWeight="bold"
          >
            Who to follow
          </Typography>
        </Box>
        <Box pt={1} />
        <Paper sx={{}}>
          <Box p={1} sx={{ width: 140 }}>
            <CommentTextField
              fullWidth
              size="small"
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
          <Box sx={{ maxHeight: 265, minHeight: 86 }}>
            <Box sx={{ maxHeight: 250, overflowY: 'hidden' }}>
              {data?.doc
                .filter((student) =>
                  search.toLowerCase() === ''
                    ? student
                    : student.Firstname.toLowerCase().includes(search)
                )
                .map((student) => {
                  const isFollowed: boolean = student.Friends.map(
                    (friend) => friend.User._id
                  ).includes(`${AuthInfo.Payload?._id}`);
                  return (
                    <Box
                      key={student._id}
                      sx={{
                        p: 2,
                        width: 'inherit',
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        bgcolor: (theme) => theme.palette.background.default,
                      }}
                    >
                      <Box sx={{ display: 'flex' }}>
                        <Avatar alt="Photo" src={student.Image}>
                          <PersonIcon sx={{ color: blueGrey[200] }} />
                        </Avatar>
                        <Box sx={{ pl: 2 }}>
                          <Typography
                            fontWeight="bold"
                            fontFamily="Roboto, sans serif"
                          >
                            {`${student.Firstname.toUpperCase().charAt(
                              0
                            )}.${student.Lastname.toLowerCase()}`}
                          </Typography>
                          <Typography>student</Typography>
                        </Box>
                      </Box>
                      <Box>
                        <Button
                          color="success"
                          sx={{
                            bgcolor: isFollowed ? grey[100] : null,
                          }}
                          variant={isFollowed ? 'text' : 'outlined'}
                          onClick={async () => {
                            try {
                              isFollowed
                                ? await UnfollowMutation.mutate({
                                    _id: student._id,
                                    User: `${AuthInfo.Payload?._id}`,
                                  })
                                : await Mutation.mutate({
                                    status: 'student',
                                    FriendId: `${nanoid()}`,
                                    Identifier: student._id,
                                    User: `${AuthInfo.Payload?._id}`,
                                  });

                              await CreateNotifications({
                                ReceiverId: student._id,
                                NotiId: `${nanoid()}`,
                                NotiReference: isFollowed
                                  ? 'unfollow'
                                  : 'follow',
                                Sender: `${AuthInfo.Payload?._id}`,
                                AlertText: isFollowed ? 'unfollow' : 'follow',
                                SendingStatus: false,
                                User: `${AuthInfo.Payload?._id}`,
                              });
                            } catch (error) {
                              throw new Error(`${error}`);
                            }
                          }}
                        >
                          {isFollowed ? 'unfollow' : 'follow'}
                        </Button>
                      </Box>
                    </Box>
                  );
                })}
            </Box>
          </Box>
        </Paper>
        <Box pt={{ xs: 7, sm: 3, md: 1, lg: 1 }} />
      </Box>
    </div>
  );
};

export default StudentsSugestion;
