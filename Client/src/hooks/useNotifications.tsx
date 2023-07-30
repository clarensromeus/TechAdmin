// extenal imports of ressources
import {
  useQuery,
  UseQueryResult,
  useMutation,
  UseMutationResult,
} from "@tanstack/react-query";
import axios from "axios";
import __ from "lodash";
import { decodeToken } from "react-jwt";
// internally crafted imports of ressources
import {
  INotifications,
  IGetNotifications,
  IDelete,
} from "../Interface/Notifications";
import isAuthenticated from "../utils/isAuthenticated";

const useNotification = () => {
  const isAuth: boolean = isAuthenticated();
  const tokenInfo: any = decodeToken(
    `${window.localStorage.getItem("TOKEN") || ""}`
  );
  // create Mutation
  const Notifications: UseMutationResult<
    INotifications,
    Error,
    INotifications
  > = useMutation<INotifications, Error, INotifications>({
    mutationFn: async (NotiData: INotifications) => {
      try {
        const url: string = "http://localhost:4000/home/student/Notifications";
        const res = await axios.post(url, NotiData);
        return res.data;
      } catch (error) {
        throw new Error(`${error}`);
      }
    },
  });

  // deleting mutation
  const deleteNotifications: UseMutationResult<IDelete, Error, IDelete> =
    useMutation<IDelete, Error, IDelete>({
      mutationFn: async (data: IDelete) => {
        const url: string = `http://localhost:4000/home/Notifications/student/${data._id}/${data.NotiId}/${data.SenderId}`;
        const res = await axios.delete(url);
        return res.data;
      },
    });

  // retrieving notifications
  const { data }: UseQueryResult<IGetNotifications, Error> = useQuery<
    IGetNotifications,
    Error
  >({
    queryKey: ["Notifications"],
    queryFn: async () => {
      // get user token first before notifications
      const Url: string = `http://localhost:4000/home/students/getNotifications/${tokenInfo._id}`;

      const res = await axios.get(Url);
      return res.data;
    },
    enabled: isAuth && __.isEqual(tokenInfo.PersonStatus, "Student"),
    // refetch query after every 1 second
    refetchInterval: 1000,
    // refetch query in background mode
    refetchIntervalInBackground: true,
  });

  // helper function to retrieve notifications
  const GetNotifications = () => {
    return data?.doc;
  };

  // helper function to create Notifications
  const CreateNotifications = async ({
    _id,
    ReceiverId, // Notification receiver Id
    ActionPerformer, // admin notification performer, if receiver is not a student
    NotiId,
    Sender, // Notification Sender id
    SendingStatus, // a boolean detects whether or not Notification is sent to the Receiver
    NotiReference, // Notification Reference
    AlertText, // Notification message
    User,
  }: INotifications) => {
    try {
      // pushing Notifications
      await Notifications.mutate({
        _id,
        ReceiverId,
        ActionPerformer,
        NotiId,
        Sender,
        SendingStatus,
        NotiReference,
        AlertText,
        User,
      });
    } catch (error) {
      throw new Error(`${error}`);
    }
  };

  // helper function to delete Notifications
  const DeleteNotifications = async ({ _id, NotiId, SenderId }: IDelete) => {
    try {
      await deleteNotifications.mutate({ _id, NotiId, SenderId });
    } catch (error) {
      throw new Error(`${error}`);
    }
  };

  return {
    CreateNotifications,
    DeleteNotifications,
    GetNotifications,
  };
};

export default useNotification;
