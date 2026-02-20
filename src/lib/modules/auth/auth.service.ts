import { findUserByUsername, createUser, findUserByIdentifier } from '../user/user.repository';
import { hashPassword, verifyPassword } from '@/lib/auth/password';
import { signToken } from '@/lib/auth/jwt';
import { User } from '@/types/user';
import { validateUsername } from '@/lib/shared/utils/validation';

type RegisterUserResult = {
  user: User;
  token: string;
};

type LoginUserResult = {
  user: User;
  token: string;
};

export async function registerUser(username: string, email: string, password: string): Promise<RegisterUserResult> {
  const validatedError = validateUsername(username);
  if (validatedError) {
    throw new Error(validatedError);
  }
  const passwordHash = await hashPassword(password);
  const user = await createUser(username, email, passwordHash);

  const token = signToken({ userId: user.id });

  return { user, token };
}

export async function loginUser(identifier: string, password: string): Promise<LoginUserResult> {
  const user = await findUserByIdentifier(identifier);

  if (!user) {
    throw new Error('Invalid credentials');
  }

  const passwordMatch = await verifyPassword(password, user.password);

  if (!passwordMatch) {
    throw new Error('Invalid credentials');
  }

  const token = signToken({ userId: user.id });

  const { password: _, ...userWithoutPassword } = user;

  return { user: userWithoutPassword, token };
}
