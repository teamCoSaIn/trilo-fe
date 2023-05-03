const convertToDataUrl = (svg: string) => {
  const svgDataURL = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
    svg
  )}`;

  return svgDataURL;
};

export default convertToDataUrl;
