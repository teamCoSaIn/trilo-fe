import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components';

import { ReactComponent as DeleteIcon } from '@/assets/delete.svg';
import { ReactComponent as SearchIcon } from '@/assets/search.svg';
import Button from '@/components/common/Button';
import Flex from '@/components/common/Flex';
import CircularLoader from '@/components/common/Loader';
import PlaceCard from '@/components/PlaceSearchList/PlaceCard';
import color from '@/constants/color';
import useSearchPlacesByText from '@/queryHooks/useSearchPlacesByText';
import { PlacesService, MapInstance } from '@/states/googleMaps';
import { placeSearchInputRegExp } from '@/utils/regExp';

interface PlaceType {
  [key: string]: string;
}

const PlaceSearchList = () => {
  const placeLabelDataList = [
    { name: '식당', id: 1 },
    { name: '관광명소', id: 2 },
    { name: '카페', id: 3 },
    { name: '호텔', id: 4 },
  ];

  const korToEng: PlaceType = {
    식당: 'restaurant',
    관광명소: 'attraction',
    카페: 'cafe',
    호텔: 'hotel',
  };

  const placesService = useRecoilValue(PlacesService);
  const mapInstance = useRecoilValue(MapInstance);

  const [inputValue, setInputValue] = useState<string>('');
  const [searchText, setSearchText] = useState<string>('');
  const [placeList, setPlaceList] = useState<
    google.maps.places.PlaceResult[] | []
  >([]);

  const handleOnSuccess = (data: google.maps.places.PlaceResult[]) => {
    console.log(data);
    setPlaceList(data);
  };

  const { isFetching } = useSearchPlacesByText(
    searchText,
    placesService,
    handleOnSuccess
  );

  const handlePlaceSearchSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    const isInputValid = placeSearchInputRegExp.test(inputValue);
    if (placesService && isInputValid) {
      setSearchText(inputValue);
    }
  };

  const handlePlaceLabelClick = async (event: React.MouseEvent) => {
    const target = event.target as HTMLElement;
    if (placesService) {
      setInputValue(target.innerText);
      setSearchText(korToEng[target.innerText]);
    }
  };

  const handleSearchInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setInputValue(event.target.value);
  };

  const handleCancelBtnClick = () => {
    setInputValue('');
  };

  const PlaceLabelList = placeLabelDataList.map(placeLabelData => (
    <PlaceLabel
      key={placeLabelData.id}
      btnColor="gray"
      onClick={handlePlaceLabelClick}
    >
      {placeLabelData.name}
    </PlaceLabel>
  ));

  const PlaceCardList = placeList.length ? (
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
    // TODO: 디자인 나오면 default UI 화면 구성하기.
    <div>장소 검색 탭 초기 화면</div>
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
        <DynamicDeleteIconBtnBox>
          {isFetching ? (
            <CircularLoader size={20} />
          ) : (
            <DeleteIconBtn onClick={handleCancelBtnClick}>
              <DeleteIcon />
            </DeleteIconBtn>
          )}
        </DynamicDeleteIconBtnBox>
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
  margin: 15px 2px;
  border-radius: 30px;
  background-color: #ecf0ff;
`;

const PlaceSearchInput = styled.input`
  width: 242px;
  font-size: 16px;
  font-weight: 400;
  line-height: 16px;
`;

const SearchIconBtn = styled.button`
  display: flex;
  align-items: center;
  width: 46px;
  padding: 0 14px;
`;

const DynamicDeleteIconBtnBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 46px;
  padding: 0 14px;
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
