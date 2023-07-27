import * as React from 'react';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import SearchIcon from '@mui/icons-material/Search';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import { UseQueryResult, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { NavigateFunction, useNavigate } from 'react-router-dom';
// external imports of ressources
import { IStudentData } from '../Interface/student';
import { ISearchProps } from '../Interface/GlobalState';

const SearchInfo: React.FC<ISearchProps> = ({
  setAnchorElSearch,
  anchorElSearch,
  search,
}) => {
  const handleClose = () => {
    setAnchorElSearch(null);
  };

  const open = Boolean(anchorElSearch);
  const id = open ? 'simple-popover' : undefined;

  const navigate: NavigateFunction = useNavigate();

  const {
    data,
  }: UseQueryResult<IStudentData<string>, Error> = useQuery<
    IStudentData<string>,
    Error
  >({
    queryKey: ['Share'],
    queryFn: async () => {
      // declare the url
      const Url: string = 'http://localhost:4000/home/students/suggestion';
      const response = await axios.get<IStudentData<string>>(Url);
      return response.data;
    },
    retry: 2, // retry twice if query errored out
  });

  return (
    <>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorElSearch}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        disableScrollLock
        disableAutoFocus
      >
        <Box pt={2} px={2}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <SearchIcon sx={{ color: 'black', pt: '10px' }} />
            <Typography pt={1}>search</Typography>
          </Box>
        </Box>
        <Box
          sx={{
            minHeight: 90,
            maxHeight: 280,
            width: '100%',
          }}
        >
          <List
            dense
            sx={{
              position: 'relative',

              overflow: 'auto',
              maxHeight: 'inherit',
              width: { xs: '100%', sm: '100%', md: 400, lg: 400 },
              bgcolor: 'background.paper',
            }}
          >
            {data?.doc
              .filter((student) =>
                search.toLowerCase() === ''
                  ? student
                  : student.Firstname.toLowerCase().includes(
                      search.toLowerCase()
                    )
              )
              .map((student) => {
                return (
                  <ListItem key={student._id} disablePadding sx={{}}>
                    <ListItemButton
                      onClick={() => {
                        navigate(`/home/students/${student._id}`);
                        handleClose();
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar alt={student.Firstname} src={student.Image} />
                      </ListItemAvatar>
                      <ListItemText
                        id={`${student._id}`}
                        primary={
                          <Typography fontWeight="bold">
                            {student.Firstname} {student.Lastname}
                          </Typography>
                        }
                        secondary={student.Email}
                      />
                    </ListItemButton>
                  </ListItem>
                );
              })}
          </List>
        </Box>
      </Popover>
    </>
  );
};

export default SearchInfo;
