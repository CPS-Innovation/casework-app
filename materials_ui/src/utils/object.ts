export const isObjectEmpty = (obj?: object): boolean => {
  if (!obj) return true;

  for (const prop in obj) {
    if (Object?.hasOwn(obj, prop)) {
      return false;
    }
  }

  return true;
};
