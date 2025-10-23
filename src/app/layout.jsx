import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/authcontext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { GoogleAnalytics } from '@next/third-parties/google';
import { Analytics } from '@vercel/analytics/next';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata = {
  title: 'SimpLink',
  description: 'Your simple link-in-bio solution',
  verification: { google: 'FMrUmPZzKPul48fYnMY8yGvJbZC5hJpp7v1vQ-mjfow' },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`} data-theme="dracula">
      <body className="flex flex-col min-h-screen antialiased">
        <AuthProvider>
          <Navbar />

          <main className="flex-grow max-w-4xl mx-auto p-4 w-full flex items-center justify-center">{children}</main>
          <Footer />
        </AuthProvider>
        <GoogleAnalytics gaId="G-W82L36K240" />
      </body>
    </html>
  );
}
