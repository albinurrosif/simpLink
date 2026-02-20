import { query } from '@/lib/shared/db/db';
import { mapRowsToLinks, mapRowToLink } from '@/lib/shared/db/db-mapper';
import { Link } from '@/types/link';

export async function createLink(userId: number, title: string, url: string): Promise<Link> {
  const result = await query(
    `INSERT INTO links (user_id, title, url, sort_order) 
     VALUES ($1, $2, $3, (SELECT COALESCE(MAX(sort_order), 0) + 1 FROM links WHERE user_id = $1)) 
     RETURNING *`,
    [userId, title, url],
  );
  return mapRowToLink(result.rows[0]);
}

interface UpdateLinkParams {
  userId: number;
  linkId: number;
  title?: string;
  url?: string;
  icon?: string | null;
  sortOrder?: number;
  isActive?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export async function patchLink({ userId, linkId, title, url, icon, sortOrder, isActive, createdAt, updatedAt }: UpdateLinkParams) {
  const result = await query(
    `UPDATE links 
    SET title = COALESCE($1, title), 
        url = COALESCE($2, url), 
        is_active = COALESCE($3, is_active),
        icon = COALESCE($4, icon),
        sort_order = COALESCE($5, sort_order),
        updated_at = NOW()
    WHERE id = $6 AND user_id = $7 
    RETURNING *`,
    [title, url, isActive, icon, sortOrder, linkId, userId],
  );

  return mapRowToLink(result.rows[0]);
}

export async function deleteLink(userId: number, linkId: number) {
  const result = await query(`DELETE FROM links WHERE id = $1 AND user_id = $2 RETURNING *`, [linkId, userId]);
  return mapRowToLink(result.rows[0]);
}

export async function updateLinksOrder(userId: number, linkId: number[]) {
  if (linkId.length === 0) return [];

  const values = linkId.map((id, index) => `(${id}, ${index + 1})`).join(', ');

  // Gunakan query UPDATE langsung tanpa WITH agar lebih "ringan"
  const queryText = `
    UPDATE links AS l
    SET sort_order = v.sort_order
    FROM (VALUES ${values}) AS v(id, sort_order)
    WHERE l.id = v.id AND l.user_id = $1
  `;

  try {
    await query(queryText, [userId]);
    // Cukup kembalikan true atau array kosong
    return { success: true };
  } catch (dbError: any) {
    console.error('DATABASE ERROR DETAIL:', dbError.message);
    throw dbError;
  }
}

// untuk public
export async function getLinksByUserId(userId: number): Promise<Link[]> {
  const result = await query(
    `SELECT id, user_id, title, url, icon, sort_order, is_active, created_at, updated_at
    FROM links 
    WHERE user_id = $1 
    ORDER BY sort_order ASC`,
    [userId],
  );
  return mapRowsToLinks(result.rows);
}

// untuk dashboard (mendapatkan link beserta total klik)
export async function getLinksWithAnalytics(userId: number): Promise<any[]> {
  const result = await query(
    `SELECT 
        l.id, l.user_id AS "userId", l.title, l.url, l.is_active AS "isActive", 
        l.sort_order AS "sortOrder",
        CAST(COUNT(lv.id) AS INTEGER) as total_clicks
     FROM links l
     LEFT JOIN link_views lv ON l.id = lv.link_id
     WHERE l.user_id = $1
     GROUP BY l.id
     ORDER BY l.sort_order ASC`,
    [userId]
  );
  return result.rows;
}
