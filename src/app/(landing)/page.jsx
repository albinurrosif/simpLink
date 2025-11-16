'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      {/* 1. Gunakan 'min-h-[calc(100vh-4.5rem)]' untuk mengisi sisa layar
           (tinggi layar - tinggi navbar). Sesuaikan '4.5rem' jika tinggi navbar Anda beda.
           'bg-base-200' sudah bagus.
      */}
      <div className="hero min-h-[calc(100vh-4.5rem)] bg-base-200">
        {/* 2. 'hero-content' sudah benar: 'flex-col' (mobile) -> 'lg:flex-row-reverse' (desktop) */}

        <div className="hero-content flex-col lg:flex-row gap-8 lg:gap-16">
          <div className="max-w-md  text-center lg:text-left pt-20 lg:-mt-30">
            {/* 5. Ganti H1 dengan Logo Anda (sudah ada di folder 'public') */}
            <h1 className="text-7xl  font-bold">KumpuLink</h1>
            <p className="text-xl py-10">Satu link sederhana untuk semua konten penting Anda. Bagikan portofolio, media sosial, dan lainnya dengan mudah.</p>
            <div className="space-x-4">
              {/* 6. Perbaiki warna tombol primary */}
              <Link href="/register" className="btn btn-primary rounded-lg text-primary-content">
                Mulai Gratis
              </Link>
              <Link href="/login" className="btn btn-ghost rounded-lg">
                Sudah Punya Akun?
              </Link>
            </div>
          </div>
          <div className="mockup-phone border-primary scale-75 sm:scale-90 lg:scale-90">
            <div className="camera"></div>
            <div className="display">
              <div className="artboard artboard-demo phone-2">
                <img src="/kumpulink.vercel.app_Bee(iPhone 14 Pro Max) (2).png" alt="Screenshot Kumpulink" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>

          {/* 4. Konten Teks: 
                Hapus 'flex-2' dan '-mt-25'.
                Gunakan 'text-center' di mobile dan 'lg:text-left' di desktop.
          */}
        </div>
      </div>
    </>
  );
}
