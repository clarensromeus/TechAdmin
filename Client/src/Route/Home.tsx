// external imports of sources
import * as React from 'react';
import {
  Outlet,
  Link,
  useNavigate,
  useLocation,
  Location,
  NavigateFunction,
} from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import { styled, Theme, CSSObject } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import ListItemButton from '@mui/material/ListItemButton';
import BottomNavigation from '@mui/material/BottomNavigation';
import Button from '@mui/material/Button';
import blue from '@mui/material/colors/blue';
import Avatar from '@mui/material/Avatar';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import PaymentsIcon from '@mui/icons-material/Payments';
import BookmarksIcon from '@mui/icons-material/Bookmarks';
import NotificationsIcon from '@mui/icons-material/Notifications';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import orange from '@mui/material/colors/orange';
import Badge from '@mui/material/Badge';
import MuiBottomNavigationAction from '@mui/material/BottomNavigationAction';
import Divider from '@mui/material/Divider';
import Icon from '@mui/material/Icon';
import { loadCSS } from 'fg-loadcss';
import blueGrey from '@mui/material/colors/blueGrey';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import { useRecoilValue } from 'recoil';
import { decodeToken } from 'react-jwt';
import isEqual from 'lodash/isEqual';
import isUndefined from 'lodash/isUndefined';
// imports crafted imports of sources
import StyledBadge from '../MuiStyles/StyledBadge';
import Context from '../Store/ContextApi';
import { IAuthState } from '../Interface/GlobalState';
import PostFrame from '../components/Home/PostFrame';
import { IPostFrame } from '../Interface/Posts';
import useWindowSize from '../hooks/useWindowSize';
import useNotification from '../hooks/useNotifications';

// width of the drawer
const drawerWidth: number = 240;

// helper that takes effect when opening drawer
const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

// helper that takes effect when closing drawer
const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

// drawer helper
const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme),
  }),
}));

