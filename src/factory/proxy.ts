const corsAnywhere = process.env.cors || "https://corsanywhere.up.railway.app";

export const proxy = async (url: string, options: RequestInit = {}) => {
  return await fetch(`${corsAnywhere}/${url}`, {
    ...options,
  });
};
