export const formatDate = (dtStr: string) => {
  const date = new Date(dtStr);

  // FORMAT: "04 November 2025"

  // Method 1: Using toLocaleDateString with options
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
};
