import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Layout ini HANYA berlaku untuk halaman di dalam grup (app)
export default function AppLayout({ children }) {
  return (
    <div data-theme="default" className="flex flex-col min-h-screen antialiased  md:bg-base-100">
      <Navbar />

      <main className="flex-grow max-w-4xl mx-auto p-4 flex items-center justify-center ">{children}</main>

      <Footer />
    </div>
  );
}
