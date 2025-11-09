import { db } from '@/lib/firebaseAdmin';

export async function GET() {
  const baseUrl = 'https://kumpulink.vercel.app';
  const today = new Date().toISOString().split('T')[0];
  let urls = '';

  try {
    // Ambil semua user publik
    const snapshot = await db.collection('users').where('isPublic', '==', true).get();

    // Landing page utama
    urls += `
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${today}</lastmod>
    <priority>1.0</priority>
  </url>`;

    // Halaman user publik
    snapshot.forEach((doc) => {
      const data = doc.data();
      if (data.username) {
        const lastMod = data.updatedAt?.seconds ? new Date(data.updatedAt.seconds * 1000).toISOString().split('T')[0] : today;

        urls += `
  <url>
    <loc>${baseUrl}/${data.username}</loc>
    <lastmod>${lastMod}</lastmod>
    <priority>0.8</priority>
  </url>`;
      }
    });
  } catch (err) {
    console.error('Gagal membuat sitemap:', err);
    urls += `
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${today}</lastmod>
    <priority>1.0</priority>
  </url>`;
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  return new Response(sitemap.trim(), {
    headers: {
      'Content-Type': 'application/xml',
    },
    status: 200,
  });
}
