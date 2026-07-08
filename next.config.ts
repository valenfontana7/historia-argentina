import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "mdx"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
        pathname: "/wikipedia/commons/**",
      },
    ],
  },
  async redirects() {
    return [
      { source: "/jugar", destination: "/hoy", permanent: true },
      { source: "/timelines/comparar", destination: "/timelines", permanent: true },
    ];
  },
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
