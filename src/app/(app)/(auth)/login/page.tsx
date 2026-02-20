'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Definisikan tipe untuk Alert
interface AlertInfo {
  type: 'success' | 'error';
  message: string;
}

export default function LoginPage() {
  const router = useRouter();

  // ==================== STATE MANAGEMENT ====================
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [alertInfo, setAlertInfo] = useState<AlertInfo | null>(null);
  const [success, setSuccess] = useState(false);

  // ==================== EFFECTS ====================
  // Auto-hide alert setelah 3 detik
  useEffect(() => {
    if (alertInfo) {
      const timer = setTimeout(() => setAlertInfo(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [alertInfo]);

  // ==================== FUNCTIONS ====================
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (loading) return;
    setLoading(true);
    setAlertInfo(null);

    try {
      // Panggil API Login internal kita
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: identifier, // identifier bisa email atau username tergantung service Anda
          password,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || 'Login gagal. Periksa email dan password Anda.');
      }

      // Berhasil: Middleware/Browser otomatis menyimpan Cookie
      setAlertInfo({ type: 'success', message: 'Berhasil masuk! Mengalihkan...' });

      router.push('/dashboard');

      setSuccess(true);
    } catch (error: any) {
      setAlertInfo({ type: 'error', message: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card w-full max-w-sm shrink-0 shadow-2xl bg-base-100 rounded-lg">
      <form onSubmit={handleSubmit} className="card-body">
        <h1 className="text-2xl font-bold">Login</h1>

        {alertInfo && (
          <div role="alert" className={`alert ${alertInfo.type === 'error' ? 'alert-error' : 'alert-success'} mb-4 p-2 text-sm`}>
            <span>{alertInfo.message}</span>
          </div>
        )}

        <div className="form-control">
          <label className="label">
            <span className="label-text">Email atau Username</span>
          </label>
          <input
            className="input input-bordered w-full mb-4"
            type="text" // Gunakan text agar bisa input username
            required
            value={identifier} // Anda bisa menamai state ini 'identifier' agar lebih tepat
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="username atau email@email.com"
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Password</span>
          </label>
          <input className="input input-bordered w-full mb-4" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
        </div>

        <button className="btn btn-primary w-full rounded-lg" type="submit" disabled={loading || success}>
          {loading ? <span className="loading loading-spinner loading-xs"></span> : 'Masuk'}
        </button>

        <div className="divider">Atau</div>

        {/* Tombol Google dinonaktifkan sementara karena kita belum buat flow Google-OAuth ke Postgres */}
        <button type="button" className="btn btn-outline w-full rounded-lg opacity-50 cursor-not-allowed" disabled>
          Lanjutkan dengan Google (Soon)
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
