import * as React from "react";
import Box from "@mui/material/Box";
import {
  Typography,
  IconButton,
  TextareaAutosize,
  Button,
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import PhotoSizeSelectActualIcon from "@mui/icons-material/PhotoSizeSelectActual";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import green from "@mui/material/colors/green";
import blue from "@mui/material/colors/blue";
import grey from "@mui/material/colors/grey";
import { useNavigate, NavigateFunction } from "react-router-dom";
import { nanoid } from "nanoid";
import { ClipLoader } from "react-spinners";
import __ from "lodash";
// external imports of ressources
import usePost from "../../hooks/usePost";
import { SearchTextField } from "../../MuiStyles/TextFieldStyle";
import { IPostFrame } from "../../Interface/Posts";
import useWindowSize from "../../hooks/useWindowSize";
import UploadFile from "./UploadFile";

const PostFrame: React.FC<IPostFrame> = ({
  OpenDialog,
  handleCloseDialog,
  setOpenDialog,
  UserId,
}) => {
  const [file, setFile] = React.useState<any>();
  const [title, setTitle] = React.useState<string>("");

  const navigate: NavigateFunction = useNavigate();

  // hook for post creation
  const { CreatePost, isLoading, isSuccess } = usePost();

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

  const { width }: { width?: number } = useWindowSize();
  const { PreviewImage } = UploadFile({ file });

  React.useEffect(() => {
    if (isSuccess) {
      setOpenDialog(false);
    }
  }, [isSuccess]);
  return (
    <>
      <Dialog
        open={OpenDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <form
          onSubmit={async (e: React.FormEvent<HTMLFormElement>) => {
            try {
              // prevent default action
              e.preventDefault();
              const formData = new FormData();

              await formData.append("file", file);
              await formData.append("PostId", `${nanoid()}`);
              await formData.append("Title", title);
              await formData.append("User", UserId);
              await formData.append("MakerId", UserId);

              await CreatePost(formData);
              setTitle("");
            } catch (error) {
              throw new Error(`${error}`);
            }
          }}
        >
          <DialogTitle
            sx={{
              display: "flex",
              flexDirection: "column",
              fontSize: "1.5em",
              color: "text.secondary",
            }}
          >
            <Box>
              <IconButton onClick={handleCloseDialog}>
                <ArrowForwardIcon sx={{ color: "black" }} />
              </IconButton>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
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
            style={{ overflowY: "clip" }}
            sx={{
              width: 457,
              height: 270,
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "flex-start",
            }}
          >
            {__.isUndefined(PreviewImage) && (
              <TextareaAutosize
                minRows={16}
                aria-label="maximum height"
                placeholder="what's in your mind..."
                color="success"
                value={title}
                onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
                  const target = event.target as typeof event.target & {
                    value: { value: string };
                  };

                  setTitle(target.value);
                }}
                style={{
                  width: 437,
                  borderColor: grey[400],
                }}
              />
            )}

            {PreviewImage && (
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
                    src={PreviewImage && PreviewImage}
                  />
                </Box>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Box pr={2} sx={{ display: "flex", flexDirection: "row", gap: 1 }}>
              <Button
                variant="outlined"
                onClick={() => {
                  navigate("posts");
                  setOpenDialog(false);
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
                  ":hover": { bgcolor: green[700] },
                  borderRadius: 40,
                }}
              >
                {isLoading ? (
                  <ClipLoader
                    color="#fafafa"
                    loading={isLoading}
                    size={12}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                  />
                ) : (
                  "post"
                )}
              </Button>
            </Box>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default PostFrame;
