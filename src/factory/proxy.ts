import { queryClient } from "@factory/queryClient";

const corsAnywhere = process.env.NEXT_PUBLIC_CORS || "";

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

export async function proxy<ProxyResult>(
  url: string,
  options: requestOptions = {}
): Promise<ProxyResult> {
  return await queryClient(url, async () => {
    const response = await fetchWithTimeout(`${corsAnywhere}${url}`, {
      ...options,
    });
    return response.json();
  });
}

export default proxy;