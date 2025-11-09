import { db } from '@/lib/firebaseAdmin'; // Firebase Admin SDK

export async function GET(req) {
  const baseUrl = 'https://kumpulink.vercel.app';

  // Ambil semua user publik
  const usersSnapshot = await db.collection('users').where('isPublic', '==', true).get();
  const users = usersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

  // Landing page
  const lastModLanding = new Date().toISOString().split('T')[0];
  let urls = `
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${lastModLanding}</lastmod>
    <priority>1.0</priority>
  </url>
  `;

  // Halaman user publik
  users.forEach((user) => {
    if (user.username) {
      const lastModUser = user.updatedAt ? new Date(user.updatedAt.seconds * 1000).toISOString().split('T')[0] : lastModLanding;

      urls += `
      <url>
        <loc>${baseUrl}/${user.username}</loc>
        <lastmod>${lastModUser}</lastmod>
        <priority>0.8</priority>
      </url>
      `;
    }
  });

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
    ${urls}
  </urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
