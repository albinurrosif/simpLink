import { Pool, QueryResult } from 'pg';

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

export async function query(text: string, params?: any[]): Promise<QueryResult> {
  const client = await pool.connect();

  try {
    const result = await client.query(text, params);
    return result;
  } finally {
    client.release();
  }
}
