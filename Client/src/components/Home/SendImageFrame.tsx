import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import IconButton from '@mui/material/IconButton';
import blueGrey from '@mui/material/colors/blueGrey';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { ClipLoader } from 'react-spinners';
import { nanoid } from 'nanoid';
import axios from 'axios';
// internally crafted imports of ressources
import { ISendImageFrameProps } from '../../Interface/Chat';
import useNotification from '../../hooks/useNotifications';

interface ISendPicturedImageResponse {
  message: string;
  success: boolean;
}

const SendImageFrame: React.FC<ISendImageFrameProps> = ({
  state,
  setState,
  PreviewImage,
  imageType,
  file,
  Sender,
  _id,
}) => {
  const SendPicturedMessage: UseMutationResult<
    ISendPicturedImageResponse,
    Error,
    any
  > = useMutation<ISendPicturedImageResponse, Error, any>({
    mutationFn: async (data: any) => {
      const res = await axios.patch(
        'http://localhost:4000/home/chat/sendImage',
        data
      );

      return res.data;
    },
  });

  const { CreateNotifications } = useNotification();

  React.useEffect(() => {
    if (SendPicturedMessage.status === 'success') {
      setState('none');
    }
  }, [SendPicturedMessage.status]);

  return (
    <>
      <Box
        sx={{
          display: state,
          justifyContent: 'center',
          alignItems: 'center',
          position: 'fixed',
          bgcolor: 'rgba(0,0,0,0.6)',
          top: '0%',
          left: '0%',
          width: '100%',
          height: '100%',
          zIndex: (theme) => theme.zIndex.drawer + 1, // make it appear on top of all other elements
        }}
      >
        <Box
          sx={{
            width: 600,
            height: 500,
            bgcolor: '#fafafa',
            justifyContent: 'center',
          }}
        >
          <form
            onSubmit={async (event: React.FormEvent<HTMLFormElement>) => {
              try {
                event.preventDefault();
                if (typeof file === 'undefined') return;

                const formData = new FormData();
                await formData.append('Identifier', _id);
                await formData.append('ChatId', `${nanoid()}`);
                await formData.append('file', file);
                await formData.append('Sender', Sender);
                await formData.append('User', Sender);

                await SendPicturedMessage.mutate(formData);
                // sending Notification
                await CreateNotifications({
                  ReceiverId: _id,
                  NotiId: `${nanoid()}`,
                  Sender,
                  SendingStatus: false,
                  NotiReference: 'messaged',
                  AlertText: 'Picture',
                  User: Sender,
                });
              } catch (error) {
                throw new Error(`${error}`);
              }
            }}
          >
            <Box sx={{ bgcolor: blueGrey[100] }}>
              <IconButton
                onClick={() => {
                  setState('none');
                }}
              >
                <ArrowBackIcon sx={{ fonSize: '1.3em', color: 'black' }} />
              </IconButton>
            </Box>
            <Box
              pt={5}
              sx={{
                width: 'inherit',
                height: 'inherit',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 3,
              }}
            >
              <Box
                sx={{
                  height: 320,
                  width: 370,
                  border: '1px solid grey',
                  alignText: 'center',
                }}
              >
                <img
                  style={{ width: 'inherit', height: 'inherit' }}
                  alt="PicturedMessage"
                  src={PreviewImage}
                />
              </Box>
              <Box>
                <Button
                  endIcon={<SendIcon />}
                  variant="contained"
                  type="submit"
                >
                  {SendPicturedMessage.isLoading ? (
                    <ClipLoader
                      color="#fafafa"
                      loading={SendPicturedMessage.isLoading}
                      size={12}
                      aria-label="Loading Spinner"
                      data-testid="loader"
                    />
                  ) : (
                    'send'
                  )}
                </Button>
              </Box>
            </Box>
          </form>
        </Box>
      </Box>
    </>
  );
};

export default SendImageFrame;
