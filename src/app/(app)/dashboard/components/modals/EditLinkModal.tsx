interface EditLinkModalProps {
  isOpen: boolean;
  link: any;
  onClose: () => void;
  onConfirm: (id: number, updatedData: any) => void;
}

export default function EditLinkModal({ isOpen, link, onClose, onConfirm }: EditLinkModalProps) {
  if (!isOpen || !link) return null; // Jika tidak open, jangan gambar apa pun (Early Return)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      title: formData.get('title'),
      url: formData.get('url'),
    };
    onConfirm(link.id, data);
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg text-white">Edit Link</h3>
        <form onSubmit={handleSubmit} className="py-4 space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Judul</span>
            </label>
            <input name="title" defaultValue={link.title} className="input input-bordered" title="Title" required />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">URL</span>
            </label>
            <input name="url" defaultValue={link.url} className="input input-bordered" title="URL" required />
          </div>
          <div className="modal-action">
            <button type="button" onClick={onClose} className="btn">
              Batal
            </button>
            <button type="submit" className="btn btn-primary">
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
