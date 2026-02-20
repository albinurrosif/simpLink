import { Link } from '@/types/link';
import { createLink, getLinksByUserId, patchLink, deleteLink, updateLinksOrder, getLinksWithAnalytics } from './link.repository';

export async function addLink(userId: number, title: string, url: string): Promise<Link> {
  if (!title || !url) {
    throw new Error('Missing fields');
  }

  if (title.length > 50) {
    throw new Error('Title is too long');
  }

  if (url) {
    url = url.trim();
    if (url.length === 0) {
      throw new Error('URL cannot be empty');
    }
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }

    try {
      new URL(url);
    } catch (error: any) {
      throw new Error('URL is invalid');
    }
  }

  const newLink = await createLink(userId, title, url);

  return newLink;
}

interface UpdateLinkParams {
  userId: number;
  linkId: number;
  title?: string;
  url?: string;
  icon?: string | null;
  sortOrder?: number;
  isActive?: boolean;
}

export async function updateExistingLink({ userId, linkId, title, url, icon, sortOrder, isActive }: UpdateLinkParams) {
  if (title) {
    if (title.trim().length === 0) {
      throw new Error('Title cannot be empty');
    }
    if (title.length > 50) {
      throw new Error('Title is too long');
    }
  }

  if (url) {
    url = url.trim();
    if (url.length === 0) {
      throw new Error('URL cannot be empty');
    }
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }

    try {
      new URL(url);
    } catch (error: any) {
      throw new Error('URL is invalid');
    }
  }

  if (sortOrder !== undefined && typeof sortOrder !== 'number') {
    throw new Error('Sort order must be a number');
  }

  if (isActive !== undefined && typeof isActive !== 'boolean') {
    throw new Error('is_active must be a boolean');
  }

  const updatedLink = await patchLink({ userId, linkId, title, url, icon, sortOrder, isActive, createdAt: '', updatedAt: '' });

  if (!updatedLink) throw new Error('Link not found or unauthorized');

  return updatedLink;
}

export async function deleteExistingLink(userId: number, linkId: number) {
  const deletedLink = await deleteLink(userId, linkId);

  if (!deletedLink) {
    throw new Error('Link not found or unauthorized');
  }

  return deletedLink;
}

export async function reorderUserLinks(userId: number, linkIds: number[]) {
  if (!Array.isArray(linkIds) || linkIds.some((id) => typeof id !== 'number')) {
    throw new Error('Invalid link IDs');
  }

  if (linkIds.length === 0) {
    throw new Error('Link IDs cannot be empty');
  }

  const updatedLinks = await updateLinksOrder(userId, linkIds);
  console.log('Updated Links after reorder:', updatedLinks);

  return updatedLinks;
}

export async function getUserLinks(userId: number): Promise<Link[]> {
  const links = await getLinksWithAnalytics(userId);
  console.log('Fetched Links with Analytics:', links);
  return links;
}