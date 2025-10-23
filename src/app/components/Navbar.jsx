'use client';

import Link from 'next/link';
import { useAuth } from '@/context/authcontext';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { useState } from 'react';

export default function Navbar() {
  const { user } = useAuth();
  const router = useRouter();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Fungsi untuk membuka modal logout
  const openLogoutModal = () => {
    setShowLogoutModal(true);
  };

  // Fungsi untuk konfirmasi dan logout
  const confirmLogout = async () => {
    await handleLogout(); // Panggil fungsi logout yang sudah ada
    setShowLogoutModal(false); // Tutup modal setelah logout
  };

  return (
    <div className="navbar bg-base-100 shadow-md">
      {/* 1. Branding / Logo (Kiri) */}
      <div className="navbar-start">
        <Link href="/" className="btn btn-ghost text-xl">
          KumpuLink
        </Link>
      </div>

      {/* 2. Link Navigasi (Kanan) */}
      <div className="navbar-end">
        {/* === Menu untuk Desktop (Terlihat di layar sedang ke atas) === */}
        <div className="hidden md:flex items-center space-x-2">
          {user ? (
            // Jika SUDAH login
            <>
              <Link href="/dashboard" className="btn btn-ghost rounded-lg">
                Dashboard
              </Link>
              <button onClick={openLogoutModal} className="btn btn-primary rounded-lg">
                Logout
              </button>
            </>
          ) : (
            // Jika BELUM login
            <>
              <Link href="/login" className="btn btn-ghost rounded-lg">
                Login
              </Link>
              <Link href="/register" className="btn btn-primary rounded-lg">
                Register
              </Link>
            </>
          )}
        </div>

        {/* === Menu Dropdown untuk Mobile (Hanya terlihat di layar kecil) === */}
        <div className="dropdown dropdown-end md:hidden">
          {/* Tombol Hamburger */}
          <button tabIndex={0} role="button" className="btn btn-ghost btn-circle">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          {/* Konten Dropdown */}
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
            {user ? (
              // Jika SUDAH login
              <>
                <li>
                  <Link href="/dashboard">Dashboard</Link>
                </li>
                <li>
                  <button onClick={openLogoutModal}>Logout</button>
                </li>
              </>
            ) : (
              // Jika BELUM login
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
