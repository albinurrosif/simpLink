'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/authcontext';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [alertInfo, setAlertInfo] = useState(null); // { type: 'success' | 'error', message: '...' } | null

  useEffect(() => {
    if (!authLoading && user) {
      router.push('/dashboard');
    }
  }, [user, authLoading, router]);

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

  // Efek untuk menghilangkan alert setelah beberapa detik
  useEffect(() => {
    if (alertInfo) {
      const timer = setTimeout(() => {
        setAlertInfo(null);
      }, 3000); // Hilang setelah 3 detik
      return () => clearTimeout(timer); // Bersihkan timer jika komponen unmount
    }
  }, [alertInfo]);

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
