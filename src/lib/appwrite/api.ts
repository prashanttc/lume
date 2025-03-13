/* eslint-disable @typescript-eslint/no-explicit-any */
import { INewPost, INewUser, IUpdatePost, IUpdateUser } from "@/types";
import { account, appwriteConfig, avatars, databases, storage } from "./config";
import { ID, Query } from "appwrite";

//  user
export async function createUserAccount(user: INewUser) {
  try {
    const newAccount = await account.create(
      ID.unique(),
      user.email,
      user.password,
      user.name
    );
    if (!newAccount) throw Error;
    const avatarUrl = avatars.getInitials(user.name);
    const newUser = await saveUserToDB({
      accountId: newAccount.$id,
      name: newAccount.name,
      email: newAccount.email,
      username: user.username,
      imageUrl: avatarUrl,
    });
    return { success: true, data: newUser };
  } catch (error: any) {
    console.error("Error creating user:", error);
    return {
      success: false,
      message: error.message || "Failed to create user account",
    };
  }
}
export const saveUserToDB = async (user: {
  accountId: string;
  email: string;
  name: string;
  imageUrl: string;
  username?: string;
}) => {
  try {
    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      user
    );
    return newUser;
  } catch (error) {
    console.log(error);
  }
};
export const signInAccount = async (user: {
  email: string;
  password: string;
}) => {
  try {
    const existingUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("email", user.email)]
    );
    if (existingUser.documents.length === 0) {
      return {
        success: false,
        message: "user doesn't exists.please register first.",
      };
    }
    const session = await account.createEmailPasswordSession(
      user.email,
      user.password
    );
    return { success: true, data: session };
  } catch (error: any) {
    console.log(error);
    return {
      success: false,
      message: error.message || "error creating session",
    };
  }
};
// export async function signInWithGoogle(){
//      account.createOAuth2Session(
//       "google" as OAuthProvider,
//       "http://localhost:5173/",
//       "http://localhost:5173/signIn"
//     );
// };

export const sendPasswordReset = async (email: string) => {
  try {
    await account.createRecovery(email, "http://localhost:5173/reset-password");
    alert("Check your email for the reset link!");
  } catch (error: any) {
    console.error("Error sending reset email:", error.message);
  }
};
export const updatePassword = async ({
  password,
  userId,
  secret,
}: {
  password: string;
  userId: string;
  secret: string;
}) => {
  try {
    await account.updateRecovery(userId, secret, password);
    alert("Password reset successful!");
    return { success: true };
  } catch (error: any) {
    console.log("error", error.message);
    return { success: false };
  }
};
export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();
    if (!currentAccount) throw new Error();
    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );
    if (!currentUser) throw Error;
    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
  }
};
export const signOutAccount = async () => {
  try {
    const session = await account.deleteSession("current");
    return session;
  } catch (error) {
    console.log(error);
  }
};
export const getUserById = async (id: string) => {
  try {
    const user = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      id
    );
    if (!user) throw Error;
    return user;
  } catch (error) {
    console.log(error);
  }
};

