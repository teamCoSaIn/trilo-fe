/* eslint-disable no-nested-ternary */
import { useRecoilValue, useResetRecoilState } from 'recoil';
import styled from 'styled-components';

import { TScheduleSummary } from '@/api/plan';
import { ReactComponent as GoogleIcon } from '@/assets/google.svg';
import { ReactComponent as CancelIcon } from '@/assets/multiply.svg';
import { ReactComponent as NaverIcon } from '@/assets/naver.svg';
import CircularLoader from '@/components/common/CircularLoader';
import Description from '@/components/common/Description';
import Flex from '@/components/common/Flex';
import Spacing from '@/components/common/Spacing';
import PlaceCardStar from '@/components/PlaceTab/PlaceCardStar';
import color from '@/constants/color';
import { SELECTEDMARKERINFO_TAIL_Z_INDEX } from '@/constants/zIndex';
import useSearchSelectedPlaceInfo from '@/queryHooks/useSearchSelectedPlaceInfo';
import { PlacesService } from '@/states/googleMaps';
import { SelectedMarkerScheduleId } from '@/states/schedule';

interface SelectedMarkerInfoProps {
  scheduleData: TScheduleSummary;
}
const SelectedMarkerInfo = ({ scheduleData }: SelectedMarkerInfoProps) => {
  const placesService = useRecoilValue(PlacesService);
  const resetSelectedMarkerScheduleId = useResetRecoilState(
    SelectedMarkerScheduleId
  );

  const {
    isLoading,
    data: selectedPlaceData,
    isError,
  } = useSearchSelectedPlaceInfo(
    scheduleData.placeId,
    scheduleData.placeName,
    placesService,
    {
      lat: scheduleData.coordinate.latitude,
      lng: scheduleData.coordinate.longitude,
    }
  );

  const handleInfoBoxClick = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  const handleInfoBoxWheel = (event: React.WheelEvent) => {
    event.stopPropagation();
  };

  const handleInfoBoxMouseDown = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  const handleInfoBoxDoubleClick = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  const handleClickGoogleLink = (event: React.MouseEvent) => {
    event.stopPropagation();
    window.open(selectedPlaceData?.url || 'https://www.google.com/maps');
  };

  const handleClickNaverLink = (event: React.MouseEvent) => {
    event.stopPropagation();
    window.open(
      `https://search.naver.com/search.naver?where=nexearch&sm=top_hty&fbm=0&ie=utf8&query=${scheduleData.placeName}`
    );
  };

  const handleCancelBtnClick = () => {
    resetSelectedMarkerScheduleId();
  };

  const infoContent = scheduleData.placeId ? (
    <>
      <PlaceName title={selectedPlaceData?.name}>
        {selectedPlaceData?.name}
      </PlaceName>
      <Spacing height={3} />
      <PlaceRatingBox>
        <PlaceRating>
          {selectedPlaceData?.rating
            ? selectedPlaceData.rating.toFixed(1)
            : '0.0'}
        </PlaceRating>
        <PlaceCardStar rating={selectedPlaceData?.rating} />
      </PlaceRatingBox>
      <Spacing height={10} />
      <PlaceLinkBtnBox>
        <PlaceLinkBtn onClick={handleClickGoogleLink}>
          <GoogleIcon />
          구글 맵
        </PlaceLinkBtn>
        <PlaceLinkBtn onClick={handleClickNaverLink}>
          <NaverIcon />
          네이버
        </PlaceLinkBtn>
      </PlaceLinkBtnBox>
    </>
  ) : (
    <NoInfoBox column justifyCenter alignCenter>
      <Description fontSize={2.5}>🙅</Description>
      <Description fontSize={1.2}>장소에 대한 정보가 없습니다.</Description>
    </NoInfoBox>
  );

  return (
    <Flex
      column
      alignCenter
      onClick={handleInfoBoxClick}
      onWheel={handleInfoBoxWheel}
      onMouseDown={handleInfoBoxMouseDown}
      onDoubleClick={handleInfoBoxDoubleClick}
    >
      <Box column justifyCenter>
        {isError ? (
          <div>error!</div>
        ) : isLoading ? (
          <CircularLoader />
        ) : (
          infoContent
        )}
        <CancelBtn onClick={handleCancelBtnClick}>
          <CancelIcon width={10} height={10} />
        </CancelBtn>
      </Box>
      <Tail />
    </Flex>
  );
};

const Box = styled(Flex)`
  position: relative;
  width: 180px;
  height: 90px;
  padding-left: 12px;
  padding-right: 12px;
  background-color: ${color.white};
  border-radius: 11px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  cursor: auto;
`;

const CancelBtn = styled.button`
  position: absolute;
  top: 7px;
  right: 9px;
  &:hover {
    svg {
      fill: ${color.blue3};
    }
  }
`;

const Tail = styled.div`
  border-top: 10px solid ${color.white};
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 0 solid transparent;
  z-index: ${SELECTEDMARKERINFO_TAIL_Z_INDEX};
  cursor: auto;
`;

const PlaceName = styled.h2`
  font-style: normal;
  font-weight: 700;
  font-size: 1.4rem;
  line-height: 20px;
  padding-right: 10px;
  color: ${color.gray3};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const PlaceRatingBox = styled.div`
  display: flex;
  gap: 6px;
  align-items: center;
`;

const PlaceRating = styled.p`
  font-size: 1.2rem;
  font-weight: 700;
  color: #4f4f4f;
  margin-top: 3px;
`;

const PlaceLinkBtnBox = styled.div`
  display: flex;
  gap: 6px;
`;

const PlaceLinkBtn = styled.button`
  display: flex;
  gap: 5px;
  align-items: center;
  justify-content: center;
  width: 59px;
  height: 18px;
  background: #fff;
  box-shadow: 0 2px 10px 1px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 400;
`;

const NoInfoBox = styled(Flex)`
  gap: 10px;
`;

export default SelectedMarkerInfo;
