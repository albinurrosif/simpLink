import Image from 'next/image';
import { auth, db } from '@/lib/firebase';
import Link from 'next/link';

export default function Home() {
  console.log('Firebase Auth:', auth);
  console.log('Firestore DB:', db);
  return (
    <main>
      <h1>simpLink</h1>
      <nav>
        <Link href="/login">Login</Link>
        <br />
        <Link href="/register">Register</Link>
      </nav>
    </main>
  );
}
