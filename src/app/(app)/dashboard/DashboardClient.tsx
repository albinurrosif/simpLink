'use client';

import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

// 1. Definisikan tipe data props
interface DashboardClientProps {
  initialUser: {
    id: number;
    username: string;
    email: string;
    bio: string | null;
    profileImage: string | null;
    theme: string | null;
  };
  initialLinks: Link[];
}

import { useState, useEffect } from 'react';
import ProfileHeader from './components/ProfileHeader';
import AddLinkForm from './components/AddLinkForm';
import LinkList from './components/LinkList';
import toast from 'react-hot-toast';
import { Link } from '@/types/link';

export default function DashboardClient({ initialUser, initialLinks }: DashboardClientProps) {
  // 1. SEMUA STATE DI SINI
  const [user, setUser] = useState(initialUser);
  const [links, setLinks] = useState(initialLinks || []);
  const [isLoading, setLoading] = useState(false);
  const [tempUsername, setTempUsername] = useState(user.username);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [isImageLoading, setIsImageLoading] = useState(false);

  // State untuk Modal
  const [activeModal, setActiveModal] = useState<'EDIT_LINK' | 'DELETE_LINK' | 'EDIT_USERNAME' | null>(null);
  const [selectedLink, setSelectedLink] = useState<any | null>(null);

  useEffect(() => {
    if (tempUsername === user.username) {
      setIsAvailable(null);
      setIsChecking(false);
      setUsernameError(null);
      return;
    }

    setIsChecking(true);
    setUsernameError(null);
    setIsAvailable(null);

    const hasLetter = /[a-zA-Z]/.test(tempUsername);

    if (!hasLetter) {
      setUsernameError('Username tidak boleh hanya angka');
      setIsAvailable(false);
      setIsChecking(false);
      return;
    }

    const regex = /^[a-zA-Z0-9_]+$/;
    if (tempUsername.length === 0) {
      setUsernameError('Username tidak boleh kosong');
      setIsAvailable(false);
      setIsChecking(false);
      return;
    }
    if (!regex.test(tempUsername)) {
      setUsernameError('Hanya huruf, angka, dan underscore');
      setIsAvailable(false);
      setIsChecking(false);
      return;
    }
    if (tempUsername.length < 3) {
      setUsernameError('Minimal 3 karakter');
      setIsAvailable(false);
      setIsChecking(false);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      try {
        const res = await fetch(`/api/user/check?username=${tempUsername}`);
        const result = await res.json();

        setIsAvailable(result.available);

        if (!result.available) {
          setUsernameError('Username sudah digunakan');
        }
      } catch (error) {
        console.error('Error checking username:', error);
        setIsAvailable(null);
      } finally {
        setIsChecking(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [tempUsername, user.username]);

  // 2. SEMUA FUNGSI LOGIC DI SINI (Urusan ke API)

  //Function Image
  const handleUpdateImage = async (file: File) => {
    if (file.size > 2 * 1024 * 1024) {
      toast.error('File terlalu besar! Maksimal 2MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error('File harus berupa gambar!');
      return;
    }

    setIsImageLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/user/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await res.json();

      if (res.ok && result.success) {
        // Update state lokal agar foto langsung berubah
        setUser({ ...user, profileImage: result.user.profileImage });
        toast.success('Foto profil diperbarui!');
      } else {
        toast.error(result.message || 'Gagal upload');
      }
    } catch (err) {
      toast.error('Terjadi kesalahan koneksi');
    } finally {
      setIsImageLoading(false);
    }
  };

  const copyPublicUrl = () => {
    const url = `${window.location.origin}/${user.username}`;
    navigator.clipboard.writeText(url);
    toast.success('Link profil disalin!');
  };

  // Function Username
  const handleUpdateUsername = async (newUsername: string) => {
    if (newUsername === user.username) {
      setActiveModal(null);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/user/me', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: newUsername }),
      });

      const result = await res.json();
      if (!res.ok) {
        toast.error(result.message || 'Gagal memperbarui username');
        return;
      }
      setUser({ ...user, username: result.user.username });
      toast.success('Username berhasil diperbarui!');
      setActiveModal(null);
    } catch (error: any) {
      toast.error('Gagal memperbarui username');
    } finally {
      setLoading(false);
    }
  };

  // Function Bio
  const handleUpdateBio = async (newBio: string) => {
    if (newBio === user.bio) return;
    setLoading(true);
    try {
      const res = await fetch('/api/user/me', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bio: newBio }),
      });

      const result = await res.json();
      if (!res.ok) {
        toast.error(result.message || 'Gagal menyimpan bio');
        return;
      }

      setUser({ ...user, bio: result.user.bio });
      toast.success('Bio berhasil disimpan!');
    } catch (error: any) {
      toast.error('Gagal menyimpan bio');
    } finally {
      setLoading(false);
    }
  };

  // Function Link
  const handleAddLink = async (title: string, url: string) => {
    setLoading(true);

    try {
      const res = await fetch('/api/links', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, url }),
      });
      if (res.ok) {
        const newLink = await res.json();
        setLinks([...links, newLink.data]);
        toast.success('Link berhasil ditambahkan!');
      }
    } catch (error: any) {
      console.log('Error:', error.message);
      toast.error('Gagal menambahkan link.');
    } finally {
      setLoading(false);
    }
    console.log('Menambah link baru:', title, url);
  };

  // Fungsi untuk trigger edit dan delete (buka modal)
  const handleEditTrigger = (link: Link) => {
    setSelectedLink({ ...link });
    setActiveModal('EDIT_LINK');
  };
  const handleDeleteTrigger = (link: Link) => {
    setSelectedLink(link);
    setActiveModal('DELETE_LINK');
  };

  // Edit Link
  const handleSaveEdit = async () => {
    if (!selectedLink) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/links/${selectedLink.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: selectedLink.title, url: selectedLink.url, isActive: selectedLink.isActive }),
      });

      if (res.ok) {
        const updatedLink = await res.json();
        setLinks(links.map((l) => (l.id === updatedLink.data.id ? updatedLink.data : l)));
        toast.success('Link berhasil diperbarui!');
        setActiveModal(null);
      }
    } catch (error: any) {
      toast.error('Gagal memperbarui link.');
    } finally {
      setLoading(false);
    }
  };

  // Delete Link
  const handleConfirmDelete = async () => {
    if (!selectedLink) return;
    try {
      const res = await fetch(`/api/links/${selectedLink.id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setLinks(links.filter((l) => l.id !== selectedLink.id));
        toast.success('Link berhasil dihapus!');
        setActiveModal(null);
      }
    } catch (error: any) {
      toast.error('Gagal menghapus link.');
    }
  };

  const handleReorder = async (newLinks: Link[]) => {
    // Simpan urutan lama untuk "Rollback" jika gagal
    const oldLinks = [...links];

    // Optimistic Update: Langsung ganti di layar agar terasa instan
    setLinks(newLinks);

    try {
      const res = await fetch('/api/links/reorder', {
        method: 'POST',
        body: JSON.stringify({ linkIds: newLinks.map((l) => l.id) }),
      });

      if (!res.ok) {
        // Jika server gagal, kembalikan ke urutan semula
        setLinks(oldLinks);
        toast.error('Gagal menyimpan urutan');
      } else {
        toast.success('Urutan disimpan');
      }
    } catch (err) {
      setLinks(oldLinks);
      toast.error('Masalah koneksi');
    }
  };

  // Function Theme Update
  const handleUpdateTheme = async (newTheme: string) => {
    // 1. Optimistic Update (Ganti warna UI seketika)
    document.documentElement.setAttribute('data-theme', newTheme);

    try {
      const res = await fetch('/api/user/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ theme: newTheme }),
      });

      if (res.ok) {
        const result = await res.json();
        setUser({ ...user, theme: result.user.theme });
        toast.success(`Tema ${newTheme} diterapkan!`);
      } else {
        toast.error('Gagal menyimpan tema');
      }
    } catch (error) {
      toast.error('Masalah koneksi saat simpan tema');
    }
  };

  // saat pertama kali load, tema dari DB langsung dipakai
  // useEffect(() => {
  //   if (user.theme) {
  //     document.documentElement.setAttribute('data-theme', user.theme);
  //   }
  // }, []);

  return (
    <>
      <div data-theme={user.theme ?? 'light'} className="min-h-screen flex flex-col">
        <Navbar username={user.username} profileImage={user.profileImage} />
        <main className="flex-grow p-4 max-w-4xl mx-auto w-full space-y-10">
          <ProfileHeader
            username={user.username}
            bio={user.bio}
            profileImage={user.profileImage}
            theme={user.theme ?? 'light'}
            isImageLoading={isImageLoading}
            onUploadImage={handleUpdateImage}
            onEditUsername={() => {
              setTempUsername(user.username);
              setActiveModal('EDIT_USERNAME');
            }}
            onSaveBio={handleUpdateBio}
            onCopyUrl={copyPublicUrl}
            onUpdateTheme={handleUpdateTheme}
          />

          <div className="flex flex-col md:flex-row gap-8 mt-8">
            <AddLinkForm onAdd={handleAddLink} loading={isLoading} />
            <LinkList onEdit={handleEditTrigger} onDelete={handleDeleteTrigger} onReorder={handleReorder} links={links} />
          </div>
        </main>
        <Footer />
      </div>
      <dialog className={`modal ${activeModal ? 'modal-open' : ''}`}>
        <div className="modal-box">
          {activeModal === 'EDIT_USERNAME' && (
            <>
              <h3 className="font-bold text-lg">Ganti Username</h3>
              <div className="py-4 space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Username Baru</span>
                  </label>
                  <div className="join">
                    <span className="btn btn-disabled join-item no-animation text-xs">Kumpulink.vercel.app/</span>
                    <input className="input input-bordered w-full join-item lowercase" value={tempUsername} onChange={(e) => setTempUsername(e.target.value.toLowerCase().replace(/\s/g, ''))} placeholder="username_baru" />
                  </div>
                  <label className="label">
                    {isChecking && <span className="label-text-alt text-primary loading loading-spinner loading-xs"></span>}

                    {isAvailable === true && !isChecking && <span className="label-text-alt text-success">✨ Username tersedia!</span>}

                    {isAvailable === false && !isChecking && <span className="label-text-alt text-error">❌ {usernameError}</span>}
                  </label>
                </div>
                <div className="alert alert-warning text-xs shadow-none py-2">
                  <span>⚠️ Mengubah username akan mengganti URL publik lama Anda.</span>
                </div>
              </div>
              <div className="modal-action">
                <button className="btn" onClick={() => setActiveModal(null)}>
                  Batal
                </button>
                <button className="btn btn-primary" onClick={() => handleUpdateUsername(tempUsername)} disabled={isLoading || !tempUsername || isAvailable === false || isChecking}>
                  {isLoading ? 'Menyimpan...' : 'Simpan Username'}
                </button>
              </div>
            </>
          )}

          {activeModal === 'EDIT_LINK' && (
            <>
              <h3 className="font-bold text-lg">Edit Link</h3>
              <div className="py-4 space-y-4">
                <input className="input input-bordered w-full" value={selectedLink?.title || ''} onChange={(e) => setSelectedLink({ ...selectedLink, title: e.target.value })} placeholder="Judul" />
                <input className="input input-bordered w-full" value={selectedLink?.url || ''} onChange={(e) => setSelectedLink({ ...selectedLink, url: e.target.value })} placeholder="URL" />
                {/* Toggle isActive */}
                <div className="form-control w-52">
                  <label className="label cursor-pointer">
                    <span className="label-text font-bold">Aktifkan Link</span>
                    <input type="checkbox" className="toggle toggle-primary" checked={selectedLink?.isActive || false} onChange={(e) => setSelectedLink({ ...selectedLink, isActive: e.target.checked })} />
                  </label>
                </div>
              </div>
              <div className="modal-action">
                <button className="btn" onClick={() => setActiveModal(null)}>
                  Batal
                </button>
                <button className="btn btn-primary" onClick={handleSaveEdit} disabled={isLoading}>
                  Simpan
                </button>
              </div>
            </>
          )}

          {activeModal === 'DELETE_LINK' && (
            <>
              <h3 className="font-bold text-lg text-error">Hapus Link?</h3>
              <p className="py-4">
                Yakin ingin menghapus <b>{selectedLink?.title}</b>?
              </p>
              <div className="modal-action">
                <button className="btn" onClick={() => setActiveModal(null)}>
                  Batal
                </button>
                <button className="btn btn-error" onClick={handleConfirmDelete}>
                  Ya, Hapus
                </button>
              </div>
            </>
          )}
        </div>
        <div className="modal-backdrop" onClick={() => setActiveModal(null)}></div>
      </dialog>
    </>
  );
}
