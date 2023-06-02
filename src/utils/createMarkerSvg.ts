const createSelectedTriloMarkerSvg = (num: number, color = '#4D77FF') => {
  return `<svg width="34" height="42" viewBox="0 0 34 42" fill="${color}" xmlns="http://www.w3.org/2000/svg">
  <path fill-rule="evenodd" clip-rule="evenodd" d="M17 42C17 42 34 26.8549 34 17.3002C34 7.74557 26.3888 0 17 0C7.61116 0 0 7.74557 0 17.3002C0 26.8549 17 42 17 42Z" fill="inherit"/>
  <circle cx="17" cy="16" r="12" fill="white"/>
  <text x="50%" y="46%" font-size="10" font-family="Arial" text-anchor="middle" fill="black">${num}</text>
  </svg>
  `;
};

const createTriloMarkerSvg = (num: number, color = '#4D77FF') => {
  return `<svg width="34" height="34" viewBox="0 0 34 34" fill="${color}" xmlns="http://www.w3.org/2000/svg">
  <circle cx="17" cy="17" r="17" fill="inherit"/>
  <circle cx="17" cy="17" r="12" fill="white"/>
  <text x="50%" y="60%" font-size="10" font-family="Arial" text-anchor="middle" fill="black">${num}</text>
  </svg>
  `;
};

const createPositionMarkerSvg = () => {
  return `<svg width="30" height="30" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="100" cy="100" r="100" fill="#688BFF" fill-opacity="0.2"/>
  <circle cx="100" cy="100" r="45" fill="#4E77FF" stroke="white" stroke-width="10"/>
  </svg>  
  `;
};

export {
  createSelectedTriloMarkerSvg,
  createTriloMarkerSvg,
  createPositionMarkerSvg,
};
