import { useEffect, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components';

import { ReactComponent as DeleteIcon } from '@/assets/delete.svg';
import { ReactComponent as MarkerIcon } from '@/assets/marker.svg';
import { ReactComponent as SearchIcon } from '@/assets/search.svg';
import Button from '@/components/common/Button';
import Flex from '@/components/common/Flex';
import CircularLoader from '@/components/common/Loader';
import PlaceCard from '@/components/PlaceTab/PlaceCard';
import PlaceCardSkeleton from '@/components/PlaceTab/PlaceCardSkeleton';
import color from '@/constants/color';
import PLACE_SEARCH_DEBOUNCE_TIME from '@/constants/debounce';
import useSearchPlacesByText from '@/queryHooks/useSearchPlacesByText';
import { PlacesService, AutocompleteService } from '@/states/googleMaps';
import { placeSearchInputRegExp } from '@/utils/regExp';

interface PlaceType {
  [key: string]: string;
}

interface AutocompleteType {
  placeId: string | undefined;
  mainText: string;
  address: string;
}

const PlaceTab = () => {
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
  const autocompleteService = useRecoilValue(AutocompleteService);
  const [inputValue, setInputValue] = useState<string>('');
  const [searchText, setSearchText] = useState<string>('');
  const [isFirstRender, setIsFirstRender] = useState<boolean>(true);
  const [isAutocompleteVisible, setIsAutocompleteVisible] =
    useState<boolean>(false);
  const [autocompleteDataList, setAutocompleteDataList] = useState<
    AutocompleteType[]
  >([]);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const { isLoading, data: placeList } = useSearchPlacesByText(
    searchText,
    placesService,
    isFirstRender
  );

  const handlePlaceSearchSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    const isInputValid = placeSearchInputRegExp.test(inputValue);
    if (placesService && isInputValid) {
      setSearchText(inputValue);
      setIsFirstRender(false);
      inputRef.current?.blur();
    }
    // TODO: 올바른 입력이 아닌 경우
    else if (inputValue === '') {
      alert('값을 입력해주세요.');
    } else {
      alert('특수문자를 제외한 영문, 한글, 숫자만 입력이 가능합니다.');
    }
  };

  const handlePlaceLabelClick = async (event: React.MouseEvent) => {
    const target = event.target as HTMLElement;
    if (placesService) {
      setInputValue(target.innerText);
      setSearchText(korToEng[target.innerText]);
      setIsFirstRender(false);
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

  const handleSearchInputOnFocus = () => {
    if (!autocompleteList.length) {
      return;
    }
    setIsAutocompleteVisible(true);
  };

  const handleSearchInputOnBlur = () => {
    // TODO: false
    setIsAutocompleteVisible(true);
  };

  const displaySuggestions = (
    queryPredictions: google.maps.places.QueryAutocompletePrediction[] | null,
    status: google.maps.places.PlacesServiceStatus
  ) => {
    if (
      status !== google.maps.places.PlacesServiceStatus.OK ||
      !queryPredictions
    ) {
      console.log(status);
      // TODO: ZERO_RESULTS 일 때 알려주기
      return;
    }

    const filteredPredictions = queryPredictions.map(queryPrediction => {
      const prediction =
        queryPrediction as google.maps.places.AutocompletePrediction;
      return {
        placeId: prediction.place_id,
        mainText: prediction.structured_formatting.main_text,
        address: prediction.description,
      };
    });

    setAutocompleteDataList(filteredPredictions);
  };

  useEffect(() => {
    let debouncingTimer: NodeJS.Timeout | null = null;

    if (autocompleteService && inputValue) {
      debouncingTimer = setTimeout(() => {
        autocompleteService.getQueryPredictions(
          {
            input: `${inputValue}`,
            // TODO: 지도 센터 기준으로 설정.
            location: new google.maps.LatLng(37.56, 127),
            radius: 1000,
          },
          displaySuggestions
        );
      }, PLACE_SEARCH_DEBOUNCE_TIME);
    } else {
      setAutocompleteDataList([]);
    }

    return () => {
      if (debouncingTimer) {
        clearTimeout(debouncingTimer);
      }
    };
  }, [inputValue]);

  useEffect(() => {
    if (
      autocompleteDataList.length &&
      inputRef.current === document.activeElement
    ) {
      setIsAutocompleteVisible(true);
    } else {
      // TODO: false
      setIsAutocompleteVisible(true);
    }
  }, [autocompleteDataList]);

  const autocompleteList = autocompleteDataList.map((autocompleteData, idx) => (
    <Autocomplete key={autocompleteData.placeId || idx}>
      <div>
        <MarkerIcon width={16} height={16} />
      </div>
      <AutocompleteMainText>{autocompleteData.mainText}</AutocompleteMainText>
      <AutocompleteAddress>{autocompleteData.address}</AutocompleteAddress>
    </Autocomplete>
  ));

  const PlaceLabelList = placeLabelDataList.map(placeLabelData => (
    <PlaceLabel
      key={placeLabelData.id}
      btnColor="gray"
      onClick={handlePlaceLabelClick}
    >
      {placeLabelData.name}
    </PlaceLabel>
  ));

  const PlaceCardList = isLoading
    ? Array.from({ length: 8 }).map((_, i) => <PlaceCardSkeleton key={i} />)
    : placeList?.map(place => (
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
      ));

  const DynamicDeleteIconBtn =
    !isFirstRender && isLoading ? (
      <CircularLoader size={20} />
    ) : (
      <DeleteIconBtn type="button" onClick={handleCancelBtnClick}>
        <DeleteIcon />
      </DeleteIconBtn>
    );

  // TODO: 초기화면 구현하기
  const DynamicPlaceCardList = isFirstRender ? (
    <div>초기화면</div>
  ) : (
    PlaceCardList
  );

  return (
    <PlaceSearchListBox column alignCenter>
      <PlaceSearchForm onSubmit={handlePlaceSearchSubmit}>
        <SearchIconBtn type="submit">
          <SearchIcon />
        </SearchIconBtn>
        <PlaceSearchInput
          ref={inputRef}
          placeholder="어디로 떠나볼까요?"
          value={inputValue}
          onChange={handleSearchInputChange}
          onFocus={handleSearchInputOnFocus}
          onBlur={handleSearchInputOnBlur}
        />
        <AutocompleteDropDown isVisible={isAutocompleteVisible}>
          <AutocompleteListBox>{autocompleteList}</AutocompleteListBox>
        </AutocompleteDropDown>
        <DeleteIconBtnBox>{DynamicDeleteIconBtn}</DeleteIconBtnBox>
      </PlaceSearchForm>

      <LabelBox>{PlaceLabelList}</LabelBox>

      <PlaceCardContainer>{DynamicPlaceCardList}</PlaceCardContainer>
    </PlaceSearchListBox>
  );
};

const PlaceSearchListBox = styled(Flex)`
  padding: 0 13px;
`;

const PlaceSearchForm = styled.form`
  display: flex;
  align-items: center;
  position: relative;
  width: 334px;
  height: 40px;
  margin: 15px 2px;
  border-radius: 15px;
  background-color: #ecf0ff;
`;

const PlaceSearchInput = styled.input`
  width: 242px;
  font-size: 16px;
  font-weight: 400;
  line-height: 16px;
  z-index: 2;
`;

const AutocompleteDropDown = styled.div<{ isVisible: boolean }>`
  ${props => (props.isVisible ? 'visibility: visible;' : 'visibility: hidden;')}
  position: absolute;
  top: 20px;
  left: 0;
  width: 334px;
  padding-top: 20px;
  border-bottom-left-radius: 15px;
  border-bottom-right-radius: 15px;
  background-color: #ecf0ff;
  z-index: 1;
`;

const AutocompleteListBox = styled.ul`
  display: flex;
  flex-direction: column;
  padding: 10px 0 15px 0;
  font-size: 16px;
  font-weight: 400;
  line-height: 16px;
  border-top: 1.5px solid #ccc;
`;

const Autocomplete = styled.li`
  display: flex;
  gap: 5px;
  align-items: center;
  padding: 10px 14px;
  &:hover {
    background-color: #ddd;
  }
`;

const AutocompleteMainText = styled.span`
  white-space: nowrap;
`;

const AutocompleteAddress = styled.span`
  font-size: 10px;
  font-weight: 200;
  color: #777;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const SearchIconBtn = styled.button`
  display: flex;
  align-items: center;
  margin: 0 14px;
  z-index: 2;
`;

const DeleteIconBtnBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 46px;
  padding: 0 14px;
  z-index: 2;
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

export default PlaceTab;
