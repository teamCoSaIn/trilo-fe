const truncate = (string: string, length: number): string => {
  let newString;
  if (string && string.length >= length) {
    newString = `${string?.slice(0, length).trim()}...`;
  } else {
    newString = string;
  }
  return newString;
};

export default truncate;
