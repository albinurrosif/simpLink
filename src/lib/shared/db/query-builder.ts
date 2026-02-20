export function buildUpdateQuery(tableName: string, criteria: Record<string, any>, data: Record<string, any>) {
  const fields: string[] = [];
  const values: any[] = [];
  let idx = 1;

  // Mapping
  const columnMap: Record<string, string> = {
    username: 'username',
    bio: 'bio',
    image: 'profile_image_url',
    theme: 'theme',
  };

  for (const [key, value] of Object.entries(data)) {
    // Hanya proses jika field ada di map dan nilainya bukan undefined
    if (value !== undefined && columnMap[key]) {
      fields.push(`${columnMap[key]} = $${idx++}`);
      values.push(value);
    }
  }

  const whereClauses: string[] = [];
  for (const [key, value] of Object.entries(criteria)) {
    whereClauses.push(`${key} = $${idx++}`);
    values.push(value);
  }

  return {
    sql: `UPDATE ${tableName} SET ${fields.join(', ')}, updated_at = NOW() WHERE ${whereClauses.join(' AND ')} RETURNING *`,
    values,
  };
}