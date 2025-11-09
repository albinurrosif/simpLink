'use client';

import { useAuth } from '@/context/authcontext';
import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';

import { addDoc, collection, query, where, getDocs, doc, deleteDoc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';

// Komponen Onboarding terpisah
function OnboardingForm({ user, onUsernameSet }) {
  const [newUsername, setNewUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (loading) return;

    // 1. Validasi Awal (Panjang & Karakter)
    const validUsernameRegex = /^[a-zA-Z0-9_\-]+$/;
    if (newUsername.length < 1 || newUsername.length > 20) {
      setError('Username harus 1-20 karakter.');
      return;
    }
    if (!validUsernameRegex.test(newUsername)) {
      setError('Username hanya boleh huruf, angka, underscore (_) dan strip (-)');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 2. Cek Keunikan Username di Firestore
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('username', '==', newUsername));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // Username sudah ada
        setError(`Username "${newUsername}" sudah dipakai orang lain.`);
        setLoading(false);
        return;
      }

      // 3. Update Firestore (jika username unik)
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        username: newUsername,
      });

      // 4. Beri tahu komponen Dashboard bahwa setup selesai
      onUsernameSet(newUsername); // Kirim username baru kembali
    } catch (err) {
      console.error('Error setting username: ', err);
      setError('Gagal mengatur username. Coba lagi.');
      setLoading(false);
    }
  };

  return (
    <main className="p-4 flex justify-center items-center">
      <div className="card w-full max-w-sm shrink-0 shadow-2xl bg-base-100 rounded-lg">
        <form onSubmit={handleSubmit} className="card-body">
          <h1 className="text-2xl font-bold">Selamat Datang!</h1>
          <p className="text-base-content/70">Pilih username publik Anda untuk menyelesaikan setup.</p>

          {error && (
            <div role="alert" className="alert alert-error mt-4 p-2 text-sm">
              <span>{error}</span>
            </div>
          )}

          <div className="form-control py-4">
            <label className="label">
              <span className="label-text">Username</span>
            </label>
            <div className="join">
              <span className="btn join-item rounded-l-lg no-animation">kumpulink.com/</span>
              <input
                type="text"
                placeholder="username_anda"
                className="input input-bordered w-full join-item rounded-r-lg"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                required
                minLength={1}
                maxLength={20}
                pattern="^[a-zA-Z0-9_\-]+$"
                title="Hanya huruf, angka, strip (-), dan underscore (_)"
              />
            </div>
            <label className="label">
              <span className="label-text-alt text-warning">Ini akan menjadi URL publik Anda.</span>
            </label>
          </div>

          <div className="form-control mt-6">
            <button type="submit" className="btn rounded-lg btn-primary" disabled={loading}>
              {loading ? <span className="loading loading-spinner loading-xs"></span> : 'Simpan dan Lanjutkan'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

export default function DashboardPage() {
  // ==================== HOOKS EXTERNAL ====================
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // ==================== STATE MANAGEMENT ====================
  // 🟢 AUTH & LOADING STATES
  const [loadingForm, setLoadingForm] = useState(false);
  const [usernameCheckLoading, setUsernameCheckLoading] = useState(false);

  // 🟢 USER PROFILE STATES
  const [userProfile, setUserProfile] = useState(null);
  const [bio, setBio] = useState(userProfile?.bio || '');
  const [savingBio, setSavingBio] = useState(false);

  // 🟢 LINK FORM STATES
  const [name, setName] = useState('');
  const [link, setLink] = useState('');
  const [links, setLinks] = useState([]);

  // 🟢 EDIT FORM STATES
  const [editName, setEditName] = useState('');
  const [editLink, setEditLink] = useState('');
  const [newUsername, setNewUsername] = useState('');

  // 🟢 MODAL STATES
  const [showEditModal, setShowEditModal] = useState(false);
  const [linkToEdit, setLinkToEdit] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [linkToDelete, setLinkToDelete] = useState(null);
  const [showEditUsernameModal, setShowEditUsernameModal] = useState(false);
  const [isUsernameSetupModal, setIsUsernameSetupModal] = useState(false); // Lacak modal setu
  const [needsOnboarding, setNeedsOnboarding] = useState(false);

  // 🟢 UI FEEDBACK STATES
  const [alertInfo, setAlertInfo] = useState('');
  const [copySuccess, setCopySuccess] = useState('');

  // ==================== EFFECTS ====================
  // 🔵 DATA FETCHING EFFECTS
  // Fetch user profile data
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

  // Fetch user links data
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
  }, [user]);

  // Sync bio from userProfile
  useEffect(() => {
    if (userProfile?.bio) {
      setBio(userProfile.bio);
    }
  }, [userProfile]);

  // Check for username setup flag
  useEffect(() => {
    const needsSetup = searchParams.get('setupUsername') === 'true';

    if (needsSetup && user && !userProfile) {
      // Tunggu userProfile di-fetch
      return;
    }

    // Kondisi utama: flag ada DAN user profile sudah ter-load TAPI username-nya KOSONG
    if (needsSetup && userProfile && !userProfile.username) {
      console.log('User needs onboarding.');
      setNeedsOnboarding(true); // <-- ATUR MODE ONBOARDING

      // Hapus query param dari URL
      router.replace('/dashboard', { scroll: false });
    }
  }, [user, userProfile, searchParams, router]);

  // 🔵 UI/SIDE EFFECTS
  // Auth redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      setAlertInfo({ type: 'error', message: 'Silakan login untuk mengakses Dasbor.' });
      router.push('/login');
    }
  }, [loading, user, router]);

  // Auto-hide alert after timeout
  useEffect(() => {
    if (alertInfo) {
      const timer = setTimeout(() => {
        setAlertInfo(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [alertInfo]);

  // ==================== FUNCTIONS ====================
  // 🟠 LINK MANAGEMENT FUNCTIONS
  // Handle add new link
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

  // Open edit modal with link data
  const openEditModal = (linkData) => {
    setLinkToEdit(linkData); // Simpan seluruh data link { id, name, link }
    setEditName(linkData.name); // Isi form modal dengan data lama
    setEditLink(linkData.link);
    setShowEditModal(true); // Buka modal
  };

  // Confirm and save link edits
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

  // Open delete confirmation modal
  const openDeleteModal = (id) => {
    setLinkToDelete(id);
    setShowDeleteModal(true);
  };

  // Confirm and execute link deletion
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

  // Open edit username modal
  const openEditUsernameModal = (isSetup = false) => {
    // Terima parameter opsional
    if (isSetup) {
      setIsUsernameSetupModal(true); // Tandai ini sebagai modal setup
      setNewUsername(''); // Kosongkan, karena ini setup pertama
    } else {
      setIsUsernameSetupModal(false); // Ini modal edit biasa
      setNewUsername(userProfile?.username || ''); // Isi dengan username saat ini
    }
    setShowEditUsernameModal(true);
  };

  const confirmEditUsername = async (event) => {
    event.preventDefault();
    if (!newUsername || usernameCheckLoading) return;

    // 1. validasi awal (panjang & karakter)
    const validUsernameRegex = /^[a-zA-Z0-9_\-]+$/;
    if (newUsername < 1 || newUsername > 20) {
      setAlertInfo({ type: 'error', message: 'Username harus 1-20 karakter.' });
      return;
    }
    if (!validUsernameRegex.test(newUsername)) {
      setAlertInfo({ type: 'error', message: 'Username hanya boleh huruf, angka, underscore (_) dan strip (-)' });
      return;
    }
    // Jika username baru sama dengan yang lama, tidak perlu dicek/update
    if (newUsername === userProfile?.username) {
      setShowEditUsernameModal(false); // tutup modal
      return;
    }

    setUsernameCheckLoading(true);
    setAlertInfo(null);

    try {
      // 2. Cek Keunikan Username di Firestore
      const userRef = collection(db, 'users');
      const q = query(userRef, where('username', '==', newUsername));
      const querySnapShot = await getDocs(q);

      if (!querySnapShot.empty) {
        // username sudah ada
        setAlertInfo({ type: 'error', message: `Username "${newUsername}" sudah dipakai orang lain` });
        setUsernameCheckLoading(false);
        return;
      }

      // 3. Update irestore jika valid
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        username: newUsername,
      });

      // Update State Lokal
      setUserProfile((prev) => ({ ...prev, username: newUsername }));
      setAlertInfo({ type: 'success', message: 'Username berhasil diperbarui!' });
      setShowEditUsernameModal(false);
    } catch (error) {
      console.log('Error update username', error);
      setAlertInfo({ type: 'error', message: 'Gagal memperbarui username.' });
    } finally {
      setUsernameCheckLoading(false);
    }
  };

  // 🟠 PROFILE MANAGEMENT FUNCTIONS
  // Save bio to user profile
  const handleSaveBio = async () => {
    // Validasi dasar
    if (!user || savingBio) return;

    setSavingBio(true);

    try {
      // 1. Dapatkan reference ke dokumen user
      const docRef = doc(db, 'users', user.uid);

      // 2. Update field 'bio' di Firestore
      await updateDoc(docRef, {
        bio: bio,
      });

      // 3. Update state lokal agar UI langsung berubah
      setUserProfile((prev) => ({ ...prev, bio: bio }));

      setAlertInfo({ type: 'success', message: 'Bio berhasil disimpan' });
    } catch (error) {
      console.log(error);
      setAlertInfo({ type: 'error', message: 'Gagal menyimpan bio' });
    } finally {
      setSavingBio(false);
    }
  };

  // 🟠 UTILITY FUNCTIONS
  // Copy public URL to clipboard
  const copyToClipboard = () => {
    if (userProfile?.username) {
      // Pastikan window ada sebelum mengakses location.origin
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      if (!origin) {
        console.error('Origin tidak bisa didapatkan.'); // Handle jika origin tidak ada (jarang terjadi di client)
        setCopySuccess('Gagal mendapatkan URL.');
        setTimeout(() => setCopySuccess(''), 2000);
        return;
      }
      // Bangun URL lengkap
      // window.location.origin akan mengambil domain saat ini (misal: http://localhost:3000 atau https://KumpuLink.vercel.app)
      const publicUrl = `${window.location.origin}/${userProfile.username}`;

      navigator.clipboard.writeText(publicUrl).then(
        () => {
          // Berhasil disalin
          setCopySuccess('Tautan berhasil disalin!');
          // Hapus pesan setelah beberapa detik
          setTimeout(() => setCopySuccess(''), 2000);
        },
        (err) => {
          // Gagal disalin (jarang terjadi, mungkin karena izin browser)
          console.error('Gagal menyalin: ', err);
          setCopySuccess('Gagal menyalin.');
          setTimeout(() => setCopySuccess(''), 2000);
        }
      );
    }
  };

  // ==================== RENDER LOGIC ====================

  // Skeleton loading UI
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

  // === BAGIAN BARU: TAMPILKAN ONBOARDING JIKA DIPERLUKAN ===
  if (needsOnboarding || (userProfile && !userProfile.username)) {
    return (
      <OnboardingForm
        user={user}
        onUsernameSet={(newUsername) => {
          // Panggil ini saat onboarding selesai
          setUserProfile((prev) => ({ ...prev, username: newUsername }));
          setNeedsOnboarding(false); // Matikan mode onboarding
          setAlertInfo({ type: 'success', message: 'Setup selesai!' });
        }}
      />
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
      <div className="flex flex-col gap-4 mb-4">
        {/* Baris 1: Judul Dashboard */}
        <div className="flex flex-row items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            {userProfile?.username && <p className="text-neutral-500 text-sm mt-1">Selamat Datang, @{userProfile.username}!</p>}
          </div>

          {/* Tombol Lihat Halaman Publik*/}
          <div>
            {userProfile?.username && (
              <Link
                href={`/${userProfile.username}`}
                className="btn btn-outline btn-primary btn-sm rounded-lg min-h-6 h-6 px-3 sm:px-4
  text-xs sm:text-sm
  whitespace-nowrap
  flex-shrink-0"
                rel="noopener noreferrer"
              >
                Lihat Halaman Publikmu ✨
              </Link>
            )}
          </div>
        </div>

        {/* Baris 2: URL Publik & Tombol Salin */}
        {userProfile?.username && (
          <div className="bg-base-200 rounded-lg flex flex-col justify-between">
            <div className="pl-4 pr-4 pt-4 bg-base-200 rounded-lg flex items-center justify-between gap-2">
              <div className="overflow-hidden">
                <p className="text-sm font-medium">URL Publik Anda:</p>

                <span className="text-primary font-mono text-sm break-all">{`${typeof window !== 'undefined' ? window.location.origin : ''}/${userProfile.username}`}</span>
              </div>
              <div className="flex justify-between gap-2">
                <button className="btn btn-sm btn-ghost btn-square text-info hover:bg-info hover:text-info-content  p-0" onClick={openEditUsernameModal} aria-label="Edit Username">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                    />
                  </svg>
                </button>
                <button className="btn btn-secondary btn-sm flex-shrink-0 rounded-lg" onClick={copyToClipboard}>
                  {copySuccess ? 'Tersalin!' : 'Salin'}
                </button>
              </div>
            </div>
            <p className="pl-4 pr-4 pb-4 text-xs text-neutral-500 mt-1">Salin tautan ini dan tempelkan di bio media sosial Anda (Instagram, TikTok, dll).</p>
          </div>
        )}

        <fieldset className="border border-base-300 rounded-lg p-4 w-full min-w-0">
          <legend className="px-2 text-sm font-medium">Bio anda:</legend>
          <textarea value={bio} onChange={(event) => setBio(event.target.value)} onBlur={handleSaveBio} className="textarea h-12 w-full" placeholder="Type something..."></textarea>
          <div className="text-sm text-gray-500 mt-1">Opsional</div>
        </fieldset>
      </div>

      <section className=" flex flex-col md:flex-row gap-6">
        <div className="card bg-base-100 shadow-2xl flex-1 md:order-1">
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

        <div className="card bg-base-100 shadow-2xl flex-1 md:order-2">
          <div className="card-body">
            <h2 className="card-title mb-4">Link Anda</h2>
            {links.length === 0 ? (
              <p className="text-center text-gray-500">Belum ada link. Tambahkan link baru di samping!</p>
            ) : (
              <ul className="space-y-2">
                {/* space-y untuk jarak */}
                {links.map((link) => (
                  <li
                    // Tetap sebagai flex container
                    className="grid grid-cols-[1fr_auto] items-center gap-4 py-2 border-b border-base-300 last:border-b-0"
                    key={link.id}
                  >
                    <div className="flex-1 min-w-0">
                      <a href={link.link} target="_blank" rel="noopener noreferrer" title={link.link} className="block w-full truncate font-medium text-primary hover:underline text-sm">
                        {link.name}
                      </a>
                      <p className="block w-full truncate text-xs text-gray-500">{link.link}</p>
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
      {/* Modal Form Edit Username*/}
      {showEditUsernameModal && (
        <dialog id="edit_username_modal" className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Edit Username</h3>
            <form onSubmit={confirmEditUsername}>
              <div className="form-control py-4">
                <label className="label">
                  <span className="label-text">Username Baru</span>
                </label>
                <input
                  type="text"
                  placeholder="Username (1-20 karakter, huruf, angka, - , _)"
                  className="input input-bordered w-full"
                  value={newUsername}
                  onChange={(event) => setNewUsername(event.target.value)}
                  required
                  minLength={1}
                  maxLength={20}
                  pattern="^[a-zA-Z0-9_\-]+$"
                  title="Hanya huruf, angka, strip (-), dan underscore (_)"
                />
                <label className="label">
                  <span className="label-text-alt text-warning">Mengubah username akan mengubah URL publik Anda.</span>
                </label>
              </div>

              {alertInfo && alertInfo.type == 'error' && (
                <div role="alert" className="alert alert-error p-2 mt-4 text-sm">
                  <span>{alertInfo.message}</span>
                </div>
              )}

              <div className="modal-action mt-6">
                <button type="button" className="btn rounded-lg" onClick={() => setShowEditUsernameModal(false)} disabled={usernameCheckLoading}>
                  Batal
                </button>

                <button type="submit" className="btn rounded-lg btn-primary" disabled={usernameCheckLoading}>
                  {usernameCheckLoading ? <span className="loading loading-spinner loading-xs"></span> : 'Simpan Username'}
                </button>
              </div>
            </form>
          </div>

          {/* Backdrop: Hanya bisa ditutup jika BUKAN modal setup */}
          <form method="dialog" className="modal-backdrop">
            <button
              onClick={() => {
                // Cek kondisi
                setShowEditUsernameModal(false);
              }}
              disabled={usernameCheckLoading}
            >
              Tutup
            </button>
          </form>
        </dialog>
      )}
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
