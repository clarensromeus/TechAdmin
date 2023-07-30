import * as React from "react";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Checkbox from "@mui/material/Checkbox";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import { useRecoilValue } from "recoil";
import __ from "lodash";
import { ClipLoader } from "react-spinners";
import axios from "axios";
import { nanoid } from "nanoid";
import dayjs from "dayjs";
import LocalizedFormat from "dayjs/plugin/localizedFormat";
import {
  useMutation,
  UseMutationResult,
  useQuery,
  UseQueryResult,
} from "@tanstack/react-query";
// external imports of ressources
import { CssTextField } from "../../MuiStyles/TextFieldStyle";
import { IShareProps, IShare } from "../../Interface/Posts";
import Context from "../../Store/ContextApi";
import { IAuthState } from "../../Interface/GlobalState";
import useNotification from "../../hooks/useNotifications";
import useWindowSize from "../../hooks/useWindowSize";

interface IData<S> {
  doc: {
    _id: number;
    _ID_User: S;
    Firstname: S;
    Lastname: S;
    Email: S;
    Password: S;
    ConfirmPassword: S;
    Image: S;
    SchoolLevel: S;
    Class: S;
    ClassName: S;
  }[];
}

const Share: React.FC<IShareProps> = ({
  share,
  setShare,
  data: { Title, Image },
}) => {
  const ContextData = React.useContext(Context);

  const [checked, setChecked] = React.useState<number[]>([]);
  const AuthInfo = useRecoilValue<Partial<IAuthState>>(ContextData.GetAuthInfo);
  const [search, setSearch] = React.useState<string>("");

  const handleToggle = (value: number) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      // add and check the flexbox if not exist
      newChecked.push(value);
    } else {
      // uncheck it if already exists
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  // it allows to have access to actual date from dayjs
  dayjs.extend(LocalizedFormat);

  const { CreateNotifications } = useNotification();
  const { width }: { width?: number } = useWindowSize();

  const handleChangeEvent = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target as typeof event.target & {
      value: { value: string };
    };
    setSearch(target.value);
  };

  // define debounce method
  const debounceResult = React.useMemo(() => {
    return __.debounce(handleChangeEvent, 1000);
  }, [search]);

  const {
    data,
  }: UseQueryResult<IData<string>, Error> = useQuery<IData<string>, Error>({
    queryKey: ["Share"],
    queryFn: async () => {
      // declare the url
      const Url: string = "http://localhost:4000/home/students/suggestion";
      const response = await axios.get<IData<string>>(Url);
      return response.data;
    },
    retry: 2, // retry twice if query errored out
  });

  const MutationShare: UseMutationResult<IShare, Error, IShare> = useMutation<
    IShare,
    Error,
    IShare
  >({
    mutationFn: async (sharedata: IShare) => {
      const response = axios.post(
        "http://localhost:4000/home/post/share",
        sharedata
      );
      return (await response).data;
    },
  });

  React.useEffect(() => {
    if (MutationShare.status === "success") {
      setShare("none");
    }
  }, [MutationShare.status]);

  React.useEffect(() => {
    // cleanup debounce not to perform searching when search gets unmounted
    return () => {
      debounceResult.cancel();
    };
  }, []);

  return (
    <>
      <Box
        sx={{
          display: share,
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100%",
          bgcolor: "rgba(0,0,0,0.6)",
          position: "fixed",
          top: "0%",
          left: "0%",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Box
          sx={{
            bgcolor: "#fafafa",
            width: width && width <= 700 ? "100%" : 620,
            height: width && width <= 700 ? "100%" : 558,
          }}
        >
          <Box
            p={2}
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ alignSelf: "center", fontSize: "1.3em" }}>
              Share the post with Friends
            </Box>
            <Box pl={20}>
              <IconButton
                onClick={() => {
                  setShare("none");
                }}
              >
                <CloseIcon sx={{ fontSize: 30 }} />
              </IconButton>
            </Box>
          </Box>
          <Divider />
          <Box p={2}>
            <CssTextField
              variant="outlined"
              size="small"
              fullWidth
              placeholder="search a friend..."
              onChange={debounceResult}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          <Box
            p={2}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
              width: "inherit",
            }}
          >
            <Box>
              <Typography color="text.secondary">sugestions</Typography>
            </Box>
            <Box>
              <List
                dense
                sx={{
                  width: "100%",
                  position: "relative",
                  overflow: "auto",
                  maxHeight: 250,
                  maxWidth: width && width <= 700 ? "91%" : 580,
                  bgcolor: "background.paper",
                }}
              >
                {data?.doc
                  .filter((student) =>
                    search.toLowerCase() === ""
                      ? student
                      : student.Firstname.toLowerCase().includes(
                          search.toLowerCase()
                        )
                  )
                  .map((student) => {
                    // const date: string = dayjs(student).format('LL');
                    return (
                      <ListItem
                        key={student._id}
                        divider
                        secondaryAction={
                          <Checkbox
                            edge="end"
                            onChange={handleToggle(student._id)}
                            checked={checked.indexOf(student._id) !== -1}
                          />
                        }
                        disablePadding
                      >
                        <ListItemAvatar>
                          <Avatar alt={student.Firstname} src={student.Image} />
                        </ListItemAvatar>
                        <ListItemText
                          id={`${student._id}`}
                          primary={
                            <Typography fontWeight="bold">
                              {student.Firstname} {student.Lastname}
                            </Typography>
                          }
                          secondary={student.Email}
                        />
                      </ListItem>
                    );
                  })}
              </List>
            </Box>
          </Box>
          <Box p={1} />
          <Divider />
          <Box
            py={2}
            px={{ xs: 1, sm: 2, md: 2, lg: 2 }}
            sx={{ width: width && width <= 700 ? "95%" : 590 }}
          >
            <Button
              variant="contained"
              fullWidth
              disabled={__.isEmpty(checked) && true}
              onClick={async () => {
                try {
                  await MutationShare.mutate({
                    _id: checked,
                    Identifier: `share${nanoid()}`,
                    ChatId: `${nanoid()}`,
                    PicturedMessage: Image,
                    Message: Title,
                    Sender: `${AuthInfo.Payload?._id}`,
                    User: `${AuthInfo.Payload?._id}`,
                  });

                  await CreateNotifications({
                    _id: checked,
                    ReceiverId: `multi${nanoid()}`,
                    NotiId: `${nanoid()}`,
                    Sender: `${AuthInfo.Payload?._id}`,
                    SendingStatus: false,
                    NotiReference: "shares",
                    AlertText: Title,
                    User: `${AuthInfo.Payload?._id}`,
                  });
                } catch (error) {
                  throw new Error(`${error}`);
                }
              }}
            >
              {MutationShare.isLoading ? (
                <ClipLoader
                  color="#fafafa"
                  loading={MutationShare.isLoading}
                  size={12}
                  aria-label="Loading Spinner"
                  data-testid="loader"
                />
              ) : (
                "share"
              )}
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Share;
