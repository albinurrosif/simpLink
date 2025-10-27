'use client';

import { useEffect, useState, use } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useAuth } from '@/context/authcontext';
import Link from 'next/link';

// Komponen halaman menerima 'props' yang berisi 'params'
export default function UserPage({ params }) {
  // ==================== HOOKS EXTERNAL ====================
  // Resolving params
  const resolvedParams = use(params);
  const { user: loggedInUser } = useAuth();

  // ==================== STATE MANAGEMENT ====================
  // 🟢 LOADING & ERROR STATES
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🟢 DATA STATES
  const [userProfile, setUserProfile] = useState(null);
  const [links, setLinks] = useState([]);
  const [copiedLinkId, setCopiedLinkId] = useState(null);

  // ==================== EFFECTS ====================
  // 🔵 DATA FETCHING EFFECT
  useEffect(() => {
    // 1. dapatkan usernamedari URL yangdiberikan next.js
    // Ambil username dari objek params
    const username = resolvedParams.username;

    // 2. buat fungsi async untuk mengambil data
    const fetchData = async () => {
      // reset setiap kali username baru dicari
      setLoading(true);
      setUserProfile(null);
      setLinks([]);
      setError(null);

      try {
        // Langkah A. Cari user berdasarkan username
        const userRef = collection(db, 'users');
        const userQuery = query(userRef, where('username', '==', username));
        const userSnapshot = await getDocs(userQuery);

        if (userSnapshot.empty) {
          setError('User not found!');
          console.error('User not found! ');
        } else {
          // jika user ditemukan, ambil datanya
          const userData = userSnapshot.docs[0].data();
          const userId = userSnapshot.docs[0].id; //ID dokumen = UID user
          setUserProfile({ ...userData, userId: userId });

          // Langkah B. Ambil link-link yang terkait dengan userId
          const linksRef = collection(db, 'links');
          const linksQuery = query(linksRef, where('userId', '==', userId));
          const linksSnapshot = await getDocs(linksQuery);

          const linksData = linksSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setLinks(linksData);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Error fetching user data');
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchData();
    } else {
      setError('Invalid username');
      setLoading(false);
    }
  }, [resolvedParams]); //3. depedency array untuk menjalankan ulang saat username berubah

  // ==================== FUNCTIONS ====================
  const handleShareOrCopy = async (event, link) => {
    // 1. hentikan event agar tidak memicu navigasi link
    event.stopPropagation(); // Mencegah "bubbling" ke elemen lain
    event.preventDefault(); // Mencegah perilaku default (meskipun di button, ini aman)

    // data yang dibagikan
    const shareData = {
      title: userProfile.username, // judul saat dibagikan
      text: `Lihat link ${userProfile.username} di KumpuLink!`, // deskripsi
      url: link, // link
    };

    try {
      // 2. coba gunakan navigator.share (Untuk Mobile)
      if (navigator.share) {
        await navigator.share(shareData);
        console.log('Berhasil dibagikan via Share API');
      } else {
        // 3. jika gagal/tidak ada, gunakan clipboard (untuk dekstop)
        await navigator.clipboard.writeText(link);
        setCopiedLinkId(link); // simpan link yang disalin
        setTimeout(() => setCopiedLinkId(null), 2000); //hapus umpan balik setelah beberapa detik
      }
    } catch (err) {
      console.error('Gagal menyalin link', err);

      if (err.name !== 'AbortError') {
        // tampilkan error salin  cadangan jika gagal
        await navigator.clipboard.writeText(link);
        setCopiedLinkId(link);
        setTimeout(() => setCopiedLinkId(null), 2000);
      }
    }
  };

  // ==================== RENDER LOGIC ====================

  // Skeleton loading UI
  if (loading) {
    // Tampilkan Skeleton UI
    return (
      <div className="min-h-screen flex flex-col gap-4 items-center justify-center w-full max-w-sm mx-auto">
        <div className="skeleton h-32 w-full"></div>
        <div className="skeleton h-4 w-28"></div>
        <div className="skeleton h-4 w-full"></div>
        <div className="skeleton h-4 w-full"></div>
      </div>
    );
  }

  // Cek error SETELAH loading selesai
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1>{error}</h1>
      </div>
    );
  }

  // Jika tidak loading DAN tidak error, baru render profil
  // (Pastikan userProfile ada sebelum mencoba mengakses propertinya di return)
  if (!userProfile) {
    // Ini seharusnya tidak terjadi jika error handling benar, tapi sebagai fallback
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1>Profil tidak dapat dimuat.</h1>
      </div>
    );
  }
  return (
    <div className="w-full max-w-xs mx-auto  relative">
      {loggedInUser && loggedInUser.uid === userProfile?.userId && (
        // Posisi absolut relatif terhadap div di atas
        <div className="absolute top-2 right-2 z-10 tooltip" data-tip="Edit halaman">
          <Link href="/dashboard" className="link link-primary" aria-label="Edit Halaman">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
              />
            </svg>
          </Link>
        </div>
      )}
      {/* Profile Section */}
      <div className="flex flex-col items-center text-center pt-8 mb-6">
        <div className="avatar mb-4">
          <div className="w-20 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
            {userProfile?.photoURL ? (
              // 1. Jika userProfile.photoURL ADA, tampilkan foto itu
              <img src={userProfile.photoURL} alt={`${userProfile.username} avatar`} />
            ) : (
              // 2. Jika TIDAK ADA, tampilkan placeholder inisial
              // (Gunakan daisyUI 'placeholder' dengan benar)
              <div className="avatar placeholder">
                <div className="bg-neutral text-neutral-content rounded-full w-20">
                  <span className="text-3xl">
                    {/* Perbaiki typo: tambahkan '()' */}
                    <img src={`https://ui-avatars.com/api/?name=${userProfile?.username}&background=random&color=fff&size=128`} alt={`${userProfile?.username} avatar`} />
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
        <h1 className="text-xl font-semibold text-base-content">@{userProfile?.username}</h1>
        {userProfile?.bio && <p className="text-sm text-base-content/80 mt-2 text-center max-w-xs">{userProfile.bio}</p>}
      </div>
      {/* Link Buttons Section */}
      <ul className="w-full space-y-3">
        {/* Adjusted spacing */}
        {links.map((link) => (
          <li key={link.id} className="list-none w-full ">
            <div className="btn bg-base-100 border-base-300 text-base-content hover:bg-base-200 btn-block text-base normal-case rounded-full shadow hover:scale-[1.02] transition-transform duration-150 ease-in-outflex flex-row relative py-6">
              <a href={link.link} target="_blank" rel="noopener noreferrer" className="absolute left-1/2 transform -translate-x-1/2 text-neutral-500 hover:text-primary">
                {link.name}
              </a>
              <button onClick={(event) => handleShareOrCopy(event, link.link)} className="ml-auto btn btn-ghost btn-sm btn-circle right-2" aria-label="Salin Link">
                {copiedLinkId === link.link ? (
                  // Ikon Check (jika baru disalin)
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-neutral-500 hover:text-primary" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="5" r="2" />
                    <circle cx="12" cy="12" r="2" />
                    <circle cx="12" cy="19" r="2" />
                  </svg>
                )}
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* IMPROVED CTA SECTION */}
      <div className="text-center mt-8">
        <Link
          href="/"
          className="
            inline-flex items-center justify-center
            px-3 py-1.5
            bg-gradient-to-r from-primary to-primary/90
            hover:from-primary/90 hover:to-primary
            text-white font-semibold
            rounded-full
            shadow-lg hover:shadow-xl
            transform hover:scale-105
            transition-all duration-300 ease-out
            border-0
            text-sm
            w-100% max-w-xs
            group
          "
        >
          <span className="flex items-center gap-2">
            ✨ Buat Link Bio Gratis
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </span>
        </Link>

        {/* Optional: Tambahkan teks penjelasan */}
        <p className="text-xs text-neutral-500 mt-3">Buat halaman personalmu dalam 1 menit</p>
      </div>
      {/* Footer Branding Link*/}
      <div className="text-center mt-8">
        <Link href="/" className="text-xs text-neutral-500 hover:text-primary">
          Powered by KumpuLink
        </Link>
      </div>
    </div>
  );
}
