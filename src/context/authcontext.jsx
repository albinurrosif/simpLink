'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';

// 1. Membuat Context
const AuthContext = createContext({
  user: null,
  loading: true,
});

// 2. Membuat Komponen Provider
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 3. Membuat listener dari Firebase
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Pengguna berhasil login
        setUser(user);
      } else {
        // Pengguna logout
        setUser(null);
      }
      setLoading(false);
    });

    // 4. Membersihkan listener saat komponen tidak lagi digunakan
    return () => unsubscribe();
  }, []);

  const value = { user, loading };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// 5. Membuat hook custom untuk mempermudah penggunaan context
export function useAuth() {
  return useContext(AuthContext);
}
