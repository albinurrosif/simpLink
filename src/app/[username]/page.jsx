'use client';

import { useEffect, useState, use } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useAuth } from '@/context/authcontext';
import Link from 'next/link';

// Komponen halaman menerima 'props' yang berisi 'params'
export default function UserPage({ params }) {
  // Resolving params
  const resolvedParams = use(params);
  const { user: loggedInUser } = useAuth();

  // Langkah 1. State Manajemen
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [links, setLinks] = useState([]);
  const [error, setError] = useState(null);

  // Langkah 2. useEffect untuk mengambil data
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

  if (loading || !userProfile) {
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

  if (error) {
    return <h1>{error}</h1>;
  }

  return (
    <div className="w-full max-w-xs mx-auto  relative">
   
      {loggedInUser && loggedInUser.uid === userProfile?.userId && (
        // Posisi absolut relatif terhadap div di atas
        <div className="absolute top-2 right-2 z-10 tooltip" data-tip="Edit halaman">
        
          <Link href="/dashboard" className="link link-primary" aria-label="Edit Halaman">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
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
       
            {/* Using ui-avatars for a placeholder image */}
            <img src={`https://ui-avatars.com/api/?name=${userProfile?.username}&background=random&color=fff&size=128`} alt={`${userProfile?.username} avatar`} />
          </div>
        </div>
        <h1 className="text-xl font-semibold text-base-content">
        @{userProfile?.username}
        </h1>
        
        {/* <p className="text-sm text-neutral-500 mt-1">{userProfile?.bio || ''}</p> */}
      </div>
      {/* Link Buttons Section */}
      <ul className="w-full space-y-3">
        {/* Adjusted spacing */}
        {links.map((link) => (
          <li key={link.id} className="list-none w-full">
            <a
              href={link.link}
              target="_blank"
              rel="noopener noreferrer"
              // Example: Linktree-style button (light bg, dark text, full round, shadow)
              className="btn bg-base-100 border-base-300 text-base-content hover:bg-base-200 btn-block text-base normal-case rounded-full shadow hover:scale-[1.02] transition-transform duration-150 ease-in-out"
            >
              {link.name}
            </a>
          </li>
        ))}
      </ul>
      {/* Footer Branding Link*/}
      <div className="text-center mt-8">
        <Link href="/" className="text-xs text-neutral-500 hover:text-primary">
          Powered by KumpuLink
        </Link>
      </div>
    </div>
  );
}
