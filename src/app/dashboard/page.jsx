'use client';

import { useAuth } from '@/context/authcontext';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { useState } from 'react';
import { addDoc, collection, query, where, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [loadingForm, setLoadingForm] = useState(false);
  const [name, setName] = useState('');
  const [link, setLink] = useState('');
  const [links, setLinks] = useState([]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout failed:', error);
      alert('Logout failed. Please try again.');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (loadingForm) return;
    setLoadingForm(true);

    try {
      const docRef = await addDoc(collection(db, 'links'), {
        name,
        link,
        userId: user.uid,
      });
      console.log('Document written with ID: ', docRef.id);
      setName('');
      setLink('');
      alert('Link added successfully!');
    } catch (error) {
      console.error('Error adding document: ', error);
    } finally {
      setLoadingForm(false);
    }
    console.log('Form data:', { name, link });
  };

  const handleEditLink = async (id) => {
    const currentLink = links.find((link) => link.id === id);
    const newName = prompt('Enter new name:');
    const newLink = prompt('Enter new link:');

    if (newName && newLink) {
      try {
        // 1. reference to the document
        const docRef = doc(db, 'links', id);
        // 2. update document
        await updateDoc(docRef, { name: newName, link: newLink });
        // 3. update state
        setLinks(links.map((link) => (link.id === id ? { ...link, name: newName, link: newLink } : link)));
        alert('Link updated successfully!');
      } catch (error) {
        console.log('error updating document: ', error);
      }
    }
  };

  const handleDeleteLink = async (id) => {
    if (window.confirm('Are you sure you want to delete this link?')) {
      try {
        // 1. reference to the document
        const docRef = doc(db, 'links', id);
        // 2. delete document
        await deleteDoc(docRef);
        // 3. update state
        setLinks(links.filter((link) => link.id !== id));
        alert('Link deleted successfully!');
      } catch (error) {
        console.error('Error deleting document: ', error);
      }
    }
  };

  useEffect(() => {
    const fetchLinks = async () => {
      if (user) {
        try {
          // 1. buat query
          const q = query(collection(db, 'links'), where('userId', '==', user.uid));
          // 2. eksekusi query
          const querySnapshot = await getDocs(q);
          // 3. Olah hasil query menjadi array
          const linksData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          setLinks(linksData);
        } catch (error) {
          console.error('Error fetching links: ', error);
        }
      }
    };
    fetchLinks(); // panggil fungsi
  }, [user]); // dependensi user artinya jalankan ulang saat user berubah

  useEffect(() => {
    if (!loading && !user) {
      alert('Please, Login to access the Dashboard');
      router.push('/login');
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return <div>Loading...</div>;
  }

  return (
    <main>
      <h1>Dashboard</h1>
      <p>Welcome {user.email}</p>
      <button onClick={handleLogout}>Logout</button>

      <section>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Type something..." value={name} onChange={(event) => setName(event.target.value)} />
          <input type="link" placeholder="Type a link..." value={link} onChange={(event) => setLink(event.target.value)} />
          <button type="submit">Submit</button>
        </form>

        <h2>Your Links</h2>
        <ul>
          {links.map((link) => (
            <li key={link.id}>
              <a href={link.link} target="_blank" rel="noopener noreferrer">
                {link.name}
              </a>
              <button onClick={() => handleEditLink(link.id)}>Edit</button>
              <button onClick={() => handleDeleteLink(link.id, { name: link.name, link: link.link })}>Delete</button>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