const Home: React.FC = () => {
  React.useEffect(() => {
    const node = loadCSS(
      'https://use.fontawesome.com/releases/v5.14.0/css/all.css'
      // Inject before JSS
    );

    return () => {
      node.parentNode!.removeChild(node);
    };
  }, []);

  interface IDrawer<T> {
    [index: string]: T | any;
  }

  const ContextData = React.useContext(Context);
  // state to display active destination on mobile and by default it is 0
  // which means the first one
  const [value, setValue] = React.useState<number>(0);

  const { GetAuthInfo } = ContextData;

  const [OpenDialog, setOpenDialog] = React.useState<boolean>(false);

  const AuthInfo = useRecoilValue<Partial<IAuthState>>(GetAuthInfo);

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const PostFrameData: IPostFrame = {
    OpenDialog,
    setOpenDialog,
    handleCloseDialog,
    UserId: `${AuthInfo.Payload?._id}`,
  };
  // an array of Items for handling the drawer
  const DrawerTextIcon: IDrawer<string>[] = [
    { Text: 'Dashboard', DrawerIcon: <HomeIcon />, Path: 'dashboard' },
    { Text: 'Students', DrawerIcon: <PersonIcon />, Path: 'students' },
    {
      Text: 'Notifications',
      DrawerIcon: <NotificationsIcon />,
      Path: 'notifications',
    },
    { Text: 'Teachers', DrawerIcon: <PeopleAltIcon />, Path: 'teachers' },
    { Text: 'Payment', DrawerIcon: <PaymentsIcon />, Path: 'payment' },
    { Text: 'Calendar', DrawerIcon: <BookmarksIcon />, Path: 'calendar' },
    {
      Text: 'Chat',
      DrawerIcon: (
        <Icon
          baseClassName="fas"
          className="fa-solid fa-comment"
          fontSize="small"
        />
      ),
      Path: 'chat',
    },
    { Text: 'Admin', DrawerIcon: <ManageAccountsIcon />, Path: 'admin' },
  ];

  const navigate: NavigateFunction = useNavigate();
  const location: Location = useLocation();

  const [first, second, third]: string[] = location.pathname
    .split('/')
    .filter((val) => {
      return val !== '';
    });

  const BottomVisible: boolean = isEqual(second, 'chat') && !isUndefined(third);

  const { width }: { width?: number } = useWindowSize();
  const open: boolean = AuthInfo.toggle ?? false;

  const { GetNotifications } = useNotification();
  const dataNoti = GetNotifications();
  // override default bottom navigation style
  const BottomNavigationAction = styled(MuiBottomNavigationAction)(`
  &.Mui-selected {
    color: darkOrange;
  }
`);

  const TokenInfo: any = decodeToken(
    `${window.localStorage.getItem('TOKEN')}` || ''
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer
        variant={width && width < 700 ? 'temporary' : 'permanent'}
        open={open}
      >
        <Toolbar />
        {open && (
          <Box
            pt={2}
            sx={{
              display: 'flex',
              justifyContent: 'center',
              flexDirection: 'column',
            }}
          >
            <Box pl={6}>
              {' '}
              <StyledBadge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                variant="dot"
              >
                <Avatar
                  onClick={() =>
                    navigate(
                      `profile/${TokenInfo.PersonStatus}/${TokenInfo._id}`
                    )
                  }
                  alt="Profile"
                  src={AuthInfo.Payload?.Image}
                  sx={{ width: 57, height: 57 }}
                />
              </StyledBadge>
            </Box>
            <Box pl={4}>
              <Typography
                fontFamily="Times New Roman, serif"
                color="success.light"
                variant="body2"
              >
                {`${AuthInfo.Payload?.Firstname} ${AuthInfo.Payload?.Lastname}`}
              </Typography>
            </Box>
          </Box>
        )}
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {DrawerTextIcon.map((text) => {
              const { Text, DrawerIcon, Path }: IDrawer<string> = text;
              return (
                <ListItem
                  button
                  key={Text}
                  disableRipple
                  sx={{
                    borderColor: second === Path ? orange[600] : null,
                    borderRightStyle: second === Path ? 'solid' : null,
                    borderRightWidth: second === Path ? 4 : null,
                    bgcolor: second === Path ? orange[50] : null,
                    color: second === Path ? orange[50] : null,
                    ':hover': {
                      bgcolor: orange[50],
                    },
                  }}
                  disablePadding
                >
                  <ListItemButton
                    onClick={() => navigate(`${Path}`)}
                    disableRipple
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? 'initial' : 'center',
                      px: 2.5,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        color: second === Path ? orange[700] : null,
                        minWidth: 0,
                        mr: open ? 3 : 'auto',
                        justifyContent: 'center',
                      }}
                    >
                      {DrawerIcon}
                    </ListItemIcon>
                    {open && (
                      <Link
                        style={{
                          textTransform: 'uppercase',
                          fontFamily: 'Roboto',
                          textDecoration: 'none',
                          color: second === Path ? orange[700] : '#424242',
                        }}
                        to={Path}
                      >
                        {Text}
                      </Link>
                    )}
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </Box>
        {!open && (
          <Box sx={{ alignSelf: 'center', alignContent: 'flex-end' }}>
            <IconButton
              onClick={(e: React.SyntheticEvent) => {
                e.preventDefault;
                setOpenDialog(true);
              }}
              sx={{
                bgcolor: blue[400],
                ':hover': {
                  bgcolor: blue[600],
                },
              }}
            >
              <HistoryEduIcon sx={{ color: '#fafafa' }} />
            </IconButton>
          </Box>
        )}
        {open && (
          <Box sx={{ alignSelf: 'center', alignContent: 'flex-end' }}>
            <Button
              variant="outlined"
              onClick={(e: React.SyntheticEvent) => {
                e.preventDefault;
                setOpenDialog(true);
              }}
              sx={{
                color: blue[700],
                borderColor: blue[600],
                borderRadius: 100,
                ':hover': {
                  borderColor: blue[600],
                },
              }}
            >
              drop a hint
            </Button>
          </Box>
        )}
      </Drawer>
      <PostFrame {...PostFrameData} />
      <Box sx={{ flexGrow: 1 }}>
        {second !== 'chat' && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Box pl={1} sx={{ display: 'flex', flexDirection: 'row' }}>
              <Typography
                fontFamily="Helvetica Narrow, sans-serif"
                fontSize="1.8em"
                textTransform="capitalize"
                fontWeight="bold"
                color="text.secondary"
              >
                {first}
              </Typography>
              <Typography
                fontFamily="Helvetica Narrow, sans-serif"
                fontSize="1.2em"
                color="text.secondary"
                sx={{ pl: 1, pt: 1 }}
              >
                {'>'} {second}
              </Typography>
            </Box>
            <Divider />
          </Box>
        )}
        <Outlet />
        {width && width < 700 && isEqual(BottomVisible, false) && (
          <Paper
            sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}
            elevation={3}
          >
            <BottomNavigation
              showLabels
              value={value}
              onChange={(event, newValue) => {
                setValue(newValue);
              }}
              sx={{ '.Mui-selected': {} }}
            >
              <BottomNavigationAction
                label="Dashboard"
                icon={<HomeIcon />}
                onClick={() => navigate('profile')}
              />
              <BottomNavigationAction
                onClick={() => navigate('students')}
                label="Student"
                icon={<PersonIcon />}
              />
              <BottomNavigationAction
                label="Chat"
                onClick={() => navigate('chat')}
                icon={
                  <Badge
                    badgeContent={
                      dataNoti?.Notifications?.filter(
                        (val) => val.NotiReference === 'messaged'
                      )?.length
                    }
                    color="primary"
                  >
                    <Icon
                      baseClassName="fas"
                      className="fa-solid fa-comment"
                      fontSize="small"
                    />
                  </Badge>
                }
              />
              <BottomNavigationAction
                label="Pay"
                onClick={() => navigate('payment')}
                icon={<PaymentsIcon />}
              />
              <BottomNavigationAction
                onClick={() => navigate('admin')}
                label="Admin"
                icon={<ManageAccountsIcon />}
              />
            </BottomNavigation>
          </Paper>
        )}
      </Box>
    </Box>
  );
};

export default Home;
