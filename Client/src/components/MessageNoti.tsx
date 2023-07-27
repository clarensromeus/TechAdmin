import * as React from 'react';
import { Box, Typography } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import __ from 'lodash';
// internally crafted imports of ressources
import { IMessageNotiProps } from '../Interface/Notifications';

const MessageNotifications: React.FC<IMessageNotiProps> = ({
  open,
  anchorEl,
  setAnchorEl,
  Notifications,
}) => {
  // get only messaged notifications
  const NotiMessages = Notifications?.filter(
    (noti) => noti.NotiReference === 'messaged'
  );

  // close Message Menu
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      {__.gt(__.size(Notifications), 0) && (
        <Box sx={{ maxWidth: 250 }}>
          <Paper elevation={2}>
            <Menu
              anchorEl={anchorEl}
              id="account-menu"
              open={open}
              onClose={handleClose}
              onClick={handleClose}
              PaperProps={{
                style: {
                  maxHeight: 300,
                },
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem sx={{ textTransform: 'upperCase', fontWeight: 'bold' }}>
                Messages
              </MenuItem>
              <Divider />
              {NotiMessages?.map((value) => {
                const {
                  NotiReference,
                  User: { _id, Firstname, Lastname, Image },
                } = value;
                return (
                  <MenuItem key={_id} onClick={handleClose} divider>
                    <Avatar alt="messages" src={Image} />
                    <Box pl={1} sx={{ display: 'flex', gap: 1 }}>
                      <Typography fontWeight="bold">
                        {Firstname.toUpperCase().charAt(0)}.
                        {Lastname.toLowerCase()}
                      </Typography>
                      <Typography color="text.secondary">
                        &quot; {NotiReference} you &quot;
                      </Typography>
                    </Box>
                  </MenuItem>
                );
              })}
            </Menu>
          </Paper>
        </Box>
      )}
    </>
  );
};

export default MessageNotifications;
