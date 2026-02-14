import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";
output: "export",
basePath: "/-Rayan-sys",
assetPrefix: "/-Rayan-sys/",
const nextConfig: NextConfig = {
  output: "export",
  basePath: isProd ? "/-Rayan-sys" : "",
  assetPrefix: isProd ? "/-Rayan-sys/" : "",

  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
