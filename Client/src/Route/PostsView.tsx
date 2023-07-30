import * as React from "react";
// external imports  of ressources
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { useRecoilValue } from "recoil";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
// internally crafted imports of ressources
import Postcard from "../components/Home/PostCard";
import StudentsSugestion from "../components/StudentsSugestion";
import { IAuthState } from "../Interface/GlobalState";
import Context from "../Store/ContextApi";
import useWindowSize from "../hooks/useWindowSize";
import { PostTextField } from "../MuiStyles/TextFieldStyle";
import { IPostCard } from "../Interface/Posts";

const PostsView: React.FC = () => {
  const ContextData = React.useContext(Context);

  const { width }: { width?: number } = useWindowSize();

  const AuthInfo = useRecoilValue<Partial<IAuthState>>(ContextData.GetAuthInfo);

  const state: IPostCard = {
    _id: `${AuthInfo.Payload?._id}`,
    Firstname: `${AuthInfo.Payload?.Firstname}`,
    Lastname: `${AuthInfo.Payload?.Lastname}`,
  };

  return (
    <div>
      <Box p={{ sm: 1, md: 1, lg: 1 }} pl={width && width <= 700 ? 0 : 3}>
        {width && width > 700 && (
          <Typography>Drop what is on your mind...</Typography>
        )}
      </Box>
      {width && width <= 700 && (
        <>
          <Paper sx={{ width: "100%" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mx: 2,
                py: 2,
                gap: 1,
                width: "95%",
              }}
            >
              <Box>
                <Avatar
                  alt={`${AuthInfo.Payload?.Image}`}
                  src={`${AuthInfo.Payload?.Image}`}
                />
              </Box>
              <Box sx={{ width: "inherit" }}>
                <PostTextField
                  size="small"
                  variant="outlined"
                  fullWidth
                  placeholder="what's on your mind..."
                />
              </Box>
              <Box>
                <IconButton>
                  <CameraAltIcon color="success" sx={{}} />
                </IconButton>
              </Box>
            </Box>
          </Paper>
        </>
      )}
      <Grid container spacing={{ xs: 2, sm: 2, md: 6, lg: 6 }}>
        <Grid item xs={12} sm={12} md={6} lg={6}>
          <Box pl={{ md: 5, lg: 5, bgcolor: "blue" }}>
            <Postcard {...state} />
          </Box>
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={6}>
          <Box
            sx={{
              position: "sticky",
              top: "80px",
            }}
          >
            <StudentsSugestion />
          </Box>
        </Grid>
      </Grid>
    </div>
  );
};

export default PostsView;
