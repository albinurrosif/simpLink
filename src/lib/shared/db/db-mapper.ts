import { Link } from '@/types/link';
import { User, UserWithPassword } from '@/types/user';

// User mapping functions
export function mapRowToUser(Row: any): User | null {
  if (!Row) return null;
  return {
    id: Row.id,
    username: Row.username,
    email: Row.email,
    bio: Row.bio,
    profileImage: Row.profile_image_url,
    theme: Row.theme || 'light',
    createdAt: Row.created_at,
    updatedAt: Row.updated_at,
  };
}

export function mapRowToUserWithPassword(Row: any): UserWithPassword | null {
  if (!Row) return null;
  return {
    id: Row.id,
    username: Row.username,
    email: Row.email,
    password: Row.password,
    bio: Row.bio,
    profileImage: Row.profile_image_url,
    theme: Row.theme || 'light',
    createdAt: Row.created_at,
    updatedAt: Row.updated_at,
  };
}

export function mapRowsToUsers(Rows: any[]): User[] {
  return Rows
    .map(row => mapRowToUser(row))
    .filter((user): user is User => user !== null);
}


// Link mapping functions
export function mapRowToLink(Row: any): Link  {
  return {
    id: Row.id,
    userId: Row.user_id,
    title: Row.title,
    url: Row.url,
    icon: Row.icon,
    sortOrder: Row.sort_order,
    isActive: Row.is_active,
    createdAt: Row.created_at,
    updatedAt: Row.updated_at,
  };
}

export function mapRowsToLinks(Rows: any[]): Link[] {
  return Rows.map(mapRowToLink);
}

export function mapRowToLinkView(Row: any) {
  return {
    id: Row.id,
    linkId: Row.link_id,
    ipAddress: Row.ip_address,
    userAgent: Row.user_agent,
    createdAt: Row.created_at,
  };
}

export function mapRowsToLinkViews(Rows: any[]) {
  return Rows.map(mapRowToLinkView);
}