// import { Pool, QueryResult } from 'pg';

// const pool = new Pool({
//   host: process.env.DB_HOST,
//   port: Number(process.env.DB_PORT),
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
// });

// export async function query(text: string, params?: any[]): Promise<QueryResult> {
//   const client = await pool.connect();

//   try {
//     const result = await client.query(text, params);
//     return result;
//   } finally {
//     client.release();
//   }
// }
import { Pool, QueryResult } from 'pg';

// gunakan connectionString agar lebih simpel dan mendukung SSL dari Neon
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false, // Wajib untuk koneksi ke Neon/Cloud DB
  },
});

export async function query(text: string, params?: any[]): Promise<QueryResult> {
  // Gunakan pool.query secara langsung (lebih efisien untuk single query)
  // pool akan menangani connect dan release secara otomatis
  try {
    const result = await pool.query(text, params);
    return result;
  } catch (error) {
    console.error('Database Query Error:', error);
    throw error;
  }
}