import { INewPost, INewUser, IUpdatePost } from "@/types";
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
    return newUser;
  } catch (error) {
    console.error(error);
    return error;
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
    const session = await account.createEmailPasswordSession(
      user.email,
      user.password
    );
    return session;
  } catch (error) {
    console.log(error);
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

export const deleteFile = async (fileId: string) => {
  try {
    await storage.deleteFile(appwriteConfig.storageId, fileId);
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
