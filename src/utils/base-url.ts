export const baseUrl =
  import.meta.env.VITE_API_NODE_ENV === "development"
    ? import.meta.env.VITE_API_DEV
    : import.meta.env.VITE_API_PROD;
