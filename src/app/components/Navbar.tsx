'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar({ username, profileImage }: { username?: string, profileImage?: string | null}) {
  const [origin, setOrigin] = useState('');
  const pathname = usePathname();
  const isDashboard = pathname === '/dashboard';

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const handleLogout = async () => {
    const res = await fetch('/api/auth/logout', { method: 'POST' });
    if (res.ok) {
      window.location.href = '/login';
    }
  };

  console.log({
    isDashboard, // Harus true
    origin, // Harus ada isinya (misal: http://localhost:3000)
    username, // Harus ada isinya
    pathname, // Cek nilainya apa
  });

  return (
    <div className="navbar flex items-center justify-between bg-primary shadow-sm px-4 md:px-8 ">
      {/* KIRI: Logo */}
      <div className="flex-0">
        <Link href="/" className="btn btn-ghost text-xl flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13" />
          </svg>
          <span className="hidden sm:inline">KumpuLink</span>
        </Link>
      </div>

      {/* KANAN: Menu */}
      <div className="flex flex-justify-between gap-2">
        {/* Tombol Lihat Profil (Hanya muncul di dashboard) */}
        {isDashboard && origin && username && (
          <a href={`${origin}/${username}`} target="_blank" className="btn btn-primary btn-sm rounded-field mt-1 hidden md:flex">
            Lihat Profil ✨
          </a>
        )}

        {/* Dropdown User */}
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full bg-neutral text-neutral-content flex items-center justify-center">
              {/* Menampilkan inisial jika tidak ada foto */}
              {profileImage ? <img src={profileImage} alt={username} className="object-cover" /> : <img src={`https://ui-avatars.com/api/?name=${username}&background=random`} alt={username} />}
            </div>
          </div>
          <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
            <li className="menu-title px-4 py-2 opacity-60">Halo, {username || 'Pengguna'}</li>
            <div className="divider my-0"></div>
            {/* Mobile-only Lihat Profil */}
            <li className="md:hidden">
              <a href={`${origin}/${username}`} target="_blank">
                Lihat Halaman Publik
              </a>
            </li>
            {/* <li>
              <Link href="/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link href="/dashboard/settings">Pengaturan</Link>
            </li> */}
            <li>
              <button onClick={handleLogout} className="text-error font-semibold">
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
