/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    env: {
        API_URL: process.env.API,
        IO_URL: process.env.IO_URL,
    },
};
  
module.exports = nextConfig;