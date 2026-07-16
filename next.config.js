/** @type {import('next').NextConfig} */
const nextConfig = {
  // NOTE: 'output: export' is intentionally omitted here so that pages/api/*
  // routes work when running the custom Express+Socket.io server (server.js).
  // For the Android/Capacitor static build, run: next build with output:export
  // temporarily set, or use a separate next.config.android.js.
  output: 'export',
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;