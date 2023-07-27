import React, { FC } from 'react';
import { Box } from '@mui/material';
import { FadeLoader } from 'react-spinners';

const HomeLazyLoad: FC = () => {
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
          <FadeLoader
            color="hsla(0, 0%, 50%)"
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </Box>
      </Box>
    </div>
  );
};

export default HomeLazyLoad;
