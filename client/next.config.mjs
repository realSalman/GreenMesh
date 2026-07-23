const isDev = process.env.NODE_ENV === 'development';
const appMode = process.env.NEXT_PUBLIC_APP_MODE || 'admin';

/** @type {import('next').NextConfig} */
const nextConfig = {
  ...(!isDev ? { output: 'export', assetPrefix: '/frontend' } : {}),
  images: {
    unoptimized: true,
  },
  distDir: isDev && appMode === 'user' ? '.next-user' : '.next',
  ...(isDev && appMode === 'user' ? {
    async rewrites() {
      return [
        {
          source: '/',
          destination: '/chat',
        },
      ];
    }
  } : {}),
};

export default nextConfig;
