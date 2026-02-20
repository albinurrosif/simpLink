import { createLinkView } from './linkView.repository';

export async function recordLinkView(linkId: number, ip: string, ua: string) {
  // 1. Abaikan jika IP adalah IP lokal saat development
  if (ip === '::1' || ip === '127.0.0.1') return null;

  // 2. Abaikan IP kamu sendiri (cek dari .env)
  if (ip === process.env.MY_ADMIN_IP) return null;
  return await createLinkView(linkId, ip, ua);
}
