import * as React from "react";
import { Box } from "@mui/material";
import Grid from "@mui/material/Grid";
import FormLabel from "@mui/material/FormLabel";
import grey from "@mui/material/colors/grey";
import { useRecoilValue } from "recoil";
// external imports of ressources
import { IAuthState } from "../../Interface/GlobalState";
import Context from "../../Store/ContextApi";

const Myaccount: React.FC = () => {
  const ContextData = React.useContext(Context);

  const AuthInfo = useRecoilValue<Partial<IAuthState>>(ContextData.GetAuthInfo);

  return (
    <>
      <Box p={2}>
        <Grid
          container
          display="flex"
          flexDirection="column"
          spacing={2}
        >
          <Grid item container xs={10}>
            <Grid item xs={5}>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <FormLabel
                  sx={{ textTransform: "uppercase", color: grey[800] }}
                >
                  firstname
                </FormLabel>
                <FormLabel
                  sx={{ color: "text.secondary", textTransform: "capitalize" }}
                >
                  {AuthInfo.Payload?.Firstname}
                </FormLabel>
              </Box>
            </Grid>
            <Grid item xs={5}>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <FormLabel
                  sx={{ textTransform: "uppercase", color: grey[800] }}
                >
                  Lastname
                </FormLabel>
                <FormLabel
                  sx={{ color: "text.secondary", textTransform: "capitalize" }}
                >
                  {AuthInfo.Payload?.Lastname}
                </FormLabel>
              </Box>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <FormLabel sx={{ textTransform: "uppercase", color: grey[800] }}>
                email
              </FormLabel>
              <FormLabel
                sx={{ color: "text.secondary", textTransform: "capitalize" }}
              >
                {AuthInfo.Payload?.Email}
              </FormLabel>
            </Box>
          </Grid>
          <Grid item xs={10}>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <FormLabel sx={{ textTransform: "uppercase", color: grey[800] }}>
                password
              </FormLabel>
              <FormLabel sx={{ color: "text.secondary" }}>
                ***********
              </FormLabel>
            </Box>
          </Grid>
          <Grid item xs={10}>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <FormLabel sx={{ textTransform: "uppercase", color: grey[800] }}>
                username
              </FormLabel>
              <FormLabel
                sx={{ color: "text.secondary", textTransform: "capitalize" }}
              >
                {AuthInfo.Payload?.Firstname?.toLowerCase()}
                {AuthInfo.Payload?.Lastname?.toLowerCase()}
              </FormLabel>
            </Box>
          </Grid>
          <Grid item xs={10}>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <FormLabel sx={{ textTransform: "uppercase", color: grey[800] }}>
                statuslevel
              </FormLabel>
              <FormLabel
                sx={{ color: "text.secondary", textTransform: "capitalize" }}
              >
                {AuthInfo.status}
              </FormLabel>
            </Box>
          </Grid>
          <Grid item xs={10}>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <FormLabel sx={{ textTransform: "uppercase", color: grey[800] }}>
                date of birth
              </FormLabel>
              <FormLabel
                sx={{ color: "text.secondary", textTransform: "capitalize" }}
              >
                29/01/1998
              </FormLabel>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default Myaccount;
