import { getPublicProfile } from '@/lib/modules/public/public.service';
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import Link from 'next/link';

import ShareButton from '../components/ShareButton';
import PublicLinkCard from '../components/PublicLinkCard';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export default async function UserPage({ params }: { params: { username: string } }) {
  const { username } = await params;
  const data = await getPublicProfile(username);

  if (!data) notFound();

  // Ambil token untuk cek kepemilikan
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  let isOwner = false;
  if (token) {
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      isOwner = Number(payload.userId) === data.user.id;
    } catch (e) {
      isOwner = false;
    }
  }

  const { user, links } = data;

  return (
   
    <div data-theme={user.theme || 'light'} className="min-h-screen bg-base-100 flex flex-col items-center justify-start pt-20 md:pt-10 pb-4 p-4 transition-colors duration-300">
      <div className="w-full max-w-lg mx-auto md:relative md:bg-base-300 md:rounded-3xl md:p-12 md:border md:border-base-200 shadow-sm flex flex-col items-center">
        <ShareButton />

        {isOwner && (
          <div className="fixed bottom-6 right-6 z-50">
            <Link href="/dashboard" className="btn btn-primary shadow-lg rounded-full gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                />
              </svg>
              Edit Dashboard
            </Link>
          </div>
        )}

        {/* Avatar Section */}
        <div className="avatar mb-4">
          <div className="w-24 h-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
            {user.profileImage ? (
              <img src={user.profileImage} alt={user.username} />
            ) : (
              <div className="bg-neutral text-neutral-content flex items-center justify-center h-full w-full uppercase text-3xl font-bold">{user.username.charAt(0)}</div>
            )}
          </div>
        </div>

        <h1 className="text-3xl font-bold text-base-content">{user.username}</h1>
        {user.bio && <p className="text-md text-base-content/80 mt-2 text-center max-w-xs italic leading-relaxed">'{user.bio}'</p>}

        {/* Link Buttons */}
        <ul className="w-full space-y-4 mt-8 px-4">
          {links.map((link) => (
            <PublicLinkCard key={link.id} id={link.id} url={link.url} title={link.title} />
          ))}
        </ul>

        {/* Footer Branding */}
        <div className="mt-12 opacity-70 hover:opacity-100 transition-opacity flex flex-col items-center gap-4">
          <Link href="/register" className="text-xs bg-base-200 hover:bg-base-100 px-4 py-2 rounded-full transition-all">
            🚀 Buat KumpuLink kamu sendiri — <span className="font-bold text-primary">Gratis</span>
          </Link>
          <Link href="/" className="text-sm font-medium flex items-center gap-2">
            ✨ Powered by <span className="font-bold underline">KumpuLink</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
