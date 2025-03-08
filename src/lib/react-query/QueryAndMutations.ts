import { INewPost, INewUser, IUpdatePost } from "@/types";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  CreatePost,
  createUserAccount,
  DeletePost,
  deleteSavedPost,
  EditPost,
  FetchInfinitePost,
  getCurrentUser,
  getPostById,
  getRecentPost,
  getUserById,
  likedPost,
  savedPost,
  signInAccount,
  signOutAccount,
} from "../appwrite/api";
import { QUERY_KEYS } from "./queryKey";

// sign and sign out
export const useCreateUserAccount = () => {
  return useMutation({
    mutationFn: (user: INewUser) => createUserAccount(user),
  });
};
export const useSignInAccount = () => {
  return useMutation({
    mutationFn: (user: { email: string; password: string }) =>
      signInAccount(user),
  });
};
export const useSignOutAccount = () => {
  return useMutation({
    mutationFn: () => signOutAccount(),
  });
};

//  for posts
export const useCreatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (post: INewPost) => CreatePost(post),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
    },
  });
};

export const useGetPostById = (id: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_POST_BY_ID, id],
    queryFn: () => getPostById(id),
    enabled: !!id,
  });
};

export const useGetRecentPost = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
    queryFn: getRecentPost,
  });
};
export const useDeletePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ imageId, postId }: { imageId: string; postId: string }) =>
      DeletePost({ imageId, postId }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
    },
  });
};
export const useUpdatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (post: IUpdatePost) => EditPost(post),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id],
      });
    },
  });
};

export const useGetInfinitePost = () => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.GET_INFINITE_POSTS],
    queryFn: FetchInfinitePost,
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage) return undefined;
      const loadedPosts = allPages.flatMap((page) => page?.posts).length;
      return loadedPosts < lastPage.total ? allPages.length : undefined;
    },
  });
};
// post actions
export const useLikePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      postId,
      likedArray,
    }: {
      postId: string;
      likedArray: string[];
    }) => likedPost(postId, likedArray),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
    },
  });
};

export const useSavePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, userId }: { postId: string; userId: string }) =>
      savedPost(postId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
    },
  });
};

export const useDeleteSavedPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (savedRecordId: string) => deleteSavedPost(savedRecordId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
    },
  });
};

// users
export const useGetCurrentUser = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_CURRENT_USER],
    queryFn: getCurrentUser,
  });
};
export const useGetUserById = (id: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER_BY_ID],
    queryFn: () => getUserById(id),
    enabled:!!id
  });
};
