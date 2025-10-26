'use client';

import Link from 'next/link';
import { useAuth } from '@/context/authcontext';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { useState } from 'react';
import Image from 'next/image';

export default function Navbar() {
  // ==================== HOOKS EXTERNAL ====================
  const { user } = useAuth();
  const router = useRouter();

  // ==================== STATE MANAGEMENT ====================
  // 🟢 MODAL STATES
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // ==================== FUNCTIONS ====================
  // 🟠 AUTH FUNCTIONS
  // LogOut
  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // 🟠 MODAL HANDLING FUNCTIONS
  // Fungsi untuk membuka modal logout
  const openLogoutModal = () => {
    setShowLogoutModal(true);
  };

  // Fungsi untuk konfirmasi dan logout
  const confirmLogout = async () => {
    await handleLogout(); // Panggil fungsi logout yang sudah ada
    setShowLogoutModal(false); // Tutup modal setelah logout
  };

  // Helper untuk mendapatkan inisial
  const getInitials = (name) => {
    if (!name) return '?';
    return name.charAt(0).toUpperCase();
  };

  // ==================== RENDER LOGIC ====================

  return (
    <div className="navbar bg-base-100 shadow-md">
      {/* 1. Branding / Logo (Kiri) */}
      <div className="navbar-start">
        <Link href="/" className="btn btn-ghost text-xl">
          <Image
            src="/Screenshot_2025-10-23_085504-removebg-preview.png" // <-- 3. Path relatif ke public folder (ganti nama file)
            alt="Kumpulink Logo"
            width={100}
            height={30}
            priority // Opsional: Prioritaskan loading logo
          />{' '}
          KumpuLink
        </Link>
      </div>

      {/* 2. Link Navigasi (Kanan) */}
      <div className="navbar-end">
        {/* === Menu untuk Desktop (JIKA SUDAH LOGIN) === */}
        {user ? (
          <div className="dropdown dropdown-end hidden md:flex">
            {/* Avatar Pengguna sebagai Tombol Dropdown */}
            <label tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                {user.photoURL ? (
                  // Jika punya foto profil (dari Google)
                  <img alt="User Avatar" src={user.photoURL} />
                ) : (
                  // Fallback jika tidak ada foto (misal daftar via email)
                  <div className="avatar placeholder">
                    <div className="bg-neutral text-neutral-content rounded-full w-10">
                      <span>{getInitials(user.email)}</span> {/* Tampilkan inisial email */}
                    </div>
                  </div>
                )}
              </div>
            </label>
            {/* Konten Dropdown Desktop */}
            <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
              {/* Perbaikan: Hapus kelas 'btn' dari item menu */}
              <li>
                <Link href="/dashboard">Dasbor</Link>
              </li>
              <li>
                <button onClick={openLogoutModal}>Logout</button>
              </li>
            </ul>
          </div>
        ) : (
          /* === Menu untuk Desktop (JIKA BELUM LOGIN) === */
          <div className="hidden md:flex items-center space-x-2">
            <Link href="/login" className="btn btn-ghost rounded-lg">
              Login
            </Link>
            <Link href="/register" className="btn btn-primary rounded-lg">
              Register
            </Link>
          </div>
        )}

        {/* === Menu Dropdown untuk Mobile (Hanya terlihat di layar kecil) === */}
        <div className="dropdown dropdown-end md:hidden">
          <button tabIndex={0} role="button" className="btn btn-ghost btn-circle">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
            {user ? (
              // Jika SUDAH login (Mobile)
              <>
                {/* Tampilkan info user di atas menu */}
                <li className="menu-title flex flex-row items-center gap-2 p-2">
                  <div className="avatar w-8 h-8">
                    <div className="w-8 rounded-full">
                      {user.photoURL ? (
                        <img alt="Avatar" src={user.photoURL} />
                      ) : (
                        <div className="avatar placeholder">
                          <div className="bg-neutral text-neutral-content rounded-full w-8">
                            <span>{getInitials(user.email)}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <span className="truncate">{user.displayName || user.email}</span>
                </li>
                <div className="divider my-0"></div> {/* Garis pemisah */}
                <li>
                  <Link href="/dashboard">Dasbor</Link>
                </li>
                <li>
                  <button onClick={openLogoutModal}>Logout</button>
                </li>
              </>
            ) : (
              // Jika BELUM login (Mobile)
              <>
                <li>
                  <Link href="/login">Login</Link>
                </li>
                <li>
                  <Link href="/register">Register</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
      {/* Modal Konfirmasi Logout */}
      {showLogoutModal && (
        <dialog id="logout_modal" className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Konfirmasi Logout</h3>
            <p className="py-4">Apakah Anda yakin ingin keluar?</p>
            <div className="modal-action">
              {/* Tombol Batal: hanya menutup modal */}
              <button className="btn rounded-lg" onClick={() => setShowLogoutModal(false)}>
                Batal
              </button>
              {/* Tombol Ya: panggil confirmLogout */}
              <button className="btn btn-error rounded-lg" onClick={confirmLogout}>
                Ya, Logout
              </button>
            </div>
          </div>
          {/* Klik di luar modal untuk menutup */}
          <form method="dialog" className="modal-backdrop">
            <button onClick={() => setShowLogoutModal(false)}>close</button>
          </form>
        </dialog>
      )}
    </div>
  );
}
