/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // three is ESM — transpile drei/fiber for safety across versions
  transpilePackages: ['three', '@react-three/fiber', '@react-three/drei'],
};

export default nextConfig;
