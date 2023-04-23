import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components';

import { ReactComponent as DeleteIcon } from '@/assets/delete.svg';
import { ReactComponent as SearchIcon } from '@/assets/search.svg';
import Button from '@/components/common/Button';
import Flex from '@/components/common/Flex';
import PlaceCard from '@/components/PlaceSearchList/PlaceCard';
import color from '@/constants/color';
import { PlacesService, MapInstance } from '@/states/googleMaps';
import searchPlacesByText from '@/utils/searchPlacesByText';

const placeLabelData = [
  { name: '식당', id: 1 },
  { name: '관광명소', id: 2 },
  { name: '카페', id: 3 },
  { name: '호텔', id: 4 },
];

const PlaceSearchList = () => {
  const placesService = useRecoilValue(PlacesService);
  const mapInstance = useRecoilValue(MapInstance);
  // TODO: recoil로 변경
  const [placeList, setPlaceList] = useState<
    google.maps.places.PlaceResult[] | null
  >(null);
  const [inputValue, setInputValue] = useState('');

  const handleSearchInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setInputValue(event.target.value);
  };

  const handlePlaceSearchSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (placesService) {
      try {
        const data = await searchPlacesByText(inputValue, placesService);
        setPlaceList(data);
      } catch {
        console.log('Google Maps API Error');
      }
    }
  };

  const handlePlaceLabelClick = async (event: React.MouseEvent) => {
    const target = event.target as HTMLElement;
    setInputValue(target.innerText);
    if (placesService) {
      try {
        const data = await searchPlacesByText(target.innerText, placesService);
        setPlaceList(data);
      } catch {
        console.log('Google Maps API Error');
      }
    }
  };

  const PlaceLabelList = placeLabelData.map(data => (
    <PlaceLabel key={data.id} btnColor="gray" onClick={handlePlaceLabelClick}>
      {data.name}
    </PlaceLabel>
  ));

  const PlaceCardList = placeList ? (
    placeList.map(place => (
      <PlaceCard
        key={place.place_id}
        name={place.name}
        rating={place.rating}
        address={place.formatted_address}
        numOfReviews={place.user_ratings_total}
        openingHours={place.opening_hours}
        googleMapLink={place.url}
        imgUrl={place.photos ? place.photos[0].getUrl() : null}
      />
    ))
  ) : (
    <div>장소를 검색해주세요. ^^</div>
  );

  return (
    <PlaceSearchListBox column alignCenter>
      <PlaceSearchForm onSubmit={handlePlaceSearchSubmit}>
        <SearchIconBtn type="submit">
          <SearchIcon />
        </SearchIconBtn>
        <PlaceSearchInput
          placeholder="어디로 떠나볼까요?"
          value={inputValue}
          onChange={handleSearchInputChange}
        />
        <DeleteIconBtn>
          <DeleteIcon />
        </DeleteIconBtn>
      </PlaceSearchForm>

      <LabelBox>{PlaceLabelList}</LabelBox>

      <PlaceCardContainer>{PlaceCardList}</PlaceCardContainer>
    </PlaceSearchListBox>
  );
};

const PlaceSearchListBox = styled(Flex)`
  padding: 0 13px;
`;

const PlaceSearchForm = styled.form`
  display: flex;
  align-items: center;
  height: 40px;
  width: 334px;
  padding: 0 16px;
  margin: 15px 2px;
  border-radius: 30px;
  background-color: #ecf0ff;
`;

const PlaceSearchInput = styled.input`
  width: 300px;
  margin: 0 11px;
  font-size: 16px;
  font-weight: 400;
  line-height: 16px;
`;

const SearchIconBtn = styled.button`
  display: flex;
  align-items: center;
`;

const DeleteIconBtn = styled.button`
  display: flex;
  align-items: center;
  > svg {
    fill: #4d77ff;
  }
  > svg > path {
    fill: #fff;
  }
`;

const LabelBox = styled.div`
  display: flex;
  width: 334px;
  justify-content: space-evenly;
`;

const PlaceLabel = styled(Button)`
  font-size: 14px;
  font-weight: 700;
  &:hover,
  :focus {
    background-color: ${color.blue3};
    color: ${color.white};
    border: 1px solid ${color.blue3};
  }
`;

const PlaceCardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 20px 0;
`;

export default PlaceSearchList;
