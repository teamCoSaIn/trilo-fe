import { useRecoilValue } from 'recoil';
import styled from 'styled-components';

import { TScheduleSummary } from '@/api/plan';
import { ReactComponent as GoogleIcon } from '@/assets/google.svg';
import { ReactComponent as NaverIcon } from '@/assets/naver.svg';
import CircularLoader from '@/components/common/CircularLoader';
import Flex from '@/components/common/Flex';
import PlaceCardStar from '@/components/PlaceTab/PlaceCardStar';
import color from '@/constants/color';
import useSearchPlaceInfo from '@/queryHooks/useSearchPlaceInfo';
import { PlacesService } from '@/states/googleMaps';

interface SelectedMarkerInfoProps {
  scheduleData: TScheduleSummary;
}
const SelectedMarkerInfo = ({ scheduleData }: SelectedMarkerInfoProps) => {
  const placesService = useRecoilValue(PlacesService);

  const {
    isLoading,
    data: placeSearchData,
    isError,
  } = useSearchPlaceInfo(scheduleData.placeName, placesService, {
    lat: scheduleData.coordinate.latitude,
    lng: scheduleData.coordinate.longitude,
  });

  // place Id 같은 장소 찾아야함.
  const selectedPlace = placeSearchData?.[0];

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
    window.open(selectedPlace?.url || 'https://www.google.com/maps');
  };

  const handleClickNaverLink = (event: React.MouseEvent) => {
    event.stopPropagation();
    window.open(
      `https://search.naver.com/search.naver?where=nexearch&sm=top_hty&fbm=0&ie=utf8&query=${scheduleData.placeName}`
    );
  };

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
          <>
            <PlaceName title={selectedPlace?.name}>
              {selectedPlace?.name || '알 수 없음'}
            </PlaceName>
            <PlaceRatingBox>
              <PlaceRating>
                {selectedPlace?.rating
                  ? selectedPlace.rating.toFixed(1)
                  : '0.0'}
              </PlaceRating>
              <PlaceCardStar rating={selectedPlace?.rating} />
            </PlaceRatingBox>
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
        )}
      </Box>
      <Tail />
    </Flex>
  );
};

const Box = styled(Flex)`
  width: 180px;
  height: 90px;
  padding-left: 12px;
  padding-right: 12px;
  background-color: ${color.white};
  border-radius: 11px;
  gap: 7px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const Tail = styled.div`
  border-top: 10px solid ${color.white};
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 0 solid transparent;
`;

const PlaceName = styled.h2`
  font-style: normal;
  font-weight: 700;
  font-size: 1.4rem;
  line-height: 20px;
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
  font-size: 12px;
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
  font-size: 8px;
  font-weight: 400;
`;

export default SelectedMarkerInfo;
