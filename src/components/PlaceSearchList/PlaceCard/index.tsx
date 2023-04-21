import styled from 'styled-components';

import { ReactComponent as CopyIcon } from '@/assets/copy.svg';
import { ReactComponent as GoogleIcon } from '@/assets/google.svg';
import { ReactComponent as NaverIcon } from '@/assets/naver.svg';
import Logo from '@/components/common/Logo';
import PlaceCardStar from '@/components/PlaceSearchList/PlaceCardStar';

interface PlaceCardProps {
  name: string | undefined;
  rating: number | undefined;
  address: string | undefined;
  numOfReviews: number | undefined;
  openingHours: google.maps.places.PlaceOpeningHours | undefined;
  imgUrl: string | null;
}

const PlaceCard = ({
  name,
  rating,
  address,
  numOfReviews,
  openingHours,
  imgUrl,
}: PlaceCardProps) => {
  // 긴 주소 ...처리
  let newAddress;
  if (address && address.length >= 15) {
    newAddress = `${address?.slice(0, 15).trim()}...`;
  } else {
    newAddress = address;
  }

  // 요일 및 영업 시간 계산
  const dateObj = new Date();
  const dayOfToday = dateObj.getDay();
  const businessHours = openingHours?.weekday_text
    ? openingHours.weekday_text[dayOfToday].slice(4).trim()
    : '정보 없음';

  const handleAddressBtnClick = async () => {
    if (address) {
      await navigator.clipboard.writeText(address);
      // TODO: 구글맵처럼 알림창으로 해야하나?
      alert('copied!');
    }
  };

  return (
    <PlaceCardBox>
      <PlaceCardContent>
        <PlaceCardTitle>{name}</PlaceCardTitle>
        <PlaceCardRatingBox>
          <PlaceCardRating>{rating?.toFixed(1)}</PlaceCardRating>
          <PlaceCardStar rating={rating} />
          <PlaceCardNumOfReviews>({numOfReviews})</PlaceCardNumOfReviews>
        </PlaceCardRatingBox>
        <PlaceCardAddressBtn onClick={handleAddressBtnClick}>
          {newAddress} <CopyIcon />
        </PlaceCardAddressBtn>
        <PlaceCardBusinessHoursBox>
          영업시간
          <PlaceCardBusinessHours>{businessHours}</PlaceCardBusinessHours>
        </PlaceCardBusinessHoursBox>
        <PlaceCardLinkBtnBox>
          <PlaceCardGoogleLinkBtn
            onClick={() => {
              window.open('https://www.google.com');
            }}
          >
            <GoogleIcon />
            구글 맵
          </PlaceCardGoogleLinkBtn>
          <PlaceCardGoogleLinkBtn
            onClick={() => {
              window.open('https://www.naver.com');
            }}
          >
            <NaverIcon />
            네이버
          </PlaceCardGoogleLinkBtn>
        </PlaceCardLinkBtnBox>
      </PlaceCardContent>
      {imgUrl ? (
        <PlaceCardImg src={imgUrl} />
      ) : (
        <Logo width={120} height={120} />
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
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
  border-radius: 7px;
  padding: 20px;
`;

const PlaceCardContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const PlaceCardTitle = styled.h2`
  font-size: 14px;
  font-weight: 700;
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
  font-size: 12px;
  font-weight: 400;
  margin-top: 15px;
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
  font-size: 12px;
  font-weight: 400;
  color: inherit;
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
  box-shadow: 0px 2px 10px 1px rgba(0, 0, 0, 0.1);
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
