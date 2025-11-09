import admin from 'firebase-admin';

// Cegah inisialisasi ganda saat hot reload di dev
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      // Ganti "\n" di file .env menjadi newline sebenarnya
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
  });
}

// Ekspor instance Firestore (bisa juga Storage dsb.)
export const db = admin.firestore();
