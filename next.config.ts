import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    PRACTICE_ID: process.env.PRACTICE_ID || 'advanced-spine-care',
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    ELEVENLABS_API_KEY: process.env.ELEVENLABS_API_KEY,
  },
  experimental: {
    // Enable if needed
  },
};

export default nextConfig;