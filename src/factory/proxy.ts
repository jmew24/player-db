import { queryClient } from "@factory/queryClient";
import { requestOptions, fetchWithTimeout } from "@factory/fetchRequest";

const corsAnywhere = process.env.NEXT_PUBLIC_CORS || "";

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
