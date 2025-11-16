// Layout ini HANYA berlaku untuk halaman di dalam grup (public)
export default async function PublicLayout({ children }) {
  return (
    // Layout ini akan menengahkan konten (seperti /Bee atau /)
    // dan memberikan latar belakang gelap seperti Linktree
    <div data-theme="default" className="flex flex-col min-h-screen bg-base-100 md:bg-base-100 ">
      <div className=" flex flex-col items-center justify-start pt-20 md:pt-10 pb-4 p-4">
        <div className="w-full max-w-lg mx-auto md:relative md:bg-base-300  md:rounded-3xl md:p-20 md:border md:border-base-100">{children}</div>
      </div>
    </div>
  );
}
