// This is a pseudo-code example for a server-side function with admin privileges
import { Client, Account} from 'node-appwrite';
import { appwriteConfig } from './config';

const client = new Client()
  .setEndpoint(appwriteConfig.url) 
  .setProject(appwriteConfig.projectId)
  .setKey(appwriteConfig.secretKey); 

const account = new Account(client);

export async function deleteAccountServerSide(accountId:string) {
  try {
    await account.deleteIdentity(accountId);
    return { success: true };
  } catch (error) {
    console.error('Server-side account deletion failed:', error);
    throw error;
  }
}
