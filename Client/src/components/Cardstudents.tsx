import * as React from 'react';
import Box from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import orange from '@mui/material/colors/orange';
import blue from '@mui/material/colors/blue';
import Stack from '@mui/material/Stack';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
// external imports of ressources
import { IcardInfo } from '../Interface/student';
import useWindowSize from '../hooks/useWindowSize';

const CardStudents: React.FC<IcardInfo> = ({ Image, Firstname, Lastname }) => {
  const { width }: { width?: number } = useWindowSize();

  return (
    <div>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: width && width < 700 ? '100%' : '84%',
        }}
      >
        <Box
          sx={{
            boxShadow: 'none',
            border: 0,
            pt: 3,
            width: '100%',
            height: 100,
            zIndex: 1,
            borderBottom: '1px solid grey',
            bgcolor: blue[300],
          }}
        >
          <span id="just for background" style={{ visibility: 'hidden' }}>
            for image background
          </span>
        </Box>
        <Box
          sx={{
            zIndex: 2,
            display: 'block',
            position: 'relative',
            mt: -7,
            mr: 'auto',
            ml: 'auto',
            boxShadow: 'none',
            border: 0,
            borderRadius: 50,
          }}
        >
          <Avatar alt="image" src={Image} sx={{ width: 90, height: 90 }}>
            RC
          </Avatar>
        </Box>
        <Box
          sx={{
            alignSelf: 'center',
            textAlign: 'center',
            boxShadow: 'none',
            border: 0,
          }}
        >
          <Typography fontFamily="Helvetica Narrow, sans-serif">
            {Firstname} {Lastname}
          </Typography>
          <Typography color="text.secondary">Student</Typography>
        </Box>
        <Box sx={{ alignSelf: 'center', boxShadow: 'none', border: 0, pt: 1 }}>
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              sx={{
                bgcolor: orange[800],
                borderRadius: 30,
                ':hover': { bgcolor: orange[800] },
              }}
            >
              <Typography fontWeight="bold" textTransform="capitalize">
                follow
              </Typography>
            </Button>
            <Button
              variant="contained"
              sx={{
                bgcolor: blue[100],
                borderRadius: 30,
                ':hover': { bgcolor: blue[100] },
              }}
            >
              <Typography
                fontWeight="bold"
                textTransform="capitalize"
                sx={{ color: blue[800] }}
              >
                contact
              </Typography>
            </Button>
          </Stack>
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: 1,
            boxShadow: 'none',
            border: 0,
            px: 1,
            py: 2,
            mr: 2,
          }}
        >
          <FacebookIcon sx={{ color: 'text.secondary' }} />
          <TwitterIcon sx={{ color: 'text.secondary' }} />
          <WhatsAppIcon sx={{ color: 'text.secondary' }} />
        </Box>
      </Box>
    </div>
  );
};

export default CardStudents;
