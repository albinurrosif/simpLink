// LinkItem.tsx
export function LinkItem({ link, onEdit, onDelete }: any) {
  return (
    <li key={link.id} className="grid grid-cols-[1fr_auto] items-center gap-4 py-2 border-b border-base-300 last:border-b-0">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <a href={link.url} target="_blank" className="font-medium text-primary hover:underline text-sm truncate">
            {link.title}
          </a>
          {/* Tampilkan Badge Clicks */}
          <div className="badge badge-secondary badge-outline badge-sm gap-1 opacity-80">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
              />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
            </svg>
            {link.total_clicks || 0}
          </div>
        </div>
        <p className="block w-full truncate text-xs text-base-content/60">{link.url}</p>
      </div>
      <div className="flex space-x-1">
        <button onClick={() => onEdit(link)} className="btn btn-sm btn-ghost text-warning">
          Edit
        </button>
        <button onClick={() => onDelete(link)} className="btn btn-sm btn-ghost text-error">
          Hapus
        </button>
      </div>
    </li>
  );
}
