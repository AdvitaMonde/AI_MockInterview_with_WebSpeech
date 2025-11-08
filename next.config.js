// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
//   output: 'export',
//   eslint: {
//     ignoreDuringBuilds: true,
//   },
//   images: { unoptimized: true },
// };

// module.exports = nextConfig;


/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

 


  // Disable server-side features that break static export
  experimental: {
    appDir: true, // if using App Router
  },

  // Optional: remove API routes if not needed
  // api: { bodyParser: true }, 
};

module.exports = nextConfig;

