/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/signin',
        permanent: true,
      },
    ];
  },
  images: {
    domains: ['res.cloudinary.com'], // Add your allowed image domains here
  },
};

export default nextConfig;
