import { Link } from "./link";

export type User = {
  id: number;
  username: string;
  email: string;
  bio: string | null;
  profileImage: string | null;
  theme: string;
  createdAt: Date;
  updatedAt: Date;
};

export type UserWithPassword = User & {
  password: string;
};

export interface UpdateUserRequest {
  username?: string;
  bio?: string | null;
  profileImage?: string | null;
  theme?: string;
}

export type PublicProfile = {
  user: User;
  links: Link[];
}