// post
export const CreatePost = async (post: INewPost) => {
  try {
    const uploadFile = await UploadFile(post.file[0]);
    if (!uploadFile) throw Error;
    const fileUrl = await getFilePreview(uploadFile.$id);
    if (!fileUrl) {
      deleteFile(uploadFile.$id);
      throw Error;
    }
    const tags = post.tags?.replace(/ /g, "").split(",") || [];
    const newPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      ID.unique(),
      {
        creator: post.userId,
        caption: post.caption,
        imageUrl: fileUrl,
        imageId: uploadFile.$id,
        location: post.location,
        tags: tags,
      }
    );
    if (!newPost) {
      await deleteFile(uploadFile.$id);
      throw Error;
    }
    return newPost;
  } catch (error) {
    console.log(error);
  }
};
export const EditPost = async (post: IUpdatePost) => {
  const hasFiletoUpdate = post.file.length > 0;
  try {
    let image = {
      imageUrl: post.imageUrl,
      imageId: post.imageId,
    };
    if (hasFiletoUpdate) {
      const uploadFile = await UploadFile(post.file[0]);
      if (!uploadFile) throw Error;
      const fileUrl = getFilePreview(uploadFile.$id);
      if (!fileUrl) {
        deleteFile(uploadFile.$id);
        throw Error;
      }
      image = { ...image, imageId: uploadFile.$id, imageUrl: fileUrl };
    }
    const tags = post.tags?.replace(/ /g, "").split(" ") || [];
    const UpdatePost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      post.postId,
      {
        caption: post.caption,
        imageUrl: image.imageUrl,
        imageId: image.imageId,
        location: post.location,
        tags: tags,
      }
    );
    if (!UpdatePost) {
      await deleteFile(post.imageId);
      throw Error;
    }
    return UpdatePost;
  } catch (error) {
    console.log(error);
  }
};
export const DeletePost = async ({
  postId,
  imageId,
}: {
  postId: string;
  imageId: string;
}) => {
  if (!imageId || !postId) throw Error;
  try {
    await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId
    );
    return { status: "ok" };
  } catch (error) {
    console.log(error);
  }
};
export const FetchInfinitePost = async ({ pageParam = 0 }) => {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [
        Query.limit(20),
        Query.offset(pageParam * 20),
        Query.orderDesc("$createdAt"),
      ]
    );
    if (!posts) throw Error;

    return {
      posts: posts.documents,
      total: posts.total,
    };
  } catch (error) {
    console.log(error);
  }
};
export const UploadFile = async (file: File) => {
  try {
    const uploadedFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      file
    );
    return uploadedFile;
  } catch (error) {
    console.log(error);
  }
};
export const UploadAvatar = async (file: File) => {
  try {
    const uploadedFile = await storage.createFile(
      appwriteConfig.avatarStorageId,
      ID.unique(),
      file
    );
    return uploadedFile;
  } catch (error) {
    console.log(error);
  }
};
export const getFilePreview = (fileId: string) => {
  try {
    const fileUrl = storage.getFilePreview(
      appwriteConfig.storageId,
      fileId,
      2000,
      2000,
      undefined,
      100
    );
    return fileUrl;
  } catch (error) {
    console.log(error);
  }
};
export const getAvatarPreview = (fileId: string) => {
  try {
    const fileUrl = storage.getFilePreview(
      appwriteConfig.avatarStorageId,
      fileId,
      2000,
      2000,
      undefined,
      100
    );
    return fileUrl;
  } catch (error) {
    console.log(error);
  }
};
export const deleteFile = async (fileId: string) => {
  try {
    await storage.deleteFile(appwriteConfig.storageId, fileId);
    return { status: "ok" };
  } catch (error) {
    console.log(error);
  }
};
export const deleteAvatar = async (fileId: string) => {
  try {
    await storage.deleteFile(appwriteConfig.avatarStorageId, fileId);
    return { status: "ok" };
  } catch (error) {
    console.log(error);
  }
};
export const getRecentPost = async () => {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [Query.orderDesc("$createdAt"), Query.limit(20)]
    );
    if (!posts) throw Error;
    return posts;
  } catch (error) {
    console.log(error);
  }
};
export const likedPost = async (postId: string, likedArray: string[]) => {
  try {
    const updatePost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId,
      {
        likes: likedArray,
      }
    );
    if (!updatePost) throw Error;
    return updatePost;
  } catch (error) {
    console.log(error);
  }
};
export const savedPost = async (postId: string, userId: string) => {
  try {
    const updatePost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.saveCollectionId,
      ID.unique(),
      {
        post: postId,
        user: userId,
      }
    );
    if (!updatePost) throw Error;
    return updatePost;
  } catch (error) {
    console.log(error);
  }
};
export const deleteSavedPost = async (savedRecordId: string) => {
  try {
    const statusCode = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.saveCollectionId,
      savedRecordId
    );
    if (!statusCode) throw Error;
    return { status: "ok" };
  } catch (error) {
    console.log(error);
  }
};
export const getPostById = async (id: string) => {
  try {
    const post = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      id
    );
    if (!post) throw Error;
    return post;
  } catch (error) {
    console.log(error);
  }
};
export const GetSearchPost = async (searchText: string) => {
  try {
    const result = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [Query.contains("caption", searchText)]
    );

    if (!result || result.documents.length === 0) {
      throw new Error("No results found");
    }

    return result.documents;
  } catch (error: any) {
    console.error("Search error:", error);
    throw new Error(error.message || "Failed to search");
  }
};
export const GetSearchUser = async (searchText: string) => {
  try {
    const result = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.contains("username", searchText)]
    );
    if (!result || result.documents.length === 0) {
      throw new Error("No results found");
    }

    return result.documents;
  } catch (error: any) {
    console.error("Search error:", error);
    throw new Error(error.message || "Failed to search");
  }
};

