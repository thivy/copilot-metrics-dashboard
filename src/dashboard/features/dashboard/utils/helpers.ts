export const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("en-AU", {
    month: "short",
    day: "numeric",
  });
};
