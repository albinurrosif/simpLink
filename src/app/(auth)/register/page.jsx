'use client';

import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';
import { useAuth } from '@/context/authcontext';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  // ==================== HOOKS EXTERNAL ====================
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  // ==================== STATE MANAGEMENT ====================
  // 🟢 FORM INPUT STATES
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  // 🟢 LOADING & UI STATES
  const [loading, setLoading] = useState(false);
  const [alertInfo, setAlertInfo] = useState(null);
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
  // Efek untuk menghilangkan alert
  useEffect(() => {
    if (alertInfo) {
      const timer = setTimeout(() => {
        setAlertInfo(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [alertInfo]);

  // ==================== FUNCTIONS ====================
  // 🟠 FORM HANDLING FUNCTIONS
  const handleSubmit = async (event) => {
    event.preventDefault(); // Mencegah reload form
    if (loading) return;

    if (!username || username.length < 1 || username.length > 20) {
      setAlertInfo({ type: 'error', message: 'Username harus antara 3 dan 20 karakter.' });
      return; // Hentikan proses jika tidak valid
    }
    // Opsional: Cek karakter yang valid (misal hanya huruf, angka, underscore)
    const validUsernameRegex = /^[a-zA-Z0-9_\-]+$/;

    if (!validUsernameRegex.test(username)) {
      setAlertInfo({ type: 'error', message: 'Username hanya boleh huruf, angka, underscore (_) dan strip (-)' });
      return;
    }

    setLoading(true);
    setAlertInfo(null);
    console.log('form data:', { email, password });

    try {
      const userRef = collection(db, 'users');
      const q = query(userRef, where('username', '==', username));
      const querySnapShot = await getDocs(q);

      if (!querySnapShot.empty) {
        // username sudah ada
        setAlertInfo({ type: 'error', message: `Username "${username}" sudah dipakai orang lain` });
        setUsernameCheckLoading(false);
        return;
      }

      // 3. Update irestore jika valid
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        username: username,
      });

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('Berhasil Daftar', userCredential.user);
      setAlertInfo({ type: 'success', message: 'Pendaftaran berhasil!' });
      const docRef = await setDoc(doc(db, 'users', userCredential.user.uid), {
        username: username,
        email: email,
        createdAt: new Date(),
      });
      console.log('User document created with ID: ', userCredential.user.uid);

      // Reset form
      setEmail('');
      setPassword('');
    } catch (error) {
      console.error('Gagal Daftar:', error);
      let errorMessage = 'Gagal daftar. Silakan coba lagi.'; // Pesan default
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Email sudah terdaftar! Silakan login atau gunakan email lain.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password terlalu lemah. Minimal 6 karakter.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Format email tidak valid.';
      }

      setAlertInfo({ type: 'error', message: errorMessage });
    } finally {
      // Jangan langsung setLoading(false) jika ingin jeda setelah sukses
      // setLoading(false); // Dipindah ke dalam setTimeout jika perlu
      if (!error) {
        // Jika tidak ada error (sukses)
        // Biarkan loading sampai redirect atau reset form
      } else {
        setLoading(false); // Hanya set false jika terjadi error
      }
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

  return (
    <div className="card w-full max-w-sm shrink-0 shadow-2xl bg-base-100 rounded-lg">
      <form onSubmit={handleSubmit} className="card-body">
        <h1 className="text-2xl font-bold">Register</h1>
        {alertInfo && (
          <div role="alert" className={`alert ${alertInfo.type === 'error' ? 'alert-error' : 'alert-success'} mb-4`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2 2m2-2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{alertInfo.message}</span>
          </div>
        )}
        <input
          className="input input-bordered w-full mb-4"
          type="text"
          name="username"
          placeholder="Username (1-20 karakter, huruf, angka, -, _)"
          required // Makes the field mandatory
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          minLength={1} // Minimum length
          maxLength={20} // Maximum length
          pattern="^[a-zA-Z0-9_\-]+$" // Allowed characters (escaped hyphen)
          title="Hanya huruf, angka, underscore (_), dan strip (-)" // Tooltip on invalid pattern
        />
        <input className="input input-bordered w-full mb-4" type="email" name="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="input input-bordered w-full mb-4" type="password" name="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="btn btn-primary w-full rounded-lg" type="submit" disabled={loading}>
          {loading ? 'Memproses...' : 'Daftar'}
        </button>
        <div className="divider">Atau</div>
        {/* Google */}
        <button
          type="button" // Important: type="button" to prevent form submission
          className="btn bg-white text-black border-[#e5e5e5] w-full rounded-lg hover:bg-gray-100"
          onClick={handleGoogleSignIn} // 3. Call the function on click
          disabled={googleLoading} // Disable while loading
          formNoValidate
        >
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
          Sudah punya akun?{' '}
          <Link href="/login" className="link link-primary">
            Masuk di sini
          </Link>
        </p>
      </form>
    </div>
  );
}
