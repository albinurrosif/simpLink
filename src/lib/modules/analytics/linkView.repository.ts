import { query } from '@/lib/shared/db/db';
import { mapRowToLinkView } from '@/lib/shared/db/db-mapper';
import { LinkView } from '@/types/linkView';

export async function createLinkView(linkId: number, ip: string, ua: string): Promise<LinkView> {
  const result = await query(`INSERT INTO link_views (link_id, ip_address, user_agent) VALUES ($1, $2, $3) RETURNING *`, [linkId, ip, ua]);
  return mapRowToLinkView(result.rows[0]);
}



