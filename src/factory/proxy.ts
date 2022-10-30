import { getProxyCache, setProxyCache } from "../factory/cache";

//const corsAnywhere = process.env.cors || "http://0.0.0.0:8080";
const corsAnywhere = process.env.cors || "https://corsanywhere.up.railway.app";

export const proxy = async (url: string, options: RequestInit = {}) => {
  const cached = getProxyCache(url);
  if (cached) {
    return cached;
  }

  const response = await fetch(`${corsAnywhere}/${url}`, {
    ...options,
  });
  return setProxyCache(url, response.json());
};
