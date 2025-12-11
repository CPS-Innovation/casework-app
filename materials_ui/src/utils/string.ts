export const replaceTokens = (
  stringToReplace: string,
  tokens: Record<string, string | number>
) => {
  let str = stringToReplace;

  Object.entries(tokens).map(([key, token]) => {
    str = str.replaceAll(`{${key}}`, token.toString());
  });

  return str;
};

export const cleanString = (str: string) => str.replace(/\s+/g, ' ');
