import * as React from 'react';
import { Box, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import Avatar from '@mui/material/Avatar';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import { FadeLoader } from 'react-spinners';
import __ from 'lodash';
import axios from 'axios';
// externally crafted imports of ressources
import useWindowSize from '../../hooks/useWindowSize';

interface IData<T> {
  Data: {
    Firstname: T;
    Lastname: T;
    SchoolLevel: T;
    Image: T;
    NoteLevel: T;
  }[];
}

const TalentedStudents: React.FC = () => {
  const [Data, setData] = React.useState<IData<string>['Data']>([]);

  const { width }: { width?: number } = useWindowSize();

  const Status: string = 'notelevel';

  const { data, isLoading } = useQuery<IData<string>, Error>({
    queryKey: ['talentedStudents', Status],
    queryFn: async ({ queryKey }) => {
      // declare the url
      const Url: string = `http://localhost:4000/home/dashboard/${queryKey[1]}`;
      const response = await axios.get<IData<string>>(Url);
      return response.data;
    },
    retry: 1,
  });

  React.useEffect(() => {
    // check if there is no data
    if (data === undefined) {
      return;
    }
    // if there is data perform actions
    if (data) {
      if (!__.isNil(data.Data)) {
        setData(data.Data);
      }
    }
  }, [data]);

  return (
    <>
      {isLoading ? (
        <Box pt={10} pl={7}>
          <FadeLoader
            color="hsla(0, 0%, 80%)"
            loading={isLoading}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </Box>
      ) : (
        <Box
          sx={{
            width: width && width < 900 ? '100%' : 'max(98%, 40%)',
          }}
        >
          <Paper>
            <Box p={2}>
              <Typography
                fontFamily="Andale Mono, monospace"
                textTransform="capitalize"
              >
                talented students
              </Typography>
            </Box>
            <Divider />
            {Data.map((row) => (
              <Box
                key={row.Firstname}
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'row',
                  bgcolor: (theme) => theme.palette.background.default,
                }}
              >
                <Avatar alt="" src={row.Image} />
                <Box sx={{ pl: 2 }}>
                  <Typography
                    textTransform="capitalize"
                    fontWeight="bold"
                    fontFamily="Roboto, sans serif"
                  >
                    {row.Firstname.charAt(0)}.{row.Lastname}
                  </Typography>
                  <Typography color="text.secondary">
                    {row.SchoolLevel}
                  </Typography>
                </Box>
                <Box sx={{ flexGrow: 1 }} />
                <Box>
                  <Typography color="text.secondary">
                    {row.NoteLevel}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Paper>
        </Box>
      )}
    </>
  );
};

export default TalentedStudents;
