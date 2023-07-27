import {
  useInfiniteQuery,
  useMutation,
  UseMutationResult,
  QueryClient,
  useQueryClient,
} from '@tanstack/react-query';
import axios from 'axios';
// external imports of ressources
import { IPost } from '../Interface/Posts';
import { IResponse } from '../Interface/Home';

const usePost = () => {
  const queryClient: QueryClient = useQueryClient();

  const LoadMorePosts = async ({ pageParam = '' }) => {
    const res = await axios.get(
      `http://localhost:4000/home/posts?limit=3&cursor=${pageParam}`
    );
    return res.data;
  };

  // function for creating a post
  const Mutation: UseMutationResult<IResponse, Error, any> = useMutation<
    IResponse,
    Error,
    any
  >({
    mutationFn: async (Data: any) => {
      const res = await axios.post(
        'http://localhost:4000/home/posts/upload',
        Data,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return res.data;
    },
    onSuccess: () => {
      // refetch and invalidate query to have fresh data after a post creation
      queryClient.invalidateQueries({
        queryKey: ['Posts'],
      });
    },
  });

  const {
    data: PostData,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery<IPost, Error>({
    queryKey: ['Posts'],
    queryFn: LoadMorePosts,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    refetchOnMount: true,
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,
  });

  const CreatePost = async (data: any) => {
    try {
      await Mutation.mutate(data);
    } catch (error) {
      throw new Error(`${error}`);
    }
  };

  const GetPosts = () => {
    return {
      PostData,
      fetchNextPage,
      hasNextPage,
      isFetchingNextPage,
      isFetching,
    };
  };

  return {
    GetPosts,
    CreatePost,
    isLoading: Mutation.isLoading,
    isSuccess: Mutation.isSuccess,
  };
};

export default usePost;
