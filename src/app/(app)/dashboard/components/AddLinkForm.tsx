'use client';

import { useState } from 'react';

export default function AddLinkForm({ onAdd, loading }: { onAdd: (title: string, url: string) => void; loading: boolean }) {
  const [title, setName] = useState('');
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(title, url);
    setName('');
    setUrl('');
  };

  return (
    <div className="card bg-base-100 shadow-2xl flex-1">
      <form onSubmit={handleSubmit} className="card-body">
        <h2 className="card-title mb-4">Tambah Link Baru</h2>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Nama Link </span>
          </label>
          <input value={title} onChange={(e) => setName(e.target.value)} type="text" className="input input-bordered" title="Link title" required />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">URL Link </span>
          </label>
          <input value={url} onChange={(e) => setUrl(e.target.value)} type="text" className="input input-bordered" title="Link URL" required />
        </div>
        <button className="btn btn-primary mt-6 rounded-field" disabled={loading}>
          {loading ? 'Menyimpan...' : 'Simpan'}
        </button>
      </form>
    </div>
  );
}
