'use client';

import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
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
