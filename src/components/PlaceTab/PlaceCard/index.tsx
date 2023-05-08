import { useRecoilValue, useSetRecoilState } from 'recoil';
import styled from 'styled-components';

import { ReactComponent as CopyIcon } from '@/assets/copy.svg';
import { ReactComponent as GoogleIcon } from '@/assets/google.svg';
import { ReactComponent as LogoIcon } from '@/assets/logo.svg';
import { ReactComponent as NaverIcon } from '@/assets/naver.svg';
import PlaceCardStar from '@/components/PlaceTab/PlaceCardStar';
import {
  MapInstance,
  PlaceCardLocation,
  GoogleMarkerLatLng,
} from '@/states/googleMaps';

interface PlaceCardProps {
  name: string | undefined;
  rating: number | undefined;
  address: string | undefined;
  numOfReviews: number | undefined;
  openingHours: google.maps.places.PlaceOpeningHours | undefined;
  googleMapLink: string | undefined;
  imgUrl: string | null;
  location: PlaceCardLocation;
}

const PlaceCard = ({
  name,
  rating,
  address,
  numOfReviews,
  openingHours,
  googleMapLink,
  imgUrl,
  location,
}: PlaceCardProps) => {
  const mapInstance = useRecoilValue(MapInstance);
  const setGoogleMarkerLatLng = useSetRecoilState(GoogleMarkerLatLng);

  const dateObj = new Date();
  const dayOfToday = dateObj.getDay();
  const businessHours = openingHours?.weekday_text
    ? openingHours.weekday_text[dayOfToday].slice(4).trim()
    : '정보 없음';

  const handleAddressBtnClick = async (event: React.MouseEvent) => {
    event.stopPropagation();
    if (address) {
      await navigator.clipboard.writeText(address);
      alert('copied!');
    }
  };

  const handlePlaceCardClick = () => {
    if (location.lat && location.lng) {
      const selectedLocation = { lat: location.lat, lng: location.lng };
      mapInstance?.setCenter(selectedLocation);
      setGoogleMarkerLatLng(selectedLocation);
    }
  };

  const handleClickGoogleLink = (event: React.MouseEvent) => {
    event.stopPropagation();
    window.open(googleMapLink || 'https://www.google.com/maps');
  };

  const handleClickNaverLink = (event: React.MouseEvent) => {
    event.stopPropagation();
    window.open(
      `https://search.naver.com/search.naver?where=nexearch&sm=top_hty&fbm=0&ie=utf8&query=${name}`
    );
  };

  return (
    <PlaceCardBox onClick={handlePlaceCardClick}>
      <PlaceCardContent>
        <PlaceCardTitle title={name}>{name}</PlaceCardTitle>
        <PlaceCardRatingBox>
          <PlaceCardRating>{rating?.toFixed(1)}</PlaceCardRating>
          <PlaceCardStar rating={rating} />
          <PlaceCardNumOfReviews>({numOfReviews})</PlaceCardNumOfReviews>
        </PlaceCardRatingBox>
        <PlaceCardAddressBtn onClick={handleAddressBtnClick} title={address}>
          <PlaceCardAddressSpan>{address}</PlaceCardAddressSpan>
          <CopyIcon />
        </PlaceCardAddressBtn>
        <PlaceCardBusinessHoursBox>
          영업시간
          <PlaceCardBusinessHours title={businessHours}>
            {businessHours}
          </PlaceCardBusinessHours>
        </PlaceCardBusinessHoursBox>
        <PlaceCardLinkBtnBox>
          <PlaceCardGoogleLinkBtn onClick={handleClickGoogleLink}>
            <GoogleIcon />
            구글 맵
          </PlaceCardGoogleLinkBtn>
          <PlaceCardGoogleLinkBtn onClick={handleClickNaverLink}>
            <NaverIcon />
            네이버
          </PlaceCardGoogleLinkBtn>
        </PlaceCardLinkBtnBox>
      </PlaceCardContent>
      {imgUrl ? (
        <PlaceCardImg src={imgUrl} />
      ) : (
        <LogoIcon width={120} height={120} />
      )}
    </PlaceCardBox>
  );
};

const PlaceCardBox = styled.div`
  display: flex;
  justify-content: space-between;
  width: 337px;
  height: 160px;
  background: #ffffff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border: 1px solid white;
  border-radius: 7px;
  padding: 18px;
  cursor: pointer;
  &:hover {
    border: 1px solid rgba(77, 119, 255, 1);
  }
`;

const PlaceCardContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const PlaceCardTitle = styled.h2`
  max-width: 160px;
  font-size: 14px;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const PlaceCardRatingBox = styled.div`
  display: flex;
  gap: 6px;
  align-items: center;
  margin-top: 10px;
`;

const PlaceCardRating = styled.span`
  font-size: 12px;
  font-weight: 700;
  color: #4f4f4f;
`;

const PlaceCardNumOfReviews = styled.span`
  font-size: 12px;
  font-weight: 400;
  color: #4f4f4f;
`;

const PlaceCardAddressBtn = styled.button`
  display: flex;
  gap: 5px;
  margin-top: 13px;
`;

const PlaceCardAddressSpan = styled.span`
  max-width: 150px;
  font-size: 12px;
  font-weight: 400;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const PlaceCardBusinessHoursBox = styled.div`
  display: flex;
  gap: 5px;
  margin-top: 12px;
  font-size: 12px;
  font-weight: 500;
  color: #4f4f4f;
`;

const PlaceCardBusinessHours = styled.span`
  max-width: 125px;
  font-size: inherit;
  font-weight: 400;
  color: inherit;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const PlaceCardLinkBtnBox = styled.div`
  display: flex;
  gap: 6px;
  margin-top: 11px;
`;

const PlaceCardGoogleLinkBtn = styled.button`
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

const PlaceCardImg = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 7px;
`;

export default PlaceCard;
