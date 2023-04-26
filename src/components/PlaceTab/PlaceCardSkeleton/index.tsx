import Skeleton from '@mui/material/Skeleton';
import styled from 'styled-components';

const PlaceCardSkeleton = () => {
  return (
    <PlaceCardSkeletonBox>
      <PlaceContentSkeletonBox>
        <Skeleton
          variant="rectangular"
          width={80}
          height={16}
          sx={{ borderRadius: '7px' }}
        />
        <Skeleton
          variant="rectangular"
          width={120}
          height={16}
          sx={{ borderRadius: '7px' }}
        />
        <Skeleton
          variant="rectangular"
          width={140}
          height={16}
          sx={{ borderRadius: '7px' }}
        />
        <Skeleton
          variant="rectangular"
          width={160}
          height={16}
          sx={{ borderRadius: '7px' }}
        />
        <Skeleton
          variant="rectangular"
          width={100}
          height={16}
          sx={{ borderRadius: '7px' }}
        />
      </PlaceContentSkeletonBox>
      <Skeleton
        variant="rectangular"
        width={120}
        height={120}
        sx={{ borderRadius: '7px' }}
      />
    </PlaceCardSkeletonBox>
  );
};

const PlaceCardSkeletonBox = styled.div`
  display: flex;
  justify-content: space-between;
  width: 337px;
  height: 160px;
  background: #ffffff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-radius: 7px;
  padding: 20px;
`;

const PlaceContentSkeletonBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 7px;
`;

export default PlaceCardSkeleton;
