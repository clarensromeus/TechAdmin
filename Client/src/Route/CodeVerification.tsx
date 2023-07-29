// internal imports of sources
import * as React from "react";
// external imports of sources
import { Box, Typography } from "@mui/material";
import FormLabel from "@mui/material/FormLabel";
import grey from "@mui/material/colors/grey";
import AuthCode from "react-auth-code-input";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import {
  useNavigate,
  NavigateFunction,
  Location,
  useLocation,
} from "react-router-dom";
import axios from "axios";
import __ from "lodash";
import { PulseLoader } from "react-spinners";
// external imports of ressources
import { DataInfo } from "../Interface/Register";
import { isCodeValid } from "../components/StateFromLocation";

type IResponse = {
  token: string;
  success: boolean;
};

type ICode<N> = {
  code: N;
  expiry: N;
};

type Iauth = {
  Firstname: string;
  Lastname: string;
  Email: string;
  Image: string;
};

type IRecover = {
  Email: string;
  Password: string;
};

type IRecoverResponse = {
  token: string;
};

const CodeVerification: React.FC = () => {
  const [result, setResult] = React.useState<string>();

  const handleOnChange = (res: string) => {
    setResult(res);
  };

  const navigate: NavigateFunction = useNavigate();
  const location: Location = useLocation();

  const Mutation: UseMutationResult<IResponse, Error, DataInfo> = useMutation<
    IResponse,
    Error,
    DataInfo
  >({
    mutationFn: async (Data: DataInfo) => {
      const status: string = "student";
      // declare the url
      const Url: string = `http://localhost:4000/register/${status}`;
      const response = await axios.post<IResponse>(Url, Data, {
        headers: { "Content-type": "application/json" },
      });
      return response.data;
    },
    onSuccess: (DataResponse: IResponse) => {
      navigate("/home/dashboard", { replace: true });
      window.localStorage.setItem("TOKEN", JSON.stringify(DataResponse.token));
    },
    retry: 1, // retry only once if mutation errored out
    retryDelay: 200, // retry after 200 hundreds miliseconds
  });

  const RecoverPassword = useMutation<IRecoverResponse, Error, IRecover>({
    mutationFn: async (recoverData: IRecover) => {
      try {
        const response = await axios.patch(
          "http://localhost:4000/recoverpassword",
          recoverData
        );
        return response.data;
      } catch (error) {
        throw new Error(`${error}`);
      }
    },
    onSuccess: (responseData: IRecoverResponse) => {
      window.localStorage.setItem("TOKEN", JSON.stringify(responseData.token));
      navigate("/home/dashboard");
    },
  });

  const UserVerification = React.useCallback(
    (userAuth: Iauth, isCodeExist: string | null) => {
      if (result?.length === 5) {
        const codeInfo: ICode<number> = JSON.parse(`${isCodeExist}`);
        if (
          new Date().getTime() < codeInfo.expiry &&
          __.isEqual(codeInfo.code, result) &&
          isCodeValid(location.state) &&
          __.isEqual(location.state.status, "createPass")
        ) {
          Mutation.mutate({
            Firstname: userAuth.Firstname,
            Lastname: userAuth.Lastname,
            Email: userAuth.Email,
            Username: `${userAuth.Firstname}${userAuth.Lastname}`,
            Password: location.state.passCode,
            ConfirmPassword: location.state.passCode,
            Image: userAuth.Image,
            Class: "3nd grade",
            SchoolLevel: "Secondary",
            Classname: "Jhon Peterburg",
          });
        } else {
          RecoverPassword.mutate({
            Email: userAuth.Email,
            Password: location.state.passCode,
          });
        }
      }
    },
    []
  );

  React.useEffect(() => {
    const isCodeExist: string | null =
      window.localStorage.getItem("CodeFromEmail");
    // get user data which stored in after trying to authenticate with google, facebook or github
    const userAuth: Iauth = JSON.parse(
      `${window.localStorage.getItem("USER_AUTH")}`
    );

    // call the verification listener
    UserVerification(userAuth, isCodeExist);
  }, [result]);

  return (
    <>
      <Box
        display="flex"
        justifyContent="center"
        flexDirection="column"
        alignItems="center"
        textAlign="center"
        pt={10}
      >
        <Box>
          <Typography
            fontWeight="bold"
            fontFamily="Courier New Monospace"
            fontSize={{ xs: "1em", sm: "1.4em", xl: "1.6em" }}
            sx={{ color: grey[900], lineHeight: (theme) => theme.spacing(3) }}
          >
            we send a verification code to your email
          </Typography>
        </Box>
        <Box pt={1}>
          <Box
            display="flex"
            flexDirection="column"
            sx={{
              width: "300px",
              "& .phoneinput": {
                width: 36,
                height: 50,
                mx: 1,
                fontSize: "1em",
                textAlign: "center",
              },
            }}
          >
            <Box>
              <FormLabel sx={{ textAlign: "center" }}>
                <Typography
                  sx={{
                    fontSize: "0.9rem",
                    color: `${grey[700]}`,
                    textTransform: "capitalize",
                  }}
                >
                  enter the verification code
                </Typography>
              </FormLabel>
              <AuthCode
                inputClassName="phoneinput"
                length={5}
                allowedCharacters="numeric"
                onChange={handleOnChange}
              />
            </Box>
            {Mutation.isLoading ||
              (RecoverPassword.isLoading && (
                <Box pt={1} sx={{ alignSelf: "center" }}>
                  <PulseLoader
                    color="#2196f3"
                    loading={Mutation.isLoading || RecoverPassword.isLoading}
                    size={10}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                  />
                </Box>
              ))}
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default CodeVerification;
