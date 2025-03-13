import { INewPost, INewUser, IUpdatePost, IUpdateUser } from "@/types";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  AllSavedPosts,
  CreatePost,
  createUserAccount,
  DeletePost,
  deleteSavedPost,
  EditPost,
  FetchAllUsers,
  FetchInfinitePost,
  FollowUser,
  getCurrentUser,
  getFollowerList,
  getFollowingList,
  getPostById,
  getRecentPost,
  GetSearchPost,
  GetSearchUser,
  getUserById,
  likedPost,
  removeFollower,
  savedPost,
  signInAccount,
  signOutAccount,
  UnFollowUser,
  UpdateUserProfile,
} from "../appwrite/api";
import { QUERY_KEYS } from "./queryKey";

// Sign up & Sign in/Sign out
export const useCreateUserAccount = () => {
  return useMutation({
    mutationFn: (user: INewUser) => createUserAccount(user),
  });
};

export const useSignInAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (user: { email: string; password: string }) => signInAccount(user),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_CURRENT_USER] });
    },
  });
};

export const useSignOutAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => signOutAccount(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_CURRENT_USER] });
    },
  });
};

// Posts
export const useCreatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (post: INewPost) => CreatePost(post),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_RECENT_POSTS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_INFINITE_POSTS] });
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
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_RECENT_POSTS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_ALL_SAVED_POSTS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_INFINITE_POSTS] });
    },
  });
};

export const useUpdatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (post: IUpdatePost) => EditPost(post),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id] });
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

// Post Actions
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
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_RECENT_POSTS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_POSTS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_CURRENT_USER] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_USER_BY_ID] });
    },
  });
};

export const useSavePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ postId, userId }: { postId: string; userId: string }) =>
      savedPost(postId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_RECENT_POSTS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_POSTS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_CURRENT_USER] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_ALL_SAVED_POSTS] });
    },
  });
};

export const useDeleteSavedPost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (savedRecordId: string) => deleteSavedPost(savedRecordId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_RECENT_POSTS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_POSTS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_ALL_SAVED_POSTS] });
    },
  });
};

export const useGetSearch = (searchText: string, type: "post" | "user") => {
  const queryFn =
    type === "post" ? () => GetSearchPost(searchText) : () => GetSearchUser(searchText);
  return useQuery({
    queryKey: [
      type === "post" ? QUERY_KEYS.GET_SEARCH_POST : QUERY_KEYS.GET_SEARCH_USER,
      searchText,
    ],
    queryFn,
    enabled: !!searchText,
  });
};

// Users
export const useGetCurrentUser = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_CURRENT_USER],
    queryFn: getCurrentUser,
  });
};

export const useGetUserById = (id: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER_BY_ID, id],
    queryFn: () => getUserById(id),
    enabled: !!id,
  });
};

export const useGetAllUser = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_ALL_USER],
    queryFn: FetchAllUsers,
  });
};

export const useGetFollowing = (userId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_ALL_FOLLOWING, userId],
    queryFn: () => getFollowingList(userId),
  });
};
export const useGetFollower = (userId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_ALL_FOLLOWER, userId],
    queryFn: () => getFollowerList(userId),
  });
};

export const useFollowUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ followerId, followingId }: { followerId: string; followingId: string }) =>
      FollowUser({ followerId, followingId }),
    onSuccess: (_, { followerId,followingId }) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_ALL_FOLLOWING, followerId] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_ALL_FOLLOWER],followingId });
    },
  });
};

export const useUnFollowUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ followerId, followingId }: { followerId: string; followingId: string }) =>
      UnFollowUser({ followerId, followingId }),
    onSuccess: (_, { followerId ,followingId }) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_ALL_FOLLOWING, followerId] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_ALL_FOLLOWER, followingId] });
    },
  });
};
export const useRemoveFollower = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ followerId, followingId }: { followerId: string; followingId: string }) =>
      removeFollower({ followerId, followingId }),
    onSuccess: (_, { followerId,followingId }) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_ALL_FOLLOWER, followerId] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_ALL_FOLLOWING, followingId] });
    },
  });
};

export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: IUpdateUser) => UpdateUserProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_ALL_USER] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_SEARCH_USER] });
    },
  });
};

export const useGetSavedPosts = (userId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_ALL_SAVED_POSTS, userId],
    queryFn: () => AllSavedPosts(userId),
  });
};
