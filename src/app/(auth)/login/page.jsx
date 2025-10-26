'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/authcontext';
import { auth } from '@/lib/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  // ==================== HOOKS EXTERNAL ====================
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  // ==================== STATE MANAGEMENT ====================
  // 🟢 FORM INPUT STATES
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // 🟢 LOADING & UI STATES
  const [loading, setLoading] = useState(false);
  const [alertInfo, setAlertInfo] = useState(null); // { type: 'success' | 'error', message: '...' } | null
  const [googleLoading, setGoogleLoading] = useState(false);

  // ==================== EFFECTS ====================
  // 🔵 AUTH REDIRECT EFFECT
  // Redirect ke dashboard jika user sudah login
  useEffect(() => {
    if (!authLoading && user) {
      router.push('/dashboard');
    }
  }, [user, authLoading, router]);

  // 🔵 AUTO-HIDE ALERT EFFECT
  // Efek untuk menghilangkan alert setelah beberapa detik
  useEffect(() => {
    if (alertInfo) {
      const timer = setTimeout(() => {
        setAlertInfo(null);
      }, 3000); // Hilang setelah 3 detik
      return () => clearTimeout(timer); // Bersihkan timer jika komponen unmount
    }
  }, [alertInfo]);

  // ==================== FUNCTIONS ====================
  // 🟠 FORM HANDLING FUNCTIONS
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (loading) return;
    setLoading(true);
    setAlertInfo(null);

    console.log('form data:', { email, password });

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('Berhasil Masuk', userCredential.user);
      router.push('/dashboard');
    } catch (error) {
      console.error('Gagal Masuk:', error);
      setAlertInfo({ type: 'error', message: 'Login gagal. Periksa email dan password Anda.' });
    } finally {
      setLoading(false);
    }
  };

 const handleGoogleSignIn = async () => {
   setGoogleLoading(true);
   setAlertInfo(null);
   const provider = new GoogleAuthProvider();

   try {
     const result = await signInWithPopup(auth, provider);
     const user = result.user; // Data dari Google/Firebase Auth
     console.log('Google Sign-In/Up Successful:', user);

     // === Logika Upsert (Update atau Insert) Data Pengguna ===

     const userDocRef = doc(db, 'users', user.uid);
     const docSnap = await getDoc(userDocRef);

     if (!docSnap.exists()) {
       // KASUS 1: PENGGUNA BARU
       // Buat dokumen baru dengan SEMUA data dari Google
       await setDoc(userDocRef, {
         email: user.email,
         photoURL: user.photoURL, // Simpan foto
         displayName: user.displayName, // Simpan nama tampilan
         createdAt: new Date(),
         // username akan disetup di dasbor
       });
       console.log('Dokumen pengguna baru dibuat.');

       // Arahkan ke setup username
       router.push('/dashboard?setupUsername=true');
     } else {
       // KASUS 2: PENGGUNA LAMA
       // Dokumen sudah ada, cukup update photoURL
       // (email/pass user atau Google user yg kembali)
       await updateDoc(userDocRef, {
         photoURL: user.photoURL, // Update foto profil
         displayName: user.displayName, // Update nama tampilan
       });
       console.log('Profil pengguna diperbarui dengan foto Google.');

       // Sekarang cek apakah mereka punya username
       if (docSnap.data()?.username) {
         // Jika sudah punya username, langsung ke dasbor
         router.push('/dashboard');
       } else {
         // Jika belum punya username, kirim ke setup
         router.push('/dashboard?setupUsername=true');
       }
     }
   } catch (error) {
     console.error('Google Sign-In Error:', error);
     if (error.code === 'auth/account-exists-with-different-credential') {
       setAlertInfo({ type: 'error', message: 'Email ini sudah terdaftar dengan metode login lain (Email/Password).' });
     } else {
       setAlertInfo({ type: 'error', message: 'Gagal login dengan Google. Coba lagi.' });
     }
     setGoogleLoading(false);
   }
   // Tidak perlu setLoading(false) di sini karena redirect terjadi di try block
 };

  // ==================== RENDER LOGIC ====================

  return (
    <div className="card w-full max-w-sm shrink-0 shadow-2xl bg-base-100 rounded-lg">
      <form onSubmit={handleSubmit} className="card-body">
        <h1 className="text-2xl font-bold">Login</h1>

        {alertInfo && (
          <div role="alert" className={`alert ${alertInfo.type === 'error' ? 'alert-error' : 'alert-success'} mb-4`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2 2m2-2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{alertInfo.message}</span>
          </div>
        )}
        <input className="input input-bordered w-full mb-4" type="email" name="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="input input-bordered w-full mb-4" type="password" name="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="btn btn-primary w-full rounded-lg" type="submit" disabled={loading}>
          {loading ? 'Memproses...' : 'Masuk'}
        </button>
        <div className="divider">Atau</div>
        {/* Google */}
        <button type="button" className="btn bg-white text-black border-[#e5e5e5] w-full rounded-lg hover:bg-gray-100" onClick={handleGoogleSignIn} disabled={googleLoading} formNoValidate>
          {googleLoading ? (
            <span className="loading loading-spinner loading-xs"></span>
          ) : (
            <svg aria-label="Google logo" width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <g>
                <path d="m0 0H512V512H0" fill="#fff"></path>
                <path fill="#34a853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"></path>
                <path fill="#4285f4" d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"></path>
                <path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"></path>
                <path fill="#ea4335" d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"></path>
              </g>
            </svg>
          )}
          {googleLoading ? 'Memproses...' : 'Lanjutkan dengan Google'}
        </button>
        <p className="text-center mt-4 text-sm">
          Belum punya akun?{' '}
          <Link href="/register" className="link link-primary">
            Daftar di sini
          </Link>
        </p>
      </form>
    </div>
  );
}
