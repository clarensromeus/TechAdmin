// internal imports of sources
import * as React from 'react';
import { FC } from 'react';
// external imports of sources
import { Box, Typography, Button, Divider } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import MenuIcon from '@mui/icons-material/Menu';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Badge from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';
import Icon from '@mui/material/Icon';
import orange from '@mui/material/colors/orange';
import { styled } from '@mui/material/styles';
import { loadCSS } from 'fg-loadcss';
import { useSetRecoilState, useRecoilValue } from 'recoil';
import axios from 'axios';
import {
  useQuery,
  UseQueryResult,
  useMutation,
  useQueryClient,
  QueryClient,
} from '@tanstack/react-query';
import __ from 'lodash';
import {
  NavigateFunction,
  useLocation,
  useNavigate,
  Location,
} from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import { decodeToken } from 'react-jwt';
// internally crafted imports of sources like created components and so...
import admin from '../../images/static/admin.png';
import {
  StudentLoginType,
  AdminLoginType,
  StudentRegisterType,
  AdminRegisterType,
} from '../../Store/globalStoreTypes';
import { IAuthState } from '../../Interface/GlobalState';
import Context from '../../Store/ContextApi';
import isAuthenticated from '../../utils/isAuthenticated';
import { MenuLoggedIn, MenuLogOut } from './Menu';
import {
  IMessageNotiProps,
  IDisplayNotiProps,
} from '../../Interface/Notifications';
import MessageNotifications from '../MessageNoti';
import DisplayNotifications from '../DisplayNoti';
import useNotification from '../../hooks/useNotifications';
import { IHistoryProps } from '../../Interface/GlobalState';
import History from '../History';
import SearchBar from '../SearchBar';
import useWindowSize from '../../hooks/useWindowSize';
import { IMobileDrawerProps } from '../../Interface/Notifications';
import MobileDrawer from '../MobileDrawer';
import { IGetData } from '../../Interface/GlobalState';
import SearchBarMobile from '../SearchBarMobile';
import useHistory from '../../hooks/useHistory';
import { IGetHistory } from '../../Interface/History';

