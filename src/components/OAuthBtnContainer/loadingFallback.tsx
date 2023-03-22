import React from 'react';
import styled from 'styled-components';

import color from '@/constants/color';

const LoadingFallback = () => {
  return <Loader />;
};

export default LoadingFallback;

const Loader = styled.div`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  border: 12px solid transparent;
  border-top-color: ${color.blue3};
  animation: spinner 0.8s ease infinite;
  @keyframes spinner {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;
