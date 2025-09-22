import { baseUrl } from "@/utils/base-url";
import useSWR from "swr";

const fetcher = async (url: string) => {
  const res = await fetch(url, {
    method: "GET",
    credentials: "include", // important for cookies / CORS with credentials
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`Fetch failed: ${res.status} ${res.statusText}`);
  }

  return res.json();
};

export function useIP() {
  const { data, error, isLoading } = useSWR(
    `${baseUrl}/track-api/index.php`,
    fetcher
  );

  return {
    ip: data ?? null,
    error,
    isLoading,
  };
}
