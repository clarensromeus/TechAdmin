import * as React from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import orange from '@mui/material/colors/orange';
import grey from '@mui/material/colors/grey';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import green from '@mui/material/colors/green';
import blue from '@mui/material/colors/blue';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
  useMutation,
  useQuery,
  UseQueryResult,
  useQueryClient,
  QueryClient,
} from '@tanstack/react-query';
import __ from 'lodash';
import { ClipLoader } from 'react-spinners';
import { decodeToken } from 'react-jwt';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme, Theme } from '@mui/material/styles';
// internal crafted imports of ressources
import { IAuthState } from '../Interface/GlobalState';
import Context from '../Store/ContextApi';
import TabPanel from '../components/Home/TabPanel';
import MyAccount from '../components/UserAccount/MyAccount';
import EditAccount from '../components/UserAccount/EditAccount';
import UserPosts from '../components/UserPosts';
import { IProfile, Iinfo } from '../Interface/profile';
import useWindowSize from '../hooks/useWindowSize';
import UploadFile from '../components/Home/UploadFile';

interface IResponse {
  success: boolean;
  token: string;
  Image: string;
}

interface Iparams {
  status?: string;
  _id?: string;
}
const Profile: React.FC = () => {
  const ContextData = React.useContext(Context);

  const themeStyle: Theme = useTheme();
  const fullScreen: boolean = useMediaQuery(themeStyle.breakpoints.down('sm'));

  const params: Iparams = useParams<{
    status?: string;
    _id?: string;
  }>();

  const [value, setValue] = React.useState<number>(0);
  const AuthInfo = useRecoilValue<Partial<IAuthState>>(ContextData.GetAuthInfo);
  const setAuthState = useSetRecoilState<Partial<IAuthState>>(
    ContextData.AuthState
  );

  // state to get and set the file
  const [file, setFile] = React.useState<any>();
  const [OpenDialog, setOpenDialog] = React.useState<boolean>(false);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  const changeFileHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const getFile = e.target.files[0];
      setFile(getFile);
    }
  };

  const { PreviewImage } = UploadFile({ file });

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const { width }: { width?: number } = useWindowSize();
  const queryClient: QueryClient = useQueryClient();

  const mutation = useMutation<IResponse, Error, any>({
    mutationFn: async (formdata: any): Promise<any> => {
      const response = await axios.patch<IResponse>(
        'http://localhost:4000/home/profile/changePicture',
        formdata
      );

      return response.data;
    },
    onSuccess: (data: { Image: string }) => {
      queryClient.invalidateQueries({
        queryKey: ['Profile'],
      });
      setAuthState((old) => {
        return {
          ...old,
          Payload: {
            ...old.Payload,
            Firstname: `${data.Image.slice(0, 6)}`,
            Image: `${data.Image}`,
          },
        };
      });
      setOpenDialog(false);
    },
  });

  const { data }: UseQueryResult<IProfile, Error> = useQuery<IProfile, Error>({
    queryKey: ['statistics'],
    queryFn: async () => {
      const tokenInfo: any = decodeToken(
        `${window.localStorage.getItem('TOKEN')}` || ''
      );
      // declare the url
      const Url: string = `http://localhost:4000/home/profile/${tokenInfo._id}`;
      const res = await axios.get<IProfile>(Url);
      return res.data;
    },
  });

  const { data: dataInfo }: UseQueryResult<Iinfo, Error> = useQuery<
    Iinfo,
    Error
  >({
    queryKey: ['Profile'],
    queryFn: async () => {
      // declare the url
      const Url: string = `http://localhost:4000/home/profile/${params.status}/${params._id}`;
      const res = await axios.get(Url);
      return res.data;
    },
  });

  return (
    <div>
      <Dialog
        open={OpenDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullScreen={fullScreen}
      >
        <form
          id="Post"
          onSubmit={async (e: any) => {
            e.preventDefault();
            const formData = new FormData();
            await formData.append('file', file);
            await formData.append('_id', `${AuthInfo.Payload?._id}`);
            mutation.mutate(formData);
          }}
        >
          <DialogTitle sx={{ fontSize: '1.5em', color: 'text.secondary' }}>
            Uploading your image...
          </DialogTitle>
          <DialogContent
            sx={{
              border: `2px solid ${grey[200]}`,
              width: { sm: '100%', md: 450, lg: 450 },
              height: 370,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {__.isUndefined(PreviewImage) ? (
              <IconButton
                color="primary"
                aria-label="upload picture"
                component="label"
              >
                <input
                  hidden
                  accept="image/*"
                  type="file"
                  onChange={changeFileHandler}
                />
                <CloudUploadIcon
                  sx={{ width: 150, height: 120, color: blue[100] }}
                />
              </IconButton>
            ) : (
              <img
                style={{ width: 500, height: 400 }}
                alt={PreviewImage && PreviewImage.name}
                src={PreviewImage && PreviewImage}
              />
            )}
          </DialogContent>
          <DialogActions
            sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}
          >
            <Button
              variant="contained"
              type="submit"
              sx={{ boxShadow: 'none', borderRadius: 20 }}
            >
              {mutation.isLoading ? (
                <ClipLoader
                  color="#fafafa"
                  loading={mutation.isLoading}
                  size={12}
                  aria-label="Loading Spinner"
                  data-testid="loader"
                />
              ) : (
                'upload'
              )}
            </Button>
            <Button
              sx={{
                bfcolor: green[900],
                color: green[900],
              }}
              onClick={handleCloseDialog}
            >
              cancel
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      <Box pt={1} px={{ xs: 1, sm: 1, md: 2, lg: 2 }} pb={4}>
        <Box
          sx={{
            width: '100%',
            bgcolor: orange[100],
            height: { xs: 160, sm: 160, md: 230, lg: 230 },
            display: 'flex',
          }}
        >
          <Box
            sx={{
              zIndex: (theme) => theme.zIndex.fab,
              position: 'relative',
              display: 'flex',
              width: 140,
              height: 140,
              pt: { xs: 10, sm: 10, md: 19, lg: 19 },
              pl: { xs: 5, sm: 10, md: 11, lg: 11 },
            }}
          >
            <Box
              sx={{
                width: '100%',
                height: '100%',
                bgcolor: '#fafafa',
                borderRadius: 50,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Avatar
                alt="upload"
                src={dataInfo?.Data.Image}
                sx={{ width: '93%', height: '93%', bgcolor: orange[500] }}
              >
                <Typography fontWeight="bold" fontSize="1.5em">
                  RC
                </Typography>
              </Avatar>
            </Box>
          </Box>
          <Box
            sx={{
              position: 'relative',
              display: 'block',
              mr: 'auto',
              ml: 'auto',
            }}
            pt={{ xs: 22, sm: 22, md: 30, lg: 30 }}
          >
            <Button
              variant="outlined"
              sx={{ borderRadius: 20, textTransform: 'capitalize' }}
              startIcon={<EditIcon />}
              component="label"
              onClick={(e: React.SyntheticEvent) => {
                e.preventDefault;
                setOpenDialog(true);
              }}
            >
              <Typography fontWeight="bold" sx={{ color: grey[800] }}>
                {width && width <= 600 ? 'Edit' : 'edit profile'}
              </Typography>
            </Button>
          </Box>
        </Box>
      </Box>
      <Box
        pl={{ xs: 3, sm: 8, md: 10, lg: 10 }}
        pt={4}
        sx={{
          width: 155,
        }}
      >
        <Box
          pl={4}
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <Typography
            textTransform="capitalize"
            fontFamily="Helvetica Narrow, sans-serif"
          >
            {dataInfo?.Data.Firstname}
          </Typography>
          <Typography
            textTransform="capitalize"
            fontFamily="Helvetica Narrow, sans-serif"
          >
            {dataInfo?.Data.Lastname}
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'center', display: 'flex', gap: 2 }}>
          <Box>
            <Typography fontWeight="bold">{data?.follower || 0}</Typography>
            <Typography
              color="text.secondary"
              sx={{ fontVariant: 'small-caps' }}
            >
              follower
            </Typography>
          </Box>
          <Box>
            <Typography fontWeight="bold">{data?.following || 0}</Typography>
            <Typography
              color="text.secondary"
              sx={{ fontVariant: 'small-caps' }}
            >
              following
            </Typography>
          </Box>
          <Box>
            <Typography fontWeight="bold">{data?.Post.length || 0}</Typography>
            <Typography
              color="text.secondary"
              sx={{ fontVariant: 'small-caps' }}
            >
              posts
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box
        px={{ xs: 0, sm: 1, md: 3, lg: 3 }}
        pt={3}
        sx={{ width: { xs: '100%', sm: '100%', md: '40%', lg: '40%' } }}
      >
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
            sx={{
              '& .MuiTabs-indicator': {
                bgcolor: 'orange',
              },
              '& .MuiTab-root.Mui-selected': {
                color: orange[800],
              },
            }}
          >
            <Tab label="my account" />
            <Tab label="edit account" />
            <Tab label="posts" />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <MyAccount />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <EditAccount />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <UserPosts />
        </TabPanel>
      </Box>
      <Box pt={{ xs: 6, sm: 5, md: 2, lg: 2 }} />
    </div>
  );
};

export default Profile;
