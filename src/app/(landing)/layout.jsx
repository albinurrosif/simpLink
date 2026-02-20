// app/(landing)/layout.jsx
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '../components/Navbar'; // Kita bisa pakai ulang Navbar yang sama
import Footer from '../components/Footer'; // Kita bisa pakai ulang Footer yang sama



// Layout ini HANYA untuk landing page
export default function LandingLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen antialiased">
      {/* <Navbar /> */}
      <main className="flex-grow flex flex-col">
        {children}
      </main>
      <Footer />
    </div>
  );
}
