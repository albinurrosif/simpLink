'use client';

import { useState } from 'react';
import { auth } from '@/lib/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault(); // Mencegah reload form
    if (loading) return;

    setLoading(true);
    console.log('form data:', { email, password });

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('Berhasil Daftar', userCredential.user);
      alert('Berhasil daftar!');

      // Reset form
      setEmail('');
      setPassword('');
    } catch (error) {
      console.error('Gagal Daftar:', error);
      alert('Gagal daftar. Silakan coba lagi.');

      if (error.code === 'auth/email-already-in-use') {
        alert('Email sudah terdaftar! Silakan login atau gunakan email lain.');
      } else if (error.code === 'auth/weak-password') {
        alert('Password terlalu lemah. Minimal 6 karakter.');
      } else if (error.code === 'auth/invalid-email') {
        alert('Format email tidak valid.');
      } else {
        alert('Gagal daftar. Silakan coba lagi.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" name="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" name="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} />
      <button type="submit" disabled={loading}>
        {loading ? 'Memproses...' : 'Daftar'}
      </button>
    </form>
  );
}
