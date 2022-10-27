const corsAnywhere = process.env.cors || "http://0.0.0.0:8080";
//const corsAnywhere = process.env.cors || "https://corsanywhere.up.railway.app";

export const proxy = async (url: string, options: RequestInit = {}) => {
  const response = await fetch(`${corsAnywhere}/${url}`, {
    ...options,
  });
  return response.json();
};
