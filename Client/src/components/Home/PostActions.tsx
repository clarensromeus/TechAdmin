import * as React from "react";
// external imports of ressources
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Button from "@mui/material/Button";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import axios from "axios";
import __ from "lodash";
import { ClipLoader } from "react-spinners";
// internally crafted imports of ressources
import { MenuCard } from "./Menu";
import {
  IPostAction,
  IPostFrameUpdate,
  IShareProps,
} from "../../Interface/Posts";
import PostFrameUpdate from "./PostFrameUpdate";
import Share from "./Share";

interface IDeletePost {
  _id: string;
  Image: string;
}

interface IDeletePostResponse {
  message: string;
  success: boolean;
}

const PostActions: React.FC<IPostAction> = ({
  open,
  handleClose,
  anchorEl,
  setAnchorEl,
  Data: { _id, UserPostId, PostId, Title, Image },
}) => {
  const [openDialog, setOpenDialog] = React.useState(false);
  const [share, setShare] = React.useState<string>("none");
  const [OpenDialogUpdate, setOpenDialogUpdate] =
    React.useState<boolean>(false);
  const theme = useTheme();
  // make dialog responsive
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const handleMenuItemClick = (
    event: React.MouseEvent<HTMLElement>,
    option: string
  ) => {
    setAnchorEl(null);
    const DetectAction = __.isEqual(option, "Delete")
      ? setOpenDialog(true)
      : __.isEqual(option, "Share")
      ? setShare("flex")
      : "";

    return DetectAction;
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleCloseDialogUpdate = () => {
    setOpenDialog(false);
  };

  const PostFrameUpdateData: IPostFrameUpdate = {
    OpenDialogUpdate,
    setOpenDialogUpdate,
    handleCloseDialogUpdate,
    _id,
    PostId,
    Title,
    Image,
  };

  const ShareData: IShareProps = {
    share,
    setShare,
    data: {
      _id,
      UserPostId,
      PostId,
      Title,
      Image,
    },
  };

  const DeletePost: UseMutationResult<IDeletePostResponse, Error, IDeletePost> =
    useMutation<IDeletePostResponse, Error, IDeletePost>({
      mutationFn: async (data: IDeletePost) => {
        return axios.delete(
          `http://localhost:4000/home/post/delete/${data._id}/${data.Image}`
        );
      },
    });

  // listener to delete post
  const DeletePostListener = async () => {
    try {
      DeletePost.mutate({ _id, Image });
    } catch (error) {
      throw new Error(`${error}`);
    }
  };

  return (
    <>
      <Menu id="Post" anchorEl={anchorEl} open={open} onClose={handleClose}>
        {MenuCard.map((value) => (
          <MenuItem
            key={value.Option}
            sx={{ gap: 3 }}
            onClick={(event) => handleMenuItemClick(event, value.Option)}
          >
            {value.Icon}
            {value.Option}
          </MenuItem>
        ))}
      </Menu>
      <PostFrameUpdate {...PostFrameUpdateData} />
      <Share {...ShareData} />
      <Dialog
        fullScreen={fullScreen}
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <DialogContentText>
            Do you really want to delete the post ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="success" autoFocus onClick={handleCloseDialog}>
            Cancel
          </Button>
          <Button
            color="success"
            sx={{
              ":hover": {
                bgcolor: "success",
              },
            }}
            variant="contained"
            onClick={() => DeletePostListener}
            autoFocus
          >
            {DeletePost.isLoading ? (
              <ClipLoader
                color="#fafafa"
                loading={DeletePost.isLoading}
                size={12}
                aria-label="Loading Spinner"
                data-testid="loader"
              />
            ) : (
              "delete"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PostActions;
