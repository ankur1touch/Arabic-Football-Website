import axios from "axios";

const axiosClient = axios.create({
  baseURL: typeof window !== "undefined" ? "" : process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  headers: { "Content-Type": "application/json" },
});

export default axiosClient;
