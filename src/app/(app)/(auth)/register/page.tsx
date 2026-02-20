'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast'; // Pastikan kamu sudah install react-hot-toast

export default function RegisterPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Gagal mendaftar');
      }

      toast.success('Pendaftaran berhasil! Mengalihkan...');
      
      // Karena API sudah menset cookie 'auth_token', 
      // kita tinggal redirect ke dashboard
      router.push('/dashboard');
      router.refresh(); // Memastikan state server diperbarui
    } catch (err: any) {
      console.error('Registration Error:', err);
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 p-4">
      <div className="card w-full max-w-sm shrink-0 shadow-2xl bg-base-100 rounded-2xl">
        <form onSubmit={handleSubmit} className="card-body">
          <h1 className="text-3xl font-bold text-center mb-4 text-primary">KumpuLink</h1>
          <p className="text-center text-base-content/60 mb-6">Buat akun gratis kamu sekarang</p>

          {error && (
            <div role="alert" className="alert alert-error mb-4 py-2 text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2 2m2-2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <div className="form-control mb-2">
            <label className="label text-xs font-bold uppercase tracking-wider text-base-content/50">Username</label>
            <input
              className="input input-bordered focus:input-primary"
              type="text"
              placeholder="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s/g, ''))}
            />
          </div>

          <div className="form-control mb-2">
            <label className="label text-xs font-bold uppercase tracking-wider text-base-content/50">Email</label>
            <input 
              className="input input-bordered focus:input-primary" 
              type="email" 
              placeholder="nama@email.com" 
              required 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
            />
          </div>

          <div className="form-control mb-6">
            <label className="label text-xs font-bold uppercase tracking-wider text-base-content/50">Password</label>
            <input 
              className="input input-bordered focus:input-primary" 
              type="password" 
              placeholder="••••••••" 
              required 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
            />
          </div>

          <button className="btn btn-primary w-full rounded-xl text-lg" type="submit" disabled={loading}>
            {loading ? <span className="loading loading-spinner"></span> : 'Daftar Sekarang'}
          </button>

          <div className="divider text-xs text-base-content/40">ATAU</div>

          <p className="text-center text-sm">
            Sudah punya akun?{' '}
            <Link href="/login" className="link link-primary font-bold">
              Masuk
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}