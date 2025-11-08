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

  const openLogoutModal = () => setShowLogoutModal(true);
  const confirmLogout = async () => {
    await handleLogout();
    setShowLogoutModal(false);
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.charAt(0).toUpperCase();
  };

  return (
    <nav className="bg-base-100 shadow-md">
      {/* Container utama */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* KIRI: Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center space-x-2 text-xl font-semibold">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13" />
              </svg>
              <span>KumpuLink</span>
            </Link>
          </div>

          {/* KANAN: User Menu / Auth Buttons */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {/* User Info (Desktop) - HANYA di desktop */}
                <div className="hidden lg:flex flex-col items-end mr-4">
                  <span className="font-semibold text-sm">{user.displayName || 'User'}</span>
                  <span className="text-xs text-gray-500">{user.email}</span>
                </div>

                {/* Avatar Dropdown - HANYA di desktop */}
                <div className="dropdown dropdown-end hidden md:flex">
                  <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                    <div className="w-10 rounded-full">
                      {user.photoURL ? (
                        <img alt="User Avatar" src={user.photoURL} />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-neutral flex items-center justify-center">
                          <span className="text-neutral-content text-sm">{getInitials(user.email)}</span>
                        </div>
                      )}
                    </div>
                  </label>
                  <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-50 mt-3 w-52 p-2 shadow">
                    <li className="menu-title">
                      <span>Hello, {user.displayName || user.email}</span>
                    </li>
                    <li>
                      <Link href="/dashboard">Dashboard</Link>
                    </li>
                    <li>
                      <Link href="/dashboard/profile">Profile Settings</Link>
                    </li>
                    <div className="divider my-1"></div>
                    <li>
                      <button onClick={openLogoutModal}>Logout</button>
                    </li>
                  </ul>
                </div>
              </>
            ) : (
              /* Login/Register Buttons - HANYA di desktop */
              <div className="hidden md:flex items-center space-x-2">
                <Link href="/login" className="btn btn-ghost rounded-lg">
                  Login
                </Link>
                <Link href="/register" className="btn btn-primary rounded-lg">
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Menu Button - HANYA di mobile */}
            <div className="dropdown dropdown-end md:hidden">
              <button tabIndex={0} className="btn btn-ghost btn-circle">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                {user ? (
                  <>
                    <li className="menu-title flex items-center gap-2 p-2">
                      <div className="avatar">
                        <div className="w-8 rounded-full">
                          {user.photoURL ? (
                            <img alt="Avatar" src={user.photoURL} />
                          ) : (
                            <div className="bg-neutral text-neutral-content rounded-full w-8 flex items-center justify-center">
                              <span className="text-xs">{getInitials(user.email)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <span className="truncate">{user.displayName || user.email}</span>
                    </li>
                    <div className="divider my-0"></div>
                    <li>
                      <Link href="/dashboard">Dashboard</Link>
                    </li>
                    <li>
                      <Link href="/dashboard/links">My Links</Link>
                    </li>
                    <li>
                      <Link href="/dashboard/profile">Profile</Link>
                    </li>
                    <li>
                      <button onClick={openLogoutModal}>Logout</button>
                    </li>
                  </>
                ) : (
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
        </div>
      </div>

      {/* Modal Logout */}
      {showLogoutModal && (
        <dialog className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Konfirmasi Logout</h3>
            <p className="py-4">Apakah Anda yakin ingin keluar?</p>
            <div className="modal-action">
              <button className="btn" onClick={() => setShowLogoutModal(false)}>
                Batal
              </button>
              <button className="btn btn-error" onClick={confirmLogout}>
                Ya, Logout
              </button>
            </div>
          </div>
          <div className="modal-backdrop" onClick={() => setShowLogoutModal(false)}></div>
        </dialog>
      )}
    </nav>
  );
}
