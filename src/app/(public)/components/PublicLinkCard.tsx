'use client';

interface PublicLinkCardProps {
  id: number;
  url: string;
  title: string;
}

export default function PublicLinkCard({ id, url, title }: PublicLinkCardProps) {
  const handleClick = () => {
    // Kirim data ke analitik tanpa menunggu (Fire and forget)
    fetch('/api/links/view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ linkId: id }),
    }).catch((err) => console.error('Analytic error:', err));
  };

  return (
    <li className="list-none w-full relative">
      <a href={url} target="_blank" rel="noopener noreferrer" onClick={handleClick} className="btn btn-primary btn-block rounded-full text-lg normal-case hover:scale-105 transition-transform">
        {title}
      </a>
    </li>
  );
}
