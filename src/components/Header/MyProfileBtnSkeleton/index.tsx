import Skeleton from '@mui/material/Skeleton';
import styled from 'styled-components';

import Flex from '@/components/common/Flex';
import { HEADER_HEIGHT } from '@/constants/size';

const MyProfileBtnSkeleton = () => {
  return (
    <FlexBox justifyCenter alignCenter>
      <Skeleton variant="circular" width={39} height={39} />
    </FlexBox>
  );
};

const FlexBox = styled(Flex)`
  width: 92px;
  height: ${HEADER_HEIGHT};
`;
export default MyProfileBtnSkeleton;
