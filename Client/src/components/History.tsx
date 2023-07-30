import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import { Avatar, Typography, IconButton } from "@mui/material";
import grey from "@mui/material/colors/grey";
import red from "@mui/material/colors/red";
import DeleteIcon from "@mui/icons-material/Delete";
import { useRecoilValue } from "recoil";
import uniqueId from "lodash/uniqueId";
import { ClipLoader } from "react-spinners";
import dayjs from "dayjs";
import LocalizedFormat from "dayjs/plugin/localizedFormat";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
// externally crafted imports of ressources
import { IHistoryProps } from "../Interface/GlobalState";
import useHistory from "../hooks/useHistory";
import Context from "../Store/ContextApi";
import { IAuthState } from "../Interface/GlobalState";
import { IGetHistory, IActionPerformer } from "../Interface/History";
import useWindowSize from "../hooks/useWindowSize";
import { IWindow } from "../Interface/student";

const History: React.FC<IHistoryProps> = ({ state, setState }) => {
  dayjs.extend(LocalizedFormat);

  const ContextData = React.useContext(Context);

  const AuthInfo = useRecoilValue<Partial<IAuthState>>(ContextData.GetAuthInfo);

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }

      setState(open);
    };

  const { GetHistory, DeleteHistory, isLoading } = useHistory();
  const data: IGetHistory | undefined = GetHistory();

  const deleteAll = useMutation({
    mutationFn: async () => {
      try {
        const response = await axios.delete(
          "http://localhost:4000/home/histories/deleteall"
        );
        return response.data;
      } catch (error) {
        throw new Error(`${error}`);
      }
    },
  });

  const { width }: IWindow = useWindowSize();

  return (
    <div>
      <React.Fragment>
        <Drawer
          PaperProps={{
            sx: { width: width && width < 700 ? "100%" : 350 },
          }}
          anchor="right"
          open={state}
          onClose={toggleDrawer(false)}
        >
          <Box
            pt={10}
            px={2}
            pb={1}
            sx={{ display: "flex", justifyContent: "space-between" }}
          >
            <Box pt={1}>
              <Typography fontWeight="bold" textTransform="capitalize">
                all histories
              </Typography>
            </Box>
            <Box pt={-4}>
              <Button
                onClick={() => {
                  deleteAll.mutate();
                }}
                variant="text"
                sx={{ textTransform: "lowercase" }}
              >
                {deleteAll.isLoading ? (
                  <ClipLoader
                    color="#fafafa"
                    loading={deleteAll.isLoading}
                    size={12}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                  />
                ) : (
                  "clear"
                )}
              </Button>
            </Box>
          </Box>
          <Divider />
          <Box>
            <List
              sx={{
                width: "100%",
                position: "relative",
                overflow: "auto",
                maxHeight: 500,
                maxWidth: 360,
              }}
            >
              {data?.doc.map((histories) => {
                const { _id, Firstname, Lastname, Image }: IActionPerformer =
                  histories.ActionPerformer;
                return (
                  <ListItem
                    key={uniqueId(`${Firstname}_`)}
                    alignItems="flex-start"
                  >
                    <ListItemAvatar>
                      <Avatar alt={_id} src={Image} />
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            justifyContent: "space-between",
                          }}
                        >
                          <span style={{ marginTop: "5px" }}>
                            {Firstname} {Lastname}
                          </span>
                          {isLoading ? (
                            <ClipLoader
                              color="#fafafa"
                              loading={isLoading}
                              size={12}
                              aria-label="Loading Spinner"
                              data-testid="loader"
                            />
                          ) : (
                            <IconButton
                              onClick={() => {
                                DeleteHistory(
                                  histories._id,
                                  histories.NotiId,
                                  `${AuthInfo.Payload?._id}`
                                );
                              }}
                              sx={{
                                mx: 2,
                                bgcolor: grey[100],
                              }}
                            >
                              <DeleteIcon sx={{ color: red[400] }} />
                            </IconButton>
                          )}
                        </Box>
                      }
                      secondary={
                        <React.Fragment>
                          <Typography
                            sx={{ display: "inline" }}
                            component="span"
                            variant="body2"
                            color="text.primary"
                          >
                            {dayjs(histories.createdAt).format("LLL")}
                          </Typography>
                          {` ${histories.ActionCreator.Status} ${histories.ActionCreator.Firstname} ${histories.ActionCreator.Lastname} ${histories.AlertText} `}
                          <strong>
                            {Firstname} {Lastname}
                          </strong>
                        </React.Fragment>
                      }
                    />
                  </ListItem>
                );
              })}
            </List>
          </Box>
        </Drawer>
      </React.Fragment>
    </div>
  );
};

export default History;
