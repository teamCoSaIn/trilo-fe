/* eslint-disable react/require-default-props */
import { useEffect } from 'react';
import styled from 'styled-components';

import Flex from '@/components/common/Flex/index';
import color from '@/constants/color';
import { DIMLAYER_Z_INDEX } from '@/constants/zIndex';

interface IDimLayerProps {
  justifyCenter?: boolean;
  alignCenter?: boolean;
  children?: React.ReactNode;
  onClick?: () => void;
}

const DimLayer = (props: IDimLayerProps) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'visible';
    };
  }, []);
  return <DimLayerBox {...props} />;
};

const DimLayerBox = styled(Flex)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: ${color.black};
  opacity: 0.7;
  z-index: ${DIMLAYER_Z_INDEX};
`;

export default DimLayer;
