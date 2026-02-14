import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  output: "export",
  basePath: isProd ? "/-Rayan-sys" : "",
  assetPrefix: isProd ? "/-Rayan-sys/" : "",

  images: {
    unoptimized: true,
  },
};

export default nextConfig;
