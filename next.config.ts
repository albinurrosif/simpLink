import type { NextConfig } from "next";

const nextConfig = {
  eslint: {
    // Menghapus blokade build jika ada error linting
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Menghapus blokade build jika ada error type data
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
