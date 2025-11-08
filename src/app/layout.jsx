import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/authcontext';
import GoogleAnalytics from './components/GoogleAnalytics';
import { Analytics } from '@vercel/analytics/next';
import { Suspense } from 'react';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata = {
  title: 'Kumpulink',
  description: 'Kumpulink - Link Bio Sederhana Anda',
  verification: { google: 'FMrUmPZzKPul48fYnMY8yGvJbZC5hJpp7v1vQ-mjfow' },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`} data-theme="dim">
      <body className="antialiased">
        <AuthProvider>
          {/* {children} di sini akan menjadi (app)/layout.jsx ATAU (public)/layout.jsx,
            tergantung halaman yang diakses.
          */}
          <Suspense
            fallback={
              <div className="min-h-screen flex items-center justify-center">
                <span className="loading loading-spinner loading-lg"></span>
              </div>
            }
          >
            {children}
          </Suspense>
        </AuthProvider>
        <Suspense fallback={null}>
          <GoogleAnalytics />
        </Suspense>
        <Analytics />
      </body>
    </html>
  );
}
