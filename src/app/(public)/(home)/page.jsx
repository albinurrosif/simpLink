'use client';

import Image from 'next/image';
import { auth, db } from '@/lib/firebase';
import Link from 'next/link';

export default function Home() {
  console.log('Firebase Auth:', auth);
  console.log('Firestore DB:', db);
  return (
    <div className="hero  bg-base-200 rounded-lg max-w-7xl mx-auto p-4">
      <div className="hero-content text-center">
        <div className="">
          {/* Judul Utama */}
          <h1 className="text-5xl font-bold text-primary">KumpuLink</h1>
          {/* Deskripsi Singkat */}
          <p className="py-6">Satu link sederhana untuk semua konten penting Anda. Bagikan portofolio, media sosial, dan lainnya dengan mudah.</p>
          {/* Tombol Call to Action (CTA) */}
          <div className="space-x-4">
            <Link href="/register" className="btn btn-primary rounded-lg  text-base-300">
              Mulai Gratis
            </Link>
            <Link href="/login" className="btn btn-ghost rounded-lg">
              Sudah Punya Akun?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
