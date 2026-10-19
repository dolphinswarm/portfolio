/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      // Contact info moved onto the About page.
      { source: "/connect", destination: "/about", permanent: true },
    ];
  },
};

export default nextConfig;
