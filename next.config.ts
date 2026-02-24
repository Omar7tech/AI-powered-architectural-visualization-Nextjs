import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
        port: '',
        search: '',
      },

    ],
  },
 allowedDevOrigins: ['local-origin.dev', '*.local-origin.dev'],
};

export default nextConfig;
