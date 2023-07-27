import React, { FC } from 'react';
import { Box, Typography } from '@mui/material';

const NotFound: FC = () => {
  return (
    <div>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <Box>
          <Typography
            pl={7}
            fontWeight="bold"
            fontSize="1.9em"
            color="secondary.light"
          >
            404
          </Typography>
        </Box>
        <Box>
          <Typography fontWeight="bold" fontSize="2.1em">
            Not Found !
          </Typography>
        </Box>
      </Box>
    </div>
  );
};

export default NotFound;
