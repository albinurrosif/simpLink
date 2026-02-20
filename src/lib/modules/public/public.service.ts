import { findUserByUsername } from '../user/user.repository';
import { getLinksByUserId } from '../link/link.repository';
import { PublicProfile } from '@/types/user';

export async function getPublicProfile(username: string): Promise<PublicProfile> {
  const user = await findUserByUsername(username);
    if (!user) {
    throw new Error('User not found');
  }

  const links = await getLinksByUserId(user.id);
  const activeLinks = links.filter((l) => l.isActive);

  if (activeLinks.length === 0) {
    throw new Error('No active link found');
  }

  return {
    user,
    links: activeLinks,
  };
}
