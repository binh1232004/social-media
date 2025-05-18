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
    domains: [
      'res.cloudinary.com', 
      'cloudinary.com',
      'api.cloudinary.com',
      'socialmediastoragebinh.blob.core.windows.net'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '**',
      }
    ]
  },
};

export default nextConfig;
