const corsAnywhere = process.env.cors || "https://corsanywhere.up.railway.app";

export const proxy = async (url: string, options: RequestInit = {}) => {
  const { headers, ...rest } = options;
  return await fetch(`${corsAnywhere}/${url}`, {
    ...rest,
    headers: {
      ...headers,
      "Content-Type": "application/json",
      Accept: "application/json",
      origin: window.location.origin,
    },
  });
};
