import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
// extternally crafted imports of ressources
import { IDrawer } from '../Interface/interface';
import Follow from '../components/Home/Follow';

const FriendsToChat: React.FC = () => {
  const [DialogOpen, setDialogOpen] = React.useState<boolean>(false);

  const CloseDialog = () => {
    setDialogOpen(false);
  };

  const FollowProps: IDrawer = {
    DialogOpen,
    CloseDialog,
  };

  return (
    <>
      <Follow {...FollowProps} />
      <Box sx={{ width: '100%', height: '100%' }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: 'inherit',
            textAlign: 'center',
            px: 2,
          }}
        >
          <Box>
            <Typography
              fontWeight="bold"
              fontSize="1.8rem"
              textTransform="capitalize"
            >
              select a person to chat
            </Typography>
          </Box>
          <Box>
            <Typography color="text.secondary">
              pick from your existing chatbox, or just keep searching through{' '}
            </Typography>
          </Box>
          <Box pt={2}>
            <Button
              variant="contained"
              size="large"
              sx={{ boxShadow: 'none', borderRadius: 50 }}
              onClick={() => {
                setDialogOpen(true);
              }}
            >
              searching
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default FriendsToChat;
