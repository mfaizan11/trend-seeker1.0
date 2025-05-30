
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      // Add other image hostnames if you use them, e.g., for social sharing images
      // {
      //   protocol: 'https',
      //   hostname: 'www.yourtrendseekerapp.com', // REPLACE with your actual domain for OG images
      //   port: '',
      //   pathname: '/**',
      // },
    ],
  },
};

export default nextConfig;
