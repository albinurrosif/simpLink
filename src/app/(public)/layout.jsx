// Layout ini HANYA berlaku untuk halaman di dalam grup (public)
export default function PublicLayout({ children }) {
  return (
    // Layout ini akan menengahkan konten (seperti /Bee atau /)
    // dan memberikan latar belakang gelap seperti Linktree
    <div className="flex flex-col min-h-screen bg-base-100 md:bg-base-300 p-10 ">
      <div className="flex-1 flex flex-col items-center justify-start pt-20 pb-4">
        <div className="w-full max-w-lg mx-auto md:relative md:bg-base-100  md:rounded-3xl md:shadow-2xl md:p-20 md:border md:border-base-300">{children}</div>
      </div>
    </div>
  );
}
