import type { NextConfig } from "next";
import path from "path";
import webpack from "webpack";
import dotenv from "dotenv";

// Load and parse the environment variables
const { parsed: myEnv } = dotenv.config({
  path: path.resolve(process.cwd(), ".env"),
});

const nextConfig: NextConfig = {
  reactStrictMode: true,

  webpack(config) {
    if (myEnv) {
      config.plugins.push(new webpack.EnvironmentPlugin(myEnv));
    }
    return config;
  },
};

export default nextConfig;
