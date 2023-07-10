import styled from 'styled-components';

import Flex from '@/components/common/Flex/index';
import color from '@/constants/color';
import { DIMLAYER_Z_INDEX } from '@/constants/zIndex';

const DimLayer = styled(Flex)`
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
