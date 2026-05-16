/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/login',
        destination: 'https://dashboard.truenorthdistro.com/en/login',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
