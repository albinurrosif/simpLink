'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="bg-base-100">
      {/* HERO SECTION */}
      <section className="hero min-h-[90vh] bg-base-200">
        <div className="hero-content flex-col lg:flex-row gap-12">
          <div className="text-center lg:text-left">
            <h1 className="text-6xl lg:text-7xl font-black text-primary leading-tight">
              KumpuLink
            </h1>
            <p className="py-6 text-xl opacity-80 max-w-md">
              Satu link sederhana untuk semua konten penting Anda. Bagikan portofolio, media sosial, dan lainnya dalam satu halaman cantik.
            </p>
            <div className="flex flex-wrap justify-center lg:justify-start gap-4">
              <Link href="/register" className="btn btn-primary btn-lg rounded-2xl shadow-lg">
                Mulai Gratis Sekarang
              </Link>
              <Link href="/login" className="btn btn-ghost btn-lg rounded-2xl">
                Masuk Akun
              </Link>
            </div>
          </div>
          
          <div className="mockup-phone border-primary shadow-2xl scale-90 hidden sm:block">
            <div className="camera"></div>
            <div className="display">
              <div className="artboard artboard-demo phone-1">
                <img 
                  src="/kumpulink.vercel.app_Bee(iPhone 14 Pro Max) (2).png" 
                  alt="Preview" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STEPS SECTION (Copy-Paste DaisyUI Steps) */}
      <section className="py-20 px-4 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Hanya butuh 1 menit</h2>
        <div className="flex justify-center">
          <ul className="steps steps-vertical lg:steps-horizontal w-full">
            <li className="step step-primary font-medium">Daftar Akun</li>
            <li className="step step-primary font-medium">Input Link & Sosmed</li>
            <li className="step step-primary font-medium">Kustomisasi Tema</li>
            <li className="step step-primary font-medium">Sebarkan URL!</li>
          </ul>
        </div>
      </section>

      {/* FEATURES GRID (Simple Cards) */}
      <section className="bg-base-200 py-20 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body items-center text-center">
              <div className="bg-primary/10 p-4 rounded-full text-primary mb-2">🚀</div>
              <h2 className="card-title">Gratis</h2>
              <p className="text-sm opacity-70">Tidak ada biaya untuk membuat dan mengelola link Anda.</p>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body items-center text-center">
              <div className="bg-secondary/10 p-4 rounded-full text-secondary mb-2">📊</div>
              <h2 className="card-title">Real-time Analytics</h2>
              <p className="text-sm opacity-70">Pantau berapa banyak orang yang mengklik setiap link Anda.</p>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body items-center text-center">
              <div className="bg-accent/10 p-4 rounded-full text-accent mb-2">🎨</div>
              <h2 className="card-title">Tema Kustom</h2>
              <p className="text-sm opacity-70">Pilih tema yang sesuai dengan personal branding Anda.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-20 text-center px-4">
        <h2 className="text-4xl font-bold mb-6">Siap untuk go online?</h2>
        <Link href="/register" className="btn btn-primary btn-wide rounded-full">
          Dapatkan Link Anda Sekarang
        </Link>
      </section>
    </div>
  );
}