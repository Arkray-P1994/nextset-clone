export const fetcher = async (url: string, payload?: any) => {
  const isFormData = payload instanceof FormData;

  const options: RequestInit = {
    method: payload ? "POST" : "GET",
    headers: {
      accept: "application/json",
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
    },
    ...(payload && {
      body: isFormData ? payload : JSON.stringify(payload),
    }),
  };

  const res = await fetch(url, options);
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  return res.json();
};
