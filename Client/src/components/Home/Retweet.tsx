import * as React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Button, Divider, Fade, Paper } from '@mui/material';
import Popper, { PopperPlacementType } from '@mui/material/Popper';
import { nanoid } from 'nanoid';
import axios from 'axios';
import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query';
import { ClipLoader } from 'react-spinners';
// external imports of ressources
import { IRetweetData, IRetweet } from '../../Interface/Posts';
import { CssTextField } from '../../MuiStyles/Auth';
import usePost from '../../hooks/usePost';
import useNotification from '../../hooks/useNotifications';

interface IRetweetResponse {
  message: string;
  sucess: boolean;
}

const Retweet: React.FC<IRetweet> = ({
  openPopper,
  anchorElPopper,
  Data: { _id, PostId, UserRetweetId, TweetOwnerId, UserId, MakerId, Title },
}) => {
  const [text, setText] = React.useState<string>('');

  const handleChangeText = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target as typeof event.target & {
      value: { value: string };
    };
    setText(target.value);
  };

  // hook for post creation
  const { CreatePost } = usePost();
  // hook for notifications creation
  const { CreateNotifications } = useNotification();
  const queryClient = useQueryClient();

  const RetweetMutation: UseMutationResult<
    IRetweetResponse,
    Error,
    Omit<IRetweetData, 'UserId' | 'MakerId' | 'Title'>
  > = useMutation<
    IRetweetResponse,
    Error,
    Omit<IRetweetData, 'UserId' | 'MakerId' | 'Title'>
  >({
    mutationFn: async (
      RetweetData: Omit<IRetweetData, 'UserId' | 'MakerId' | 'Title'>
    ) => {
      const res = await axios.post(
        'http://localhost:4000/home/posts/retweet',
        RetweetData
      );

      return res.data;
    },
    onSuccess: () => {
      // invalidate and refetch the query for fresh data
      queryClient.invalidateQueries({
        queryKey: ['Posts'],
      });
    },
  });

  React.useEffect(() => {
    if (RetweetMutation.status === 'success') {
      // Notify the Retweeted post author
    }
  }, [RetweetMutation.status]);

  return (
    <>
      <Box sx={{ width: 300 }}>
        <Popper
          open={openPopper}
          anchorEl={anchorElPopper}
          placement="bottom-start"
          transition
        >
          {({ TransitionProps }) => (
            <Fade {...TransitionProps} timeout={350}>
              <Paper>
                <form
                  onSubmit={async (
                    event: React.SyntheticEvent<HTMLFormElement>
                  ) => {
                    try {
                      // prevent default action
                      event.preventDefault();
                      await RetweetMutation.mutate({
                        _id,
                        PostId,
                        UserRetweetId,
                        TweetOwnerId,
                      });

                      const formData = new FormData();

                      await formData.append('PostId', `${nanoid()}`);
                      await formData.append('Title', text);
                      await formData.append('User', `${UserId}`);
                      await formData.append('MakerId', `${MakerId}`);
                      await formData.append('Reweeted', `${true}`);
                      await formData.append('RetweetedPost', `${_id}`);

                      await CreatePost(formData);
                      await CreateNotifications({
                        ReceiverId: `${TweetOwnerId}`,
                        NotiId: `${nanoid()}`,
                        Sender: UserId,
                        SendingStatus: false,
                        NotiReference: 'Retweeted',
                        AlertText: Title,
                        User: UserId,
                      });
                    } catch (error) {
                      throw new Error(`${error}`);
                    }
                  }}
                >
                  <Box
                    p={1}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 1,
                      textAlign: 'center',
                    }}
                  >
                    <Typography textTransform="uppercase">
                      Just Retweet
                    </Typography>
                    <Divider />
                    <Box sx={{ width: 250 }}>
                      <CssTextField
                        placeholder="add a title before Retweete..."
                        fullWidth
                        size="small"
                        name="retweet"
                        value={text}
                        onChange={handleChangeText}
                      />
                    </Box>

                    <Button variant="contained" type="submit">
                      <Typography>
                        {RetweetMutation.isLoading ? (
                          <ClipLoader
                            color="#fafafa"
                            loading={RetweetMutation.isLoading}
                            size={12}
                            aria-label="Loading Spinner"
                            data-testid="loader"
                          />
                        ) : (
                          'Retweet'
                        )}
                      </Typography>
                    </Button>
                  </Box>
                </form>
              </Paper>
            </Fade>
          )}
        </Popper>
      </Box>
    </>
  );
};

export default Retweet;
