// Layout ini HANYA berlaku untuk halaman di dalam grup (public)
export default function PublicLayout({ children }) {
  return (
    // Layout ini akan menengahkan konten (seperti /Bee atau /)
    // dan memberikan latar belakang gelap seperti Linktree
    <div className="flex flex-col min-h-screen items-center justify-center bg-base-300 p-4">{children}</div>
  );
}
