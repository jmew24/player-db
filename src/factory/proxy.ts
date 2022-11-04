import { getProxyCache, setProxyCache } from "../factory/cache";

//const corsAnywhere = process.env.cors || "http://0.0.0.0:8080";
const corsAnywhere = process.env.cors || "https://corsanywhere.up.railway.app";

type requestOptions = RequestInit & {
  timeout?: number;
};

async function fetchWithTimeout(url: string, options: requestOptions = {}) {
  const { timeout = 10000 } = options;

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  const response = await fetch(url, {
    ...options,
    signal: controller.signal,
  });
  clearTimeout(id);
  return response;
}

export const proxy = async (url: string, options: RequestInit = {}) => {
  const cached = getProxyCache(url);
  if (cached) {
    return cached;
  }

  const response = await fetchWithTimeout(`${corsAnywhere}/${url}`, {
    ...options,
  });
  return setProxyCache(url, response.json());
};
