import { db } from '@/lib/firebaseAdmin';

export async function GET() {
  const baseUrl = 'https://kumpulink.vercel.app';
  const lastModDefault = new Date().toISOString().split('T')[0];
  let urls = '';

  try {
    // ✅ Ambil semua user publik dari Firestore
    const usersSnapshot = await db.collection('users').where('isPublic', '==', true).get();

    const users = usersSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // ✅ Tambahkan halaman utama (landing page)
    urls += `
      <url>
        <loc>${baseUrl}/</loc>
        <lastmod>${lastModDefault}</lastmod>
        <priority>1.0</priority>
      </url>
    `;

    // ✅ Tambahkan halaman user publik
    users.forEach((user) => {
      if (user.username) {
        const lastModUser = user.updatedAt ? new Date(user.updatedAt.seconds * 1000).toISOString().split('T')[0] : lastModDefault;

        urls += `
          <url>
            <loc>${baseUrl}/${user.username}</loc>
            <lastmod>${lastModUser}</lastmod>
            <priority>0.8</priority>
          </url>
        `;
      }
    });
  } catch (error) {
    console.error('❌ Gagal membuat sitemap:', error);

    // Jika Firestore error, tetap kirim sitemap minimal
    urls += `
      <url>
        <loc>${baseUrl}/</loc>
        <lastmod>${lastModDefault}</lastmod>
        <priority>1.0</priority>
      </url>
    `;
  }

  // ✅ Bangun XML sitemap
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
