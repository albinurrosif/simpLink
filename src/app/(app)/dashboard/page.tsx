import { cookies } from 'next/headers';
import DashboardClient from './DashboardClient';
import { redirect } from 'next/navigation';


export default async function DashboardPage() {
  const cookieStore = await cookies();

  const token = cookieStore.get('auth_token')?.value;

  const [userResult, linksResult] = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user/me`, {
      headers: {
        Cookie: `auth_token=${token}`,
      },
      cache: 'no-store',
    }),
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/links`, {
      headers: {
        Cookie: `auth_token=${token}`,
      },
      cache: 'no-store',
    }),
  ]);

  const userResponse = await userResult.json();
  const linksResponse = await linksResult.json();

  if (!userResponse.success) {
    return redirect('/login');
  }

  console.log('Isi linksResponse:', linksResponse);

  return <DashboardClient initialUser={userResponse.user} initialLinks={linksResponse.data} />;
}
