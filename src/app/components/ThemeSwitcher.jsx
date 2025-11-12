'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/authcontext';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const themes = [
  'light',
  'dark',
  'cupcake',
  'bumblebee',
  'emerald',
  'corporate',
  'synthwave',
  'retro',
  'cyberpunk',
  'valentine',
  'halloween',
  'garden',
  'forest',
  'aqua',
  'lofi',
  'pastel',
  'fantasy',
  'wireframe',
  'black',
  'luxury',
  'dracula',
  'cmyk',
  'autumn',
  'business',
  'acid',
  'lemonade',
  'night',
  'coffee',
  'winter',
  'dim',
  'nord',
  'sunset',
  'caramellatte',
  'abyss',
  'silk',
];

export default function ThemeSwitcher() {
  const { user } = useAuth();
  const [currentTheme, setCurrentTheme] = useState('default');
  const [savingTheme, setSavingTheme] = useState(false);
  const [alertInfo, setAlertInfo] = useState(null);

  useEffect(() => {
    const fetchUserTheme = async () => {
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().theme) {
          const userTheme = docSnap.data().theme;
          setCurrentTheme(userTheme);

          document.documentElement.setAttribute('data-theme', userTheme);
        } else {
          document.documentElement.setAttribute('data-theme', 'default');
        }
      }
    };
    fetchUserTheme();
  }, [user]);

  useEffect(() => {
    const defaultTheme = 'default';

    // Fungsi 'cleanup' ini akan berjalan SAAT KOMPONEN UNMOUNT
    return () => {
      document.documentElement.setAttribute('data-theme', defaultTheme);
    };
  }, []);

  const handleThemeChange = async (newTheme) => {
    if (!user || savingTheme) return;
    setSavingTheme(true);
    setCurrentTheme(newTheme);

    document.documentElement.setAttribute('data-theme', newTheme);

    try {
      const docRef = doc(db, 'users', user.uid);
      await updateDoc(docRef, {
        theme: newTheme,
      });

      //   setUserProfile((prev) => ({ ...prev, theme: newTheme }));
      setAlertInfo({ type: 'success', message: 'Tema berhasil disimpan' });
      setTimeout(() => setAlertInfo(null), 2000);
    } catch (err) {
      setAlertInfo({ type: 'error', message: 'Gagal menyimpan tema' });
      setTimeout(() => setAlertInfo(null), 2000);
    } finally {
      setSavingTheme(false);
    }
  };

  return (
    <div className="dropdown mb-4">
      <div className="btn m-1 rounded-xl" tabIndex={0} role="button">
        Ganti Tema
        <svg width="12px" height="12px" className="inline-block h-2 w-2 fill-current opacity-60" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2048 2048">
          <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path>
        </svg>
      </div>

      {/*daftar tema digenerate otomatis di array 'themes' */}
      <ul tabIndex={0} className="dropdown-content bg-base-300 rounded-box z-[1] w-52 shadow-2xl max-h-60 overflow-y-auto">
        {themes.map((themeName) => (
          <li key={themeName}>
            <input
              type="radio"
              name="theme-dropdown"
              className="theme-controller w-full btn btn-sm btn-block btn-ghost justify-start"
              aria-label={themeName.charAt(0).toUpperCase() + themeName.slice(1)}
              value={themeName}
              checked={currentTheme === themeName}
              onChange={(event) => handleThemeChange(event.target.value)}
              disabled={savingTheme}
            />
          </li>
        ))}
      </ul>
      {/* Tampilkan notifikasi alert kecil */}
      {alertInfo && (
        <div className={`alert ${alertInfo.type === 'error' ? 'alert-error' : 'alert-success'} text-xs p-2 mt-2`}>
          <span>{alertInfo.message}</span>
        </div>
      )}
    </div>
  );
}
