import * as React from "react";
// external imports of ressources
import {
  useMutation,
  useQueryClient,
  QueryClient,
} from "@tanstack/react-query";
import axios from "axios";
import { nanoid } from "nanoid";
import { produce } from "immer";
import { useRecoilValue } from "recoil";
// externally crafted imports of ressources
import { CommentTextField } from "../../MuiStyles/TextFieldStyle";
import useNotification from "../../hooks/useNotifications";
import { IComment, IPost } from "../../Interface/Posts";
import { ShortCommentProps } from "../../Interface/Posts";
import { IAuthState } from "../../Interface/GlobalState";
import Context from "../../Store/ContextApi";

const UserShortComment: React.FC<ShortCommentProps["info"]> = ({
  PostInfo: { Post, PostId, Identifier, User, ReceiverId, Title },
}) => {
  const ContextData = React.useContext(Context);

  const [value, setValue] = React.useState<string>("");

  const AuthInfo = useRecoilValue<Partial<IAuthState>>(ContextData.GetAuthInfo);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target as typeof event.target & {
      value: { value: string };
    };
    setValue(target.value);
  };

  const { CreateNotifications } = useNotification();
  const queryClient: QueryClient = useQueryClient();

  const ShortCommentMutation = useMutation({
    mutationFn: async (comment: IComment) => {
      const response = await axios.post(
        "http://localhost:4000/home/posts/comments",
        comment
      );
      return response.data;
    },
    onMutate: async (newComment: IComment) => {
      // cancel any outgoing query, so that they don't overwrite our optimistic update
      queryClient.cancelQueries({ queryKey: ["UserPosts"] });

      // snapshot the previous value
      const previousPosts = queryClient.getQueryData(["UserPosts"]);

      const updateComments = produce(previousPosts, (draftData: IPost) => {
        draftData.doc.map((posts) => {
          if (posts.PostId.includes(PostId)) {
            posts.Comments.push({
              createdAt: `${new Date()}`,
              PostId: newComment.PostId,
              Identifier: newComment.Identifier,
              Body: `${newComment.Body}`,
              User: {
                _id: `${AuthInfo.Payload?._id}`,
                Firstname: `${AuthInfo.Payload?.Firstname}`,
                Lastname: `${AuthInfo.Payload?.Lastname}`,
                Image: `${AuthInfo.Payload?.Image}`,
              },
            });
          }
        });
      });

      // optimistically update the query
      queryClient.setQueryData(["UserPosts"], updateComments);

      return { previousPosts };
    },
    // If the mutation fails,
    // use the context returned from onMutate to roll back
    onError: (err, newTodo, context) => {
      queryClient.setQueryData(["UserPosts"], context?.previousPosts);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["UserPosts"] });
    },
  });

  return (
    <>
      <form
        onSubmit={async (event: React.FormEvent<HTMLFormElement>) => {
          try {
            event.preventDefault();
            // add a new comment
            await ShortCommentMutation.mutate({
              PostId,
              Identifier,
              Body: value,
              User,
              Post,
            });
            // send new notification
            await CreateNotifications({
              ReceiverId: `${ReceiverId}`,
              NotiId: `${nanoid()}`,
              Sender: Identifier,
              SendingStatus: false,
              NotiReference: "comments",
              AlertText: `${Title}`,
              User: Identifier,
            });
            // reset the textfield value
            setValue("");
          } catch (error) {
            throw new Error(`${error}`);
          }
        }}
      >
        <CommentTextField
          value={value}
          onChange={handleChange}
          fullWidth
          size="small"
          placeholder="write a comment..."
        />
      </form>
    </>
  );
};

export default UserShortComment;
