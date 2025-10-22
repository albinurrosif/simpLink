'use client';

import { useAuth } from '@/context/authcontext';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';

import { addDoc, collection, query, where, getDocs, doc, deleteDoc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [loadingForm, setLoadingForm] = useState(false);
  const [name, setName] = useState('');
  const [link, setLink] = useState('');
  const [links, setLinks] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [linkToDelete, setLinkToDelete] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [linkToEdit, setLinkToEdit] = useState(null);
  const [editName, setEditName] = useState('');
  const [editLink, setEditLink] = useState('');
  const [alertInfo, setAlertInfo] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserProfile(docSnap.data());
        } else {
          console.log('No such document!');
        }
      }
    };
    fetchUserProfile();
  }, [user]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (loadingForm) return;
    setLoadingForm(true);
    setAlertInfo(null);

    try {
      console.log('Form data:', { name, link });

      const newLinkData = { name, link, userId: user.uid };
      // simpan ke fierestore
      const docRef = await addDoc(collection(db, 'links'), newLinkData);

      // Update state di frontend secara manual agar UI langsung berubah
      setLinks([...links, { id: docRef.id, ...newLinkData }]);

      console.log('Document written with ID: ', docRef.id);
      setName('');
      setLink('');
      setAlertInfo({ type: 'success', message: 'Link berhasil ditambahkan!' });
    } catch (error) {
      console.error('Error adding document: ', error);
      setAlertInfo({ type: 'error', message: 'Gagal menambahkan link.' });
    } finally {
      setLoadingForm(false);
    }
  };

  const openEditModal = (linkData) => {
    setLinkToEdit(linkData); // Simpan seluruh data link { id, name, link }
    setEditName(linkData.name); // Isi form modal dengan data lama
    setEditLink(linkData.link);
    setShowEditModal(true); // Buka modal
  };

  const confirmEditLink = async (event) => {
    event.preventDefault(); // Mencegah form modal me-refresh
    if (!linkToEdit || !editName || !editLink) return;

    try {
      const docRef = doc(db, 'links', linkToEdit.id);
      await updateDoc(docRef, { name: editName, link: editLink });
      setLinks(links.map((link) => (link.id === linkToEdit.id ? { ...link, name: editName, link: editLink } : link)));
      setAlertInfo({ type: 'success', message: 'Link berhasil diperbarui!' });
    } catch (error) {
      console.error('Error updating document: ', error);

      setAlertInfo({ type: 'error', message: 'Gagal memperbarui link.' });
    } finally {
      setShowEditModal(false); // Tutup modal
      setLinkToEdit(null); // Kosongkan data edit
    }
  };

  const openDeleteModal = (id) => {
    setLinkToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDeleteLink = async () => {
    if (!linkToDelete) return; // Pastikan ada ID yang disimpan

    try {
      const docRef = doc(db, 'links', linkToDelete);
      await deleteDoc(docRef);
      setLinks(links.filter((link) => link.id !== linkToDelete));
      setAlertInfo({ type: 'success', message: 'Link berhasil dihapus!' });
    } catch (error) {
      console.error('Error deleting document: ', error);
      setAlertInfo({ type: 'error', message: 'Gagal menghapus link.' });
    } finally {
      setShowDeleteModal(false); // Tutup modal
      setLinkToDelete(null); // Kosongkan ID
    }
  };

  // Efek untuk menghilangkan alert
  useEffect(() => {
    if (alertInfo) {
      const timer = setTimeout(() => {
        setAlertInfo(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [alertInfo]);

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
      setAlertInfo({ type: 'error', message: 'Silakan login untuk mengakses Dasbor.' });
      router.push('/login');
    }
  }, [loading, user, router]);

  if (loading || !user) {
    // Tampilkan Skeleton UI
    return (
      <main className="p-4 max-w-lg mx-auto">
        <div className="skeleton h-8 w-48 mb-2"></div> {/* Placeholder untuk Welcome Text */}
        <div className="skeleton h-6 w-64 mb-4"></div> {/* Placeholder untuk Link Publik */}
        <div className="skeleton h-12 w-full mt-8 mb-4"></div> {/* Placeholder untuk Form */}
        <div className="skeleton h-10 w-full mb-2"></div> {/* Placeholder untuk 1 baris link */}
        <div className="skeleton h-10 w-full mb-2"></div> {/* Placeholder untuk 1 baris link */}
        <div className="skeleton h-10 w-full mb-2"></div> {/* Placeholder untuk 1 baris link */}
      </main>
    );
  }

  return (
    <main className="p-4">
      {alertInfo && (
        <div role="alert" className={`alert ${alertInfo.type === 'error' ? 'alert-error' : 'alert-success'} mb-4 shadow-lg`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2 2m2-2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{alertInfo.message}</span>
        </div>
      )}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-2">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          {userProfile?.username && <p className="text-neutral-500 text-sm mt-1">Selamat Datang, @{userProfile.username}!</p>}
        </div>

        <div>
          {userProfile?.username && (
            <Link href={`/${userProfile.username}`} className="btn btn-outline btn-primary btn-sm rounded-lg" rel="noopener noreferrer">
              Lihat Halaman Publikmu ✨
            </Link>
          )}
        </div>
      </div>
      <section className=" flex flex-col md:flex-row gap-6">
        <div className="card bg-base-100 shadow-md flex-1 md:order-1">
          <form onSubmit={handleSubmit} className="card-body">
            <h2 className="card-title mb-4">Tambah Link Baru</h2>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Nama Link</span>
              </label>
              <input type="text" placeholder="Type something..." className="input  w-full" value={name} onChange={(event) => setName(event.target.value)} />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">URL Link</span>
              </label>
              <input type="url" placeholder="https://..." className="input  w-full" value={link} onChange={(event) => setLink(event.target.value)} />
            </div>
            <div className="form-control mt-6">
              <button className="btn btn-primary w-full rounded-lg" type="submit" disabled={loadingForm}>
                {loadingForm ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </form>
        </div>

        <div className="card bg-base-100 shadow-md flex-1 md:order-2">
          <div className="card-body">
            <h2 className="card-title mb-4">Link Anda</h2>
            {links.length === 0 ? (
              <p className="text-center text-gray-500">Belum ada link. Tambahkan link baru di samping!</p>
            ) : (
              <ul className="space-y-2">
                {/* space-y untuk jarak */}
                {links.map((link) => (
                  <li className="flex items-center justify-between py-2 border-b border-base-300 last:border-b-0" key={link.id}>
                    {/* Info Link */}
                    <div className="overflow-hidden mr-2">
                      <a
                        className="font-medium text-primary hover:underline truncate block"
                        href={link.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={link.link} // Tooltip jika link panjang
                      >
                        {link.name}
                      </a>
                      <span className="text-xs text-gray-500 truncate block">{link.link}</span>
                    </div>

                    <div className="flex space-x-1 flex-shrink-0">
                      {/* Tombol Edit dengan SVG dan Tooltip */}
                      <div className="tooltip" data-tip="Edit">
                        <button
                          className="btn btn-sm btn-ghost btn-square text-accent hover:bg-accent hover:text-accent-content" // Warna bisa disesuaikan
                          onClick={() => openEditModal(link)}
                          aria-label="Edit"
                        >
                          {/* Contoh ikon pensil dari Heroicons (Outline) */}
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                            />
                          </svg>
                        </button>
                      </div>

                      {/* Tombol Delete dengan SVG dan Tooltip */}
                      <div className="tooltip tooltip-error" data-tip="Hapus">
                        {/* Tooltip warna error */}
                        <button
                          className="btn btn-sm btn-ghost btn-square text-error hover:bg-error hover:text-error-content" // Warna hover
                          onClick={() => openDeleteModal(link.id)}
                          aria-label="Delete"
                        >
                          {/* Contoh ikon tong sampah dari Heroicons (Outline) */}
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>
      {/* Modal Form Edit */}
      {showEditModal && linkToEdit && (
        <dialog id="edit_modal" className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Edit Link</h3>
            {/* Form di dalam modal */}
            <form onSubmit={confirmEditLink}>
              <div className="form-control py-4">
                <label className="label">
                  <span className="label-text">Nama Link</span>
                </label>
                <input type="text" placeholder="Nama Link" className="input  w-full" value={editName} onChange={(e) => setEditName(e.target.value)} required />
              </div>
              <div className="form-control pb-4">
                <label className="label">
                  <span className="label-text">URL Link</span>
                </label>
                <input type="url" placeholder="https://..." className="input  w-full" value={editLink} onChange={(e) => setEditLink(e.target.value)} required />
              </div>
              <div className="modal-action">
                <button type="button" className="btn rounded-lg" onClick={() => setShowEditModal(false)}>
                  Batal
                </button>
                <button type="submit" className="btn btn-primary rounded-lg">
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
          {/* Klik di luar modal untuk menutup */}
          <form method="dialog" className="modal-backdrop">
            <button onClick={() => setShowEditModal(false)}>Tutup</button>
          </form>
        </dialog>
      )}
      {/* Modal Konfirmasi Delete */}
      {showDeleteModal && (
        <dialog id="delete_modal" className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Konfirmasi Hapus</h3>
            <p className="py-4">Apakah Anda yakin ingin menghapus link ini?</p>
            <div className="modal-action">
              <button className="btn rounded-lg" onClick={() => setShowDeleteModal(false)}>
                Batal
              </button>
              <button className="btn btn-error rounded-lg" onClick={confirmDeleteLink}>
                Ya, Hapus
              </button>
            </div>
          </div>
          {/* Klik di luar modal untuk menutup */}
          <form method="dialog" className="modal-backdrop">
            <button onClick={() => setShowDeleteModal(false)}>Tutup</button>
          </form>
        </dialog>
      )}
    </main>
  );
}
