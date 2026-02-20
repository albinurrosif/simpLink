import { query } from '@/lib/shared/db/db';
import { mapRowToUserWithPassword, mapRowToUser } from '@/lib/shared/db/db-mapper';
import { buildUpdateQuery } from '@/lib/shared/db/query-builder';
import { UpdateUserRequest, User, UserWithPassword } from '@/types/user';
import { Update } from 'next/dist/build/swc/types';

export async function findUserByUsername(username: string): Promise<User | null> {
  const result = await query(
    `SELECT id,
    username,
    email,
    bio,
    profile_image_url,
    theme,
    created_at,
    updated_at FROM users WHERE username = $1`,
    [username],
  );

  return mapRowToUser(result.rows[0]) ?? null;
}

export async function createUser(username: string, email: string, password: string): Promise<User> {
  const result = await query(`INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email`, [username, email, password]);
  const user = mapRowToUser(result.rows[0]);

  if (!user) {
    throw new Error('Failed to create user  ');
  }
  return user;
}

export async function findUserByIdentifier(identifier: string): Promise<UserWithPassword | null> {
  const result = await query(
    `
    SELECT id,
    username,
    email,
    password,
    bio,
    profile_image_url,
    theme,
    created_at,
    updated_at
    FROM users
    WHERE username = $1 OR email = $1
    `,
    [identifier],
  );

  return mapRowToUserWithPassword(result.rows[0]) ?? null;
}

export async function findUserById(id: number): Promise<User | null> {
  const result = await query(
    `
    SELECT id,
    username,
    email,
    bio,
    profile_image_url,
    theme
    FROM users
    WHERE id = $1
    `,
    [id],
  );
  return mapRowToUser(result.rows[0]) ?? null;
}

export async function updateProfile(id: number, data: { username: string; bio: string; image: string; theme: string }): Promise<User | null> {
  const { sql, values } = buildUpdateQuery('users', { id: id }, data);
  const result = await query(sql, values);
  return mapRowToUser(result.rows[0]);
}

export async function updateUserImage(userId: number, imageUrl: string): Promise<User | null> {
  const result = await query(
    `
    UPDATE users 
    SET profile_image_url = $1, updated_at = NOW() 
    WHERE id = $2 
    RETURNING id, username, profile_image_url
  `,
    [imageUrl, userId],
  );
  return mapRowToUser(result.rows[0]) ?? null;
}

export async function updateUser(userId: number, data: { username?: string; bio?: string; theme?: string }) {
  const { username, bio, theme } = data;
  const result = await query(
    `UPDATE users 
     SET username = COALESCE($1, username), 
         bio = COALESCE($2, bio), 
         theme = COALESCE($3, theme)
     WHERE id = $4 RETURNING *`,
    [username, bio, theme, userId],
  );
  return result.rows[0];
}
