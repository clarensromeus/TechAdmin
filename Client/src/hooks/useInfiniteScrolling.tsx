import * as React from 'react';
import usePost from './usePost';

interface IScroll<T> {
  scrollHeight: T;
  scrollTop: T;
  clientHeight: T;
}

const InfiniteScrolling = () => {
  const { GetPosts } = usePost();
  const {
    fetchNextPage,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    PostData,
  } = GetPosts();

  // for not re-rendering if no more value is left to load while scrolling
  let fetching: boolean = false;

  const handleScrollEvent = React.useMemo(() => {
    const handleScroll = async (e: any) => {
      // scrolltop is partial window scrolling position
      // scrollHeight, the entire document height
      // clientHeight is  the opening browser window height
      const { scrollHeight, scrollTop, clientHeight }: IScroll<any> =
        e.target.scrollingElement;
      if (!fetching && scrollHeight - scrollTop <= clientHeight * 1.2) {
        fetching = true;
        if (hasNextPage) await fetchNextPage();
        fetching = false;
      }
    };

    return handleScroll;
  }, [fetching]);

  React.useEffect(() => {
    document.addEventListener('scroll', handleScrollEvent);
    return () => {
      document.removeEventListener('scroll', handleScrollEvent);
    };
  }, [fetchNextPage, hasNextPage]);

  return {
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    PostData,
    fetchNextPage,
  };
};

export default InfiniteScrolling;
