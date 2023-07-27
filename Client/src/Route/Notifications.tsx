import { Box, Typography, Avatar } from '@mui/material';
import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import grey from '@mui/material/colors/grey';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import { useRecoilValue } from 'recoil';
import __ from 'lodash';
// internally crafted imports of ressources
import useNotification from '../hooks/useNotifications';
import { IAuthState } from '../Interface/GlobalState';
import Context from '../Store/ContextApi';
import useWindowSize from '../hooks/useWindowSize';

interface INoti {
  _id: string;
  AlertText: string;
  NotiReference: string;
  NotiId: string;
  User: {
    _id: string;
    Firstname: string;
    Lastname: string;
    Image: string;
  };
}

const Notification: React.FC = () => {
  const ContextData = React.useContext(Context);

  const AuthInfo = useRecoilValue<Partial<IAuthState>>(ContextData.GetAuthInfo);

  const { GetNotifications, DeleteNotifications } = useNotification(
    `${AuthInfo.Payload?._id}`
  );
  const data = GetNotifications();
  const { width }: { width?: number } = useWindowSize();
  return (
    <>
      <Box
        pt={1}
        pl={{ md: 2, lg: 2 }}
        sx={{
          width: width && width <= 700 ? '100%' : 700,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <Box>
          <List
            sx={{ width: '100%', maxWidth: 695, bgcolor: 'background.paper' }}
          >
            {data?.Notifications.map((notiData) => {
              const {
                _id,
                AlertText,
                NotiReference,
                NotiId,
                User: { Firstname, Lastname, Image },
              }: INoti = notiData;
              return (
                <ListItem
                  key={NotiId}
                  alignItems="flex-start"
                  secondaryAction={
                    <>
                      {__.isEqual(NotiReference, 'follow') ? (
                        <Box
                          sx={{
                            display: 'flex',
                            gap: { xs: 1, sm: 2, md: 2, lg: 2 },
                          }}
                        >
                          <Button
                            variant="text"
                            sx={{
                              boxShadow: 'none',
                              fontWeight: 'bold',
                            }}
                          >
                            {width && width <= 700 ? 'follow' : 'follow back'}
                          </Button>
                          <IconButton
                            sx={{ bgcolor: grey[300] }}
                            onClick={() => {
                              DeleteNotifications({
                                _id,
                                NotiId,
                                SenderId: `${AuthInfo.Payload?._id}`,
                              });
                            }}
                          >
                            <CloseIcon sx={{ color: 'black' }} />
                          </IconButton>
                        </Box>
                      ) : (
                        <IconButton
                          sx={{ bgcolor: grey[300] }}
                          onClick={() => {
                            DeleteNotifications({
                              _id,
                              NotiId,
                              SenderId: `${AuthInfo.Payload?._id}`,
                            });
                          }}
                        >
                          <CloseIcon sx={{ color: 'black' }} />
                        </IconButton>
                      )}
                    </>
                  }
                >
                  <ListItemAvatar>
                    <Avatar alt="Remy Sharp" src={Image} />
                  </ListItemAvatar>
                  <ListItemText
                    sx={{ pr: 1 }}
                    primary={
                      <Typography
                        fontWeight="bold"
                        sx={{ textTransform: 'capitalize' }}
                      >
                        {__.isEqual(Firstname, AuthInfo.Payload?.Firstname) &&
                        __.isEqual(Lastname, AuthInfo.Payload?.Lastname)
                          ? 'You'
                          : ` ${Firstname} ${Lastname}`}
                      </Typography>
                    }
                    secondary={
                      <Typography
                        sx={{ display: 'inline' }}
                        component="span"
                        variant="body2"
                      >
                        {__.isEqual(NotiReference, 'likes') ||
                        __.isEqual(NotiReference, 'dislikes')
                          ? `${NotiReference} your post `
                          : __.isEqual(NotiReference, 'messaged')
                          ? 'messaged you'
                          : __.isEqual(NotiReference, 'comments')
                          ? 'comments on your post '
                          : __.isEqual(NotiReference, 'shares')
                          ? 'shares your post'
                          : __.isEqual(NotiReference, 'Retweeted')
                          ? 'Retweeted your post '
                          : __.isEqual(NotiReference, 'unfollow')
                          ? 'unfollows you'
                          : 'follows you '}
                        <Typography color="text.secondary" component="span">
                          {__.isEqual(NotiReference, 'follow') ||
                          __.isEqual(NotiReference, 'unfollow')
                            ? ''
                            : ` " ${AlertText} "`}
                        </Typography>
                      </Typography>
                    }
                  />
                </ListItem>
              );
            })}

            <Divider variant="inset" component="li" />
          </List>
        </Box>
        <Box pt={2} />
      </Box>
    </>
  );
};

export default Notification;