//all
export const FetchAllUsers = async () => {
  try {
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.orderDesc("$createdAt"), Query.limit(20)]
    );

    if (!response || response.documents.length === 0) {
      throw new Error("No results found");
    }
    return { users: response.documents };
  } catch (error: any) {
    console.log(error);
    throw new Error(error.message || "failed to fetch all users");
  }
};

// users actions
export const UnFollowUser = async ({
  followerId,
  followingId,
}: {
  followerId: string;
  followingId: string;
}) => {
  try {
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.followCollectionId,
      [
        Query.equal("followerId", followerId),
        Query.equal("followingId", followingId),
      ]
    );
    if (!response || response.documents.length === 0) return [];
    const docId = response.documents[0].$id;

    await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.followCollectionId,
      docId
    );
    return true;
  } catch (error: any) {
    console.log(error);
    throw new Error(error.message || "failed to follow");
  }
};
export const FollowUser = async ({
  followerId,
  followingId,
}: {
  followerId: string;
  followingId: string;
}) => {
  try {
    const response = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.followCollectionId,
      ID.unique(),
      {
        followerId: followerId,
        followingId: followingId,
        createdAt: new Date().toISOString(),
      }
    );
    if (!response) throw new Error();
    return response;
  } catch (error: any) {
    console.log(error);
    throw new Error(error.message || "failed to follow");
  }
};
export const removeFollower = async ({
  followerId,
  followingId,
}: {
  followerId: string;
  followingId: string;
}) => {
  try {
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.followCollectionId,
      [
        Query.equal("followerId", followerId),
        Query.equal("followingId", followingId),
      ]
    );
    if (!response || response.documents.length === 0) return [];
    const docId = response.documents[0].$id;
     console.log("docid",docId)
    await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.followCollectionId,
      docId
    );
    return true;
  } catch (error: any) {
    console.log(error);
    throw new Error(error.message || "error removing follower");
  }
};
export const getFollowingList = async (userId: string) => {
  try {
    const result = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.followCollectionId,
      [Query.equal("followerId", userId)]
    );
    if (result.documents.length === 0) return [];

    const list = result.documents;
    return list;
  } catch (error: any) {
    console.log(error);
    throw new Error(error.message || "failed to fetch followings");
  }
};
export const getFollowerList = async (userId: string) => {
  try {
    const result = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.followCollectionId,
      [Query.equal("followingId", userId)]
    );
    if (result.documents.length === 0) return [];

    const list = result.documents;
    return list;
  } catch (error: any) {
    console.log(error);
    throw new Error(error.message || "failed to fetch followers");
  }
};

export const UpdateUserProfile = async (user: IUpdateUser) => {
  const hasFiletoUpdate = user.file.length > 0;
  try {
    let image = {
      imageUrl: user.imageUrl,
      imageId: user.imageId,
    };
    if (hasFiletoUpdate) {
      const uploadFile = await UploadAvatar(user.file[0]);
      if (!uploadFile) throw Error;
      const fileUrl = getAvatarPreview(uploadFile.$id);
      if (!fileUrl) {
        deleteAvatar(uploadFile.$id);
        throw Error;
      }
      image = { ...image, imageId: uploadFile.$id, imageUrl: fileUrl };
    }
    const response = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      user.userId,
      {
        username: user.name,
        bio: user.bio,
        imageId: image.imageId,
        imageUrl: image.imageUrl,
      }
    );
    return response;
  } catch (error: any) {
    console.log(error);
    throw new Error(error.message || "failed to update user");
  }
};

export const AllSavedPosts = async (userId: string) => {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.saveCollectionId,
      [Query.equal("user", userId)]
    );
    if (!posts || posts.documents.length === 0) {
      throw new Error("no result found");
    }
    return posts.documents;
  } catch (error: any) {
    console.log(error);
    throw new Error(error.message || "failed to fetch saved posts");
  }
};