const NavBar: FC = () => {
  // using to define a normal set of pixels between the appBar and all components below
  const Offset = styled('div')(({ theme }) => theme.mixins.toolbar);
  // defining the App Bar color
  const NavBarColor: string = orange[600];

  const ContextData = React.useContext(Context);
  const location: Location = useLocation();

  const [state, setState] = React.useState<boolean>(false);

  const [visible, setVisible] = React.useState<boolean>(false);

  // retrieving the pathname of the current route to toggle login and register status
  const { pathname }: { pathname: string } = location;
  const tokenInfo: any = decodeToken(
    `${window.localStorage.getItem('TOKEN') || ''}`
  );

  const { AuthState, GetAuthInfo } = ContextData;
  const isAuth: boolean = isAuthenticated();
  const navigate: NavigateFunction = useNavigate();
  const { GetHistory } = useHistory();
  const HistoryData: IGetHistory | undefined = GetHistory();
  const queryClient: QueryClient = useQueryClient();

  const { width }: { width?: number } = useWindowSize();

  const AuthInfo = useRecoilValue<Partial<IAuthState>>(GetAuthInfo);

  const [Status, setStatus] = React.useState<string>('Who are you ?');

  const [isNoti, setNoti] = React.useState<boolean>(false);
  const [openMoDrawer, setOpenMoDrawer] = React.useState<boolean>(false);

  // state to open and close Notifications menu
  const [openNoti, setOpenNoti] = React.useState<boolean>(false);

  const setAuthState = useSetRecoilState<Partial<IAuthState>>(AuthState);

  // state to open and close Message Menu
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const username: string = `${AuthInfo.Payload?.Firstname} ${AuthInfo.Payload?.Lastname}`;

  const handleOpenMessageNoti = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const history: IHistoryProps = {
    state,
    setState,
  };

  // customizer for balancing equality for login and register status
  function statusCustomizer<T extends string>(
    authStatus: T,
    cmpstatus: T
  ): boolean {
    return authStatus === cmpstatus;
  }

  const { GetNotifications } = useNotification(
    `${AuthInfo.Payload?._id}`,
    isNoti
  );

  const dataNoti = GetNotifications();

  const DisplayNoti: IDisplayNotiProps = {
    openNoti,
    setOpenNoti,
    Notifications: dataNoti?.Notifications,
  };

  const Message: IMessageNotiProps = {
    open,
    anchorEl,
    setAnchorEl,
    Notifications: dataNoti?.Notifications,
  };

  const MobileDrawerProps: IMobileDrawerProps = {
    _id: `${AuthInfo.Payload?._id}`,
    Firstname: `${AuthInfo.Payload?.Firstname}`,
    Lastname: `${AuthInfo.Payload?.Lastname}`,
    Image: `${AuthInfo.Payload?.Image}`,
    openMoDrawer,
    setOpenMoDrawer,
  };

  const { data }: UseQueryResult<IGetData, Error> = useQuery<
    IGetData,
    Error,
    IGetData
  >({
    queryKey: ['MainData'],
    queryFn: async () => {
      // declare the url
      const Url: string = `http://localhost:4000/home/info/${tokenInfo.PersonStatus}/${tokenInfo._id}`;
      const res = await axios.get<IGetData>(Url);
      return res.data;
    },
    enabled: isAuth,
  });

  const LogOutMutation = useMutation({
    mutationFn: async () => {
      try {
        const response = await axios.delete(
          'http://localhost:4000/home/logout'
        );
        return response;
      } catch (error) {
        throw new Error(`${error}`);
      }
    },
    onSuccess: () => {
      // remove all stored data from the the browser like token and so ....
      queryClient.removeQueries();
      window.localStorage.clear();
      navigate('/login', { replace: true });
    },
  });

  React.useEffect(() => {
    const node = loadCSS(
      'https://use.fontawesome.com/releases/v5.14.0/css/all.css'
      // Inject before JSS
    );

    return () => {
      node.parentNode!.removeChild(node);
    };
  }, []);

  React.useEffect(() => {
    if (!data) return;
    setAuthState((old) => {
      return {
        ...old,
        Payload: data.Data,
      };
    });
    setNoti(true);
  }, [data]);

  return (
    <>
      <History {...history} />
      <MessageNotifications {...Message} />
      <DisplayNotifications {...DisplayNoti} />
      <MobileDrawer {...MobileDrawerProps} />
      <Box>
        <AppBar
          position="fixed"
          sx={{
            bgcolor: NavBarColor,
            zIndex: (theme) => theme.zIndex.drawer + 1,
          }}
          elevation={0}
        >
          <Toolbar>
            <span style={{ fontSize: '1.5em', fontStyle: 'italic' }}>
              TechAdmin
            </span>
            <Icon baseClassName="fas" className="" sx={{ fontSize: 30 }} />
            {width && width > 700 && isAuth && (
              <Box pl={7}>
                <IconButton
                  size="large"
                  edge="start"
                  color="inherit"
                  aria-label="open drawer"
                  sx={{ mr: 2 }}
                  disableFocusRipple
                  onClick={() => {
                    setAuthState((old) => {
                      return { ...old, toggle: !old.toggle };
                    });
                  }}
                >
                  {!AuthInfo.toggle ? <MenuIcon /> : <CloseIcon />}
                </IconButton>
              </Box>
            )}
            {width && width > 700 && isAuth && <SearchBar />}
            <Box
              sx={{
                flexGrow: 1,
                display: { sm: 'block' },
              }}
            />
            <Box
              sx={{
                display: 'flex',
              }}
            >
              {isAuth && (
                <Box pr={2} sx={{ pt: '7px' }}>
                  <Stack direction="row" spacing="2px">
                    {width && width <= 700 && <SearchBarMobile />}
                    {width && width > 700 && (
                      <IconButton onClick={handleOpenMessageNoti}>
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
                            sx={{ color: '#fafafa' }}
                            fontSize="small"
                          />
                        </Badge>
                      </IconButton>
                    )}
                    {AuthInfo.Payload?.PersonStatus === 'Student' ? (
                      <IconButton
                        onClick={() => {
                          if (width && width < 700) {
                            navigate('home/notifications');
                          } else {
                            setOpenNoti((old) => !old);
                          }
                        }}
                      >
                        <Badge
                          badgeContent={
                            dataNoti?.Notifications.length === 0
                              ? null
                              : dataNoti?.Notifications.length
                          }
                          color="primary"
                        >
                          <NotificationsIcon
                            sx={{ color: '#fafafa' }}
                            fontSize="small"
                          />
                        </Badge>
                      </IconButton>
                    ) : (
                      <IconButton
                        onClick={() => {
                          setState((old) => !old);
                        }}
                      >
                        <Badge
                          badgeContent={
                            HistoryData?.doc.length === 0
                              ? null
                              : HistoryData?.doc.length
                          }
                          color="primary"
                        >
                          <Icon
                            baseClassName="fas"
                            className="fa-regular fa-book"
                            fontSize="small"
                            sx={{ color: '#fafafa' }}
                          />
                        </Badge>
                      </IconButton>
                    )}

                    {width && width <= 700 && (
                      <IconButton
                        onClick={() => setOpenMoDrawer((old) => !old)}
                      >
                        <Badge color="primary">
                          <Icon
                            baseClassName="fas"
                            className="fa-solid fa-paper-plane"
                            sx={{ color: '#fafafa', mt: '-4px' }}
                            fontSize="small"
                          />
                        </Badge>
                      </IconButton>
                    )}
                  </Stack>
                </Box>
              )}
              {width && width > 700 && (
                <Box>
                  <Avatar
                    alt="Travis Howard"
                    src={admin}
                    sx={{ bgcolor: '#fafafa' }}
                  />
                </Box>
              )}
              {width && width > 700 && (
                <Typography component="div">
                  <Button
                    variant="text"
                    id="menu"
                    onClick={() => {
                      setVisible((prev) => !prev);
                    }}
                    disableRipple
                  >
                    <span style={{ color: '#fafafa', fontWeight: 'bold' }}>
                      {isAuth ? username : Status}
                    </span>
                    <ExpandLessIcon
                      sx={{ color: '#fafafa', fontSize: '2em' }}
                    />
                  </Button>
                </Typography>
              )}
            </Box>
            <Box
              sx={{
                position: 'absolute',
                top: '92%',
                left: { sm: '72%', md: '83%', lg: '83%' },
                width: 200,
                display: visible ? 'block' : 'none',
                borderRadius: 10,
                zIndex: (theme) => theme.zIndex.tooltip,
              }}
            >
              <Paper elevation={3}>
                {isAuth && (
                  <Box
                    p={2}
                    sx={{
                      display: 'flex',
                      flexDirection: 'row',
                      gap: 2,
                      zIndex: (theme) => theme.zIndex.tooltip,
                    }}
                  >
                    <Box>
                      <Avatar alt="Profile" src={AuthInfo.Payload?.Image} />
                    </Box>
                    <Box>
                      <Typography fontSize="bold">
                        {AuthInfo.Payload?.Firstname?.toUpperCase().charAt(0)}.
                        {AuthInfo.Payload?.Lastname?.toLowerCase()}
                      </Typography>
                      <Typography color="text.secondary">Student</Typography>
                    </Box>
                  </Box>
                )}
                <Divider />
                {isAuth
                  ? MenuLoggedIn.map((value) => {
                      return (
                        <Stack key={value.Option} direction="column">
                          <Button
                            onClick={() => {
                              const GoToLogOut = __.isEqual(
                                value.Option.toUpperCase(),
                                'LOGOUT'
                              );
                              const GoToProfile = __.isEqual(
                                value.Option.toUpperCase(),
                                'PROFILE'
                              );
                              const GoToLock = __.isEqual(
                                value.Option.toUpperCase(),
                                'LOCK'
                              );
                              if (GoToLogOut) {
                                LogOutMutation.mutate();
                              }
                              if (GoToProfile) {
                                navigate(
                                  `home/profile/${tokenInfo.PersonStatus}/${tokenInfo._id}`
                                );
                              }

                              if (GoToLock) {
                                navigate('/lockscreen');
                              }
                              setVisible(false);
                            }}
                            sx={{
                              display: 'flex',
                              bgcolor: 'white',
                              flexDirection: 'row',
                              justifyContent: 'flex-start',
                              pt: 1,
                              ':hover': {
                                bgcolor: '#E8F0FE',
                              },
                            }}
                          >
                            <Box pt={1} pl={1}>
                              {value.Icon}
                            </Box>
                            <Box pl={3}>
                              {' '}
                              <Typography
                                fontSize="1.2em"
                                textTransform="capitalize"
                                sx={{ color: 'black' }}
                              >
                                {value.Option}
                              </Typography>
                            </Box>
                          </Button>
                        </Stack>
                      );
                    })
                  : MenuLogOut.map((value) => {
                      return (
                        <Stack
                          key={value.clientName}
                          direction="column"
                          gap={5}
                        >
                          <Button
                            onClick={() => {
                              setStatus(value.clientName);
                              // if login page
                              if (__.isEqual(pathname, '/login')) {
                                if (
                                  __.isEqualWith(
                                    value.clientName,
                                    'Administrator',
                                    statusCustomizer
                                  )
                                ) {
                                  setAuthState({
                                    type: AdminLoginType,
                                    status: 'admin',
                                  });
                                } else {
                                  setAuthState({
                                    type: StudentLoginType,
                                    status: 'student',
                                  });
                                }
                              }
                              // if register page
                              if (__.isEqual(pathname, '/register')) {
                                if (
                                  __.isEqualWith(
                                    value.clientName,
                                    'Administrator',
                                    statusCustomizer
                                  )
                                ) {
                                  setAuthState({
                                    type: AdminRegisterType,
                                    status: 'admin',
                                  });
                                } else {
                                  setAuthState({
                                    type: StudentRegisterType,
                                    status: 'student',
                                  });
                                }
                              }
                              setVisible(false);
                            }}
                            sx={{
                              display: 'flex',
                              bgcolor: 'white',
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              pt: 1,
                              ':hover': {
                                bgcolor: '#E8F0FE',
                              },
                            }}
                          >
                            <Box>{value.Icon}</Box>
                            <Box pr={1} pb="2px">
                              {' '}
                              <Typography
                                fontSize="1.2em"
                                textTransform="uppercase"
                                sx={{ color: 'black' }}
                              >
                                {value.clientName}
                              </Typography>
                            </Box>
                          </Button>
                        </Stack>
                      );
                    })}
              </Paper>
            </Box>
          </Toolbar>
        </AppBar>
        <Offset />
      </Box>
    </>
  );
};

export default NavBar;
