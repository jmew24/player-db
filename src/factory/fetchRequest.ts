export type requestOptions = RequestInit & {
  timeout?: number;
};

export async function fetchWithTimeout(
  url: string,
  options: requestOptions = {}
) {
  const { timeout = 10000 } = options;

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(id);
    return response;
  } catch {
    clearTimeout(id);
    return new Response();
  }
}

export async function fetchRequest<RequestResult>(
  url: string,
  options: requestOptions = {}
): Promise<RequestResult> {
  const response = await fetchWithTimeout(url, {
    ...options,
  });
  return response.json();
}

export default fetchRequest;
