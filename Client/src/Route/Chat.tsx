// internal imports of ressources
import * as React from 'react';
// external imports of ressources
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import __ from 'lodash';
import axios from 'axios';
import { Outlet, useLocation, Location } from 'react-router-dom';
import { FadeLoader } from 'react-spinners';
import { decodeToken } from 'react-jwt';
// internally crafted imports of ressources
import { IFriends } from '../Interface/Chat';
import useWindowSize from '../hooks/useWindowSize';
import SideChat from '../components/Home/SideChat';
import { ISidechat } from '../Interface/Chat';

const Chat: React.FC = () => {
  const [friends, setFriends] = React.useState<ISidechat['Friends']>(
    [] as ISidechat['Friends']
  );

  const [Messages, setMessages] = React.useState<ISidechat['Chat']>(
    [] as ISidechat['Chat']
  );

  const { width }: { width?: number } = useWindowSize();
  const location: Location = useLocation();
  const id: string = location.pathname.split('/')[3];

  const { data, isLoading }: UseQueryResult<IFriends, Error> = useQuery<
    IFriends,
    Error
  >({
    queryKey: ['ChatFriends'],
    queryFn: async () => {
      const TokenInfo: any = decodeToken(
        `${window.localStorage.getItem('TOKEN') || ''}`
      );
      // declare the url
      const Url: string = `http://localhost:4000/home/chat/messages/${TokenInfo._id}`;
      const response = await axios.get<IFriends>(Url);
      return response.data;
    },
    // refetch query after every 1 second
    refetchInterval: 1000,
    // refetch query in background mode
    refetchIntervalInBackground: true,
  });

  const SideChatData: ISidechat = {
    Friends: friends,
    Chat: Messages,
  };

  React.useEffect(() => {
    // check if there is no data
    if (data === undefined) {
      return;
    }
    // if there is data perform actions
    if (data) {
      if (!__.isNil(data.doc)) {
        if (!__.isNil(data.doc.Friends)) {
          setFriends(data.doc.Friends);
        }
        if (!__.isNil(data.doc.Chat)) {
          setMessages(data.doc.Chat);
        }
      }
    }
  }, [data]);

  return (
    <>
      {isLoading ? (
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <Box>
            <FadeLoader
              color="hsla(0, 0%, 80%)"
              loading={isLoading}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          </Box>
        </Box>
      ) : (
        <Box pl={width && width >= 700 ? '8px' : 0} sx={{ flexGrow: 1 }}>
          <Grid container display="flex" flexDirection="row" flexGrow={1}>
            <Grid item xs={12} sm={12} md={4} lg={4}>
              {!__.isUndefined(id) && width && width <= 900 ? null : (
                <SideChat {...SideChatData} />
              )}
            </Grid>
            <Grid item xs={12} sm={12} md={8} lg={8} alignSelf="center">
              {__.isUndefined(id) && width && width <= 900 ? null : (
                <Outlet
                  context={{
                    ClientData: data?.doc.Chat,
                    GuessData: data?.doc.Friends,
                  }}
                />
              )}
            </Grid>
          </Grid>
        </Box>
      )}
    </>
  );
};

export default Chat;
