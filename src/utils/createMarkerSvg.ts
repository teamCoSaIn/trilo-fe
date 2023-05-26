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
  return `<svg width="15" height="15" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="10" cy="10" r="10" fill="url(#paint0_linear_719_662)"/>
<defs>
<linearGradient id="paint0_linear_719_662" x1="10" y1="0" x2="10" y2="20" gradientUnits="userSpaceOnUse">
<stop stop-color="#10BCE4"/>
<stop offset="1" stop-color="#7756ED"/>
</linearGradient>
</defs>
</svg>`;
};

export {
  createSelectedTriloMarkerSvg,
  createTriloMarkerSvg,
  createPositionMarkerSvg,
};
