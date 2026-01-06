import { getDefaultHeaders } from "@repo/commons/utils/request";
import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname, "../../"),
  },
  async headers() {
    return getDefaultHeaders([])
  },
};

export default nextConfig;
