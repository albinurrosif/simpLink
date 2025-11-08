import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Layout ini HANYA berlaku untuk halaman di dalam grup (app)
export default function AppLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen antialiased">
      <Navbar />

      <main className="flex-grow max-w-4xl mx-auto p-4 flex items-center justify-center">{children}</main>

      <Footer />
    </div>
  );
}
