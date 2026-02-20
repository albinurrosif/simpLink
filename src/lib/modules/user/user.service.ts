import { validateUsername } from '@/lib/shared/utils/validation';
import { findUserById, findUserByUsername, updateProfile, updateUserImage } from './user.repository';
import { User, UpdateUserRequest } from '@/types/user';

export async function getUserProfile(id: number): Promise<User> {
  const user = await findUserById(id);

  if (!user) {
    throw new Error('User not found');
  }

  return user;
}

export async function updateUserProfile(id: number, newData: { username: string; bio: string; image: string; theme: string}): Promise<UpdateUserRequest | null> {
  if (newData.username !== undefined) {
    const validatedError = validateUsername(newData.username);
    if (validatedError) {
      throw new Error(validatedError);
    }
    const sanitizedUsername = newData.username.toLocaleLowerCase().trim();
    const existingUser = await findUserByUsername(sanitizedUsername);

    if (existingUser && existingUser.id !== id) {
      throw new Error('Username already taken');
    }

    newData.username = sanitizedUsername;
  }

  if (newData.bio !== undefined) {
    if (newData.bio && newData.bio.length > 200) {
      throw new Error('Bio must be less than 200 characters');
    }
  }

  return await updateProfile(id, newData);
}

export async function uploadProfileImage(userId: number, imageUrl: string): Promise<UpdateUserRequest | null> {
  return await updateUserImage(userId, imageUrl);
}
