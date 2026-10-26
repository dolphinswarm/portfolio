/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      // Contact info moved onto the About page.
      { source: "/connect", destination: "/about", permanent: true },
      // Legacy static-site URL still known to Google.
      { source: "/index.html", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
