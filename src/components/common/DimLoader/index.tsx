import styled from 'styled-components';

import CircularLoader from '@/components/common/CircularLoader/index';
import Flex from '@/components/common/Flex/index';
import color from '@/constants/color';
import { LOADING_Z_INDEX } from '@/constants/zIndex';

const DimLoader = () => {
  return (
    <LoadingBox justifyCenter alignCenter>
      <CircularLoader />
    </LoadingBox>
  );
};

const LoadingBox = styled(Flex)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: ${color.black};
  opacity: 0.7;
  z-index: ${LOADING_Z_INDEX};
`;

export default DimLoader;
