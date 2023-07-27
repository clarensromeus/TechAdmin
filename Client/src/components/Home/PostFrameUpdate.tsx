import * as React from 'react';
import Box from '@mui/material/Box';
import {
  Typography,
  IconButton,
  TextareaAutosize,
  Button,
} from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PhotoSizeSelectActualIcon from '@mui/icons-material/PhotoSizeSelectActual';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import green from '@mui/material/colors/green';
import blue from '@mui/material/colors/blue';
import grey from '@mui/material/colors/grey';
import { useNavigate } from 'react-router-dom';
import { nanoid } from 'nanoid';
import axios from 'axios';
import { useMutation } from '@tanstack/react-query';
import __ from 'lodash';
// external imports of ressources
import { SearchTextField } from '../../MuiStyles/Auth';
import { IPostFrameUpdate } from '../../Interface/Posts';

interface IUpdatePostResponse {
  message: string;
  success: boolean;
}

const PostFrameUpdate: React.FC<IPostFrameUpdate> = ({
  OpenDialogUpdate,
  handleCloseDialogUpdate,
  setOpenDialogUpdate,
  _id,
  PostId,
  Title,
  Image
}) => {
  const [file, setFile] = React.useState<any>();
  const [PreviewImage, setPreviewImage] = React.useState<any>();
  const [title, setTitle] = React.useState<string>('');

  const navigate = useNavigate();

  const handleChangeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target as typeof event.target & {
      value: { value: string };
    };
    const { value } = target;
    setTitle(value);
  };

  const changeFileHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // move forward if file exists
    if (e.target.files) {
      const getFile = e.target.files[0];
      setFile(getFile);
    }
  };

  // mime type is all extensions that the file should take
  const imageMimeType: RegExp = /image\/(png|jpg|jpeg)/i;

  const handlePreviewFile = () => {
    const fileReader = new FileReader();
    if (!file.type.match(imageMimeType)) {
      // console.log('select a good image');
    }
    fileReader.onload = (event) => {
      const result = event.target?.result;
      setPreviewImage(result);
    };

    fileReader.readAsDataURL(file);
  };

  // if file already choosen cache it
  const getFile = React.useMemo(() => {
    return {
      PreviewImage,
    };
  }, [PreviewImage]);

  const UpdatePost = useMutation<IUpdatePostResponse, Error, any>({
    mutationFn: async (data: any) => {
      return axios.patch('http://localhost:4000/home/post/update', data);
    },
  });

  React.useEffect(() => {
    if (file) {
      handlePreviewFile();
    }
  }, [file, getFile.PreviewImage]);
  return (
    <>
      <Dialog
        open={OpenDialogUpdate}
        onClose={handleCloseDialogUpdate}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <form
          onSubmit={async (e: React.FormEvent<HTMLFormElement>) => {
            try {
              // prevent default action
              e.preventDefault();
              const formData = new FormData();

              await formData.append('file', file);
              await formData.append('PostId', `${nanoid()}`);
            } catch (error) {
              throw new Error(`${error}`);
            }
          }}
        >
          <DialogTitle
            sx={{
              display: 'flex',
              flexDirection: 'column',
              fontSize: '1.5em',
              color: 'text.secondary',
            }}
          >
            <Box>
              <IconButton onClick={handleCloseDialogUpdate}>
                <ArrowForwardIcon sx={{ color: 'black' }} />
              </IconButton>
            </Box>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <Typography fontSize="1em">Pick, add a post...</Typography>
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
                <PhotoSizeSelectActualIcon />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent
            sx={{
              width: 450,
              height: 270,
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
            }}
          >
            {__.isUndefined(getFile.PreviewImage) && (
              <TextareaAutosize
                minRows={16}
                aria-label="maximum height"
                placeholder="what's in your mind..."
                color="success"
                style={{
                  width: 437,
                  borderColor: grey[400],
                }}
              />
            )}

            {getFile.PreviewImage && (
              <Box>
                <Box sx={{ width: 437 }}>
                  <SearchTextField
                    name="title"
                    value={title}
                    onChange={handleChangeTitle}
                    fullWidth
                    placeholder="add a title.."
                  />
                </Box>
                <Box pt={1}>
                  <img
                    style={{ width: 437, height: 300 }}
                    alt={file && file?.name}
                    src={getFile.PreviewImage && getFile.PreviewImage}
                  />
                </Box>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Box pr={2} sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
              <Button
                variant="outlined"
                onClick={() => {
                  navigate('posts');
                  setOpenDialogUpdate(false);
                }}
                sx={{
                  color: blue[800],
                  borderRadius: 40,
                }}
              >
                <RemoveRedEyeIcon sx={{ color: blue[800] }} />
                view
              </Button>
              <Button
                variant="contained"
                type="submit"
                sx={{
                  bgcolor: green[800],
                  ':hover': { bgcolor: green[700] },
                  borderRadius: 40,
                }}
              >
                Update
              </Button>
            </Box>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default PostFrameUpdate;
