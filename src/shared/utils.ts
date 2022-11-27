export const GetLocal = (date: Date) => {
  date = new Date(date);
  const offsetMs = date.getTimezoneOffset() * 60 * 1000;
  const dateLocal = new Date(date.getTime() - offsetMs);

  return dateLocal
    .toISOString()
    .slice(0, 16)
    .replace(/-/g, "/")
    .replace("T", " ");
};
