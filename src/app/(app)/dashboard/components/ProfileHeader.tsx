'use client';

import { useState, useEffect } from 'react';
import ThemeSwitcher from '@/app/components/ThemeSwitcher';

interface ProfileHeaderProps {
  username: string;
  bio: string | null;
  profileImage: string | null;
  theme: string;
  isImageLoading: boolean;
  onEditUsername: () => void;
  onSaveBio: (newBio: string) => void;
  onUploadImage: (file: File) => void;
  onCopyUrl: () => void;
  onUpdateTheme: (newTheme: string) => void;
}

export default function ProfileHeader({ username, bio, profileImage, isImageLoading, theme, onEditUsername, onSaveBio, onUploadImage, onCopyUrl, onUpdateTheme }: ProfileHeaderProps) {
  const [origin, setOrigin] = useState('');

  console.log('ProfileHeader Rendered with:', { username, bio, profileImage, isImageLoading, theme });

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  return (
    <div className="flex flex-col gap-6 mb-4 bg-base-100 p-2 rounded-2xl">
      {/* Header Utama & Foto Profil */}
      <div className="flex flex-col md:flex-row items-center gap-6">
        {/* FOTO PROFIL */}
        <div className="relative group">
          <div className="avatar">
            <div className="w-24 h-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 overflow-hidden bg-base-300">
              {profileImage ? <img src={profileImage} alt={username} className="object-cover" /> : <img src={`https://ui-avatars.com/api/?name=${username}&background=random`} alt={username} />}
            </div>
          </div>

          {/* Tampilkan Spinner jika isImageLoading true */}
          {isImageLoading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-full">
              <span className="loading loading-spinner loading-md text-primary"></span>
            </div>
          ) : (
            <label htmlFor="avatar-upload" className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white text-xs font-medium">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mb-1">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15a2.25 2.25 0 0 0 2.25-2.25V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"
                />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
              </svg>
              Ubah Foto
            </label>
          )}

          <input
            type="file"
            id="avatar-upload"
            className="hidden"
            accept="image/*"
            disabled={isImageLoading}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onUploadImage(file);
            }}
          />
        </div>

        {/* Judul Dashboard */}
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-base-content/70 text-sm mt-1">Selamat Datang, {username}!</p>
        </div>
      </div>

      {/* URL Publik */}
      <div className="bg-base-200 rounded-box p-4 flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <div className="overflow-hidden">
            <p className="text-sm font-medium">URL Publik Anda:</p>
            <span className="text-primary font-mono text-sm break-all">{origin ? `${origin}/${username}` : 'Loading...'}</span>
          </div>
          <div className="flex gap-1 justify-between items-center">
            <button onClick={onCopyUrl} className="btn btn-sm btn-ghost btn-square text-info" title="Salin URL">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75"
                />
              </svg>
            </button>
            <button onClick={onEditUsername} className="btn btn-sm btn-ghost btn-square text-info" title="Edit Username">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Bio */}
      <fieldset className="border border-base-300 rounded-box p-4">
        <legend className="px-2 text-sm font-medium text-base-content/60 italic">Bio anda (Auto-save):</legend>
        <textarea defaultValue={bio || ''} onBlur={(e) => onSaveBio(e.target.value)} className="textarea h-20 w-full bg-transparent focus:outline-none text-lg" placeholder="Tulis bio singkat kamu di sini..."></textarea>
      </fieldset>
      <ThemeSwitcher initialTheme={theme || 'light'} onThemeChange={onUpdateTheme} />
    </div>
  );
}
