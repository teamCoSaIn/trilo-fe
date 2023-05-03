import { useEffect, useRef, useState } from 'react';
import { useRecoilValue, useResetRecoilState } from 'recoil';
import styled from 'styled-components';

import { LatLng } from '@/api/searchPlacesByText';
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
import LAT_LNG_SEOUL from '@/constants/latlng';
import useSearchPlacesByText from '@/queryHooks/useSearchPlacesByText';
import {
  PlacesService,
  AutocompleteService,
  SelectedMarker,
  MapInstance,
} from '@/states/googleMaps';
import { placeSearchInputRegExp } from '@/utils/regExp';
import truncate from '@/utils/truncate';

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
  const mapInstance = useRecoilValue(MapInstance);
  const resetSelectedMarker = useResetRecoilState(SelectedMarker);

  const [inputValue, setInputValue] = useState<string>('');
  const [searchText, setSearchText] = useState<string>('');
  const [isFirstRender, setIsFirstRender] = useState<boolean>(true);
  const [currAutocompleteIdx, setCurrAutocompleteIdx] = useState<number>(0);
  const [isAutocompleteVisible, setIsAutocompleteVisible] =
    useState<boolean>(false);
  const [autocompleteDataList, setAutocompleteDataList] = useState<
    AutocompleteType[] | undefined
  >(undefined);
  const [curLocation, setCurLocation] = useState<LatLng>({
    lat: LAT_LNG_SEOUL.lat,
    lng: LAT_LNG_SEOUL.lng,
  });

  const throttlingTimer = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const { isLoading, data: placeSearchData } = useSearchPlacesByText(
    searchText,
    placesService,
    isFirstRender,
    curLocation
  );

  const handlePlaceSearchSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    const isInputValid = placeSearchInputRegExp.test(inputValue);
    if (placesService && isInputValid && mapInstance) {
      setCurLocation({
        lat: mapInstance.getCenter()?.lat() || LAT_LNG_SEOUL.lat,
        lng: mapInstance.getCenter()?.lng() || LAT_LNG_SEOUL.lng,
      });
      if (currAutocompleteIdx === 0) {
        setSearchText(inputValue);
      } else if (currAutocompleteIdx !== 0 && autocompleteDataList) {
        const selectedAutocomplete =
          autocompleteDataList[currAutocompleteIdx - 1].mainText;
        setInputValue(selectedAutocomplete);
        setSearchText(selectedAutocomplete);
      }
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
    if (placesService && mapInstance) {
      setCurLocation({
        lat: mapInstance.getCenter()?.lat() || LAT_LNG_SEOUL.lat,
        lng: mapInstance.getCenter()?.lng() || LAT_LNG_SEOUL.lng,
      });
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
    if (!autocompleteDataList) {
      return;
    }
    setIsAutocompleteVisible(true);
  };

  const handleSearchInputOnBlur = () => {
    setIsAutocompleteVisible(false);
  };

  const displaySuggestions = (
    queryPredictions: google.maps.places.QueryAutocompletePrediction[] | null,
    status: google.maps.places.PlacesServiceStatus
  ) => {
    if (
      status === google.maps.places.PlacesServiceStatus.OK &&
      queryPredictions
    ) {
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
    } else if (status === google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
      setAutocompleteDataList([]);
    } else {
      console.log(status);
    }
  };

  const handleSearchInputKeyDown = (
    event: React.KeyboardEvent<HTMLElement>
  ) => {
    if (!autocompleteDataList || !autocompleteDataList.length) {
      return;
    }
    if (!throttlingTimer.current) {
      if (event.key === 'ArrowDown') {
        setCurrAutocompleteIdx(
          prev => (prev + 1) % (autocompleteDataList.length + 1)
        );
      } else if (event.key === 'ArrowUp') {
        setCurrAutocompleteIdx(prev =>
          prev === 0 ? autocompleteDataList.length : prev - 1
        );
      }
      throttlingTimer.current = setTimeout(() => {
        throttlingTimer.current = null;
      }, 0);
    }
  };

  useEffect(() => {
    return () => {
      resetSelectedMarker();
    };
  }, []);

  useEffect(() => {
    setCurrAutocompleteIdx(0);

    let debouncingTimer: NodeJS.Timeout | null = null;

    if (autocompleteService && inputValue) {
      debouncingTimer = setTimeout(() => {
        autocompleteService.getQueryPredictions(
          {
            input: `${inputValue}`,
          },
          displaySuggestions
        );
      }, PLACE_SEARCH_DEBOUNCE_TIME);
    } else {
      setAutocompleteDataList(undefined);
    }

    return () => {
      if (debouncingTimer) {
        clearTimeout(debouncingTimer);
      }
    };
  }, [inputValue]);

  useEffect(() => {
    if (autocompleteDataList && inputRef.current === document.activeElement) {
      setIsAutocompleteVisible(true);
    } else {
      setIsAutocompleteVisible(false);
    }
  }, [autocompleteDataList]);

  const autocompleteList = autocompleteDataList?.length ? (
    autocompleteDataList?.map((autocompleteData, idx) => {
      let isSelected = false;
      if (currAutocompleteIdx === idx + 1) {
        isSelected = true;
      }
      const newMainText = truncate(autocompleteData.mainText, 25);
      return (
        <Autocomplete
          key={autocompleteData.placeId || idx}
          isSelected={isSelected}
        >
          <div>
            {autocompleteData.placeId ? (
              <MarkerIcon width={16} height={16} />
            ) : (
              <SearchIcon width={16} height={16} />
            )}
          </div>
          <AutocompleteMainText>{newMainText}</AutocompleteMainText>
          <AutocompleteAddress>{autocompleteData.address}</AutocompleteAddress>
        </Autocomplete>
      );
    })
  ) : (
    <AutocompleteMessageBox>
      일치하는 추천 검색어가 없습니다.
    </AutocompleteMessageBox>
  );

  const PlaceLabelList = placeLabelDataList.map(placeLabelData => (
    <PlaceLabel
      key={placeLabelData.id}
      btnColor="gray"
      onClick={handlePlaceLabelClick}
    >
      {placeLabelData.name}
    </PlaceLabel>
  ));

  const PlacesSearchResult = placeSearchData?.length ? (
    placeSearchData?.map(place => (
      <PlaceCard
        key={place.place_id}
        name={place.name}
        rating={place.rating}
        address={place.formatted_address}
        numOfReviews={place.user_ratings_total}
        openingHours={place.opening_hours}
        googleMapLink={place.url}
        imgUrl={place.photos ? place.photos[0].getUrl() : null}
        location={{
          lat: place.geometry?.location?.lat(),
          lng: place.geometry?.location?.lng(),
        }}
      />
    ))
  ) : (
    <NoticeMessageBox>검색 결과 없음</NoticeMessageBox>
  );

  const PlaceCardList = isLoading
    ? Array.from({ length: 8 }).map((_, i) => <PlaceCardSkeleton key={i} />)
    : PlacesSearchResult;

  const DynamicDeleteIconBtn =
    !isFirstRender && isLoading ? (
      <CircularLoader size={20} />
    ) : (
      <DeleteIconBtn type="button" onClick={handleCancelBtnClick}>
        <DeleteIcon />
      </DeleteIconBtn>
    );

  const DynamicPlaceCardList = isFirstRender ? (
    <NoticeMessageBox>장소를 검색해주세요.</NoticeMessageBox>
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
          onKeyDown={handleSearchInputKeyDown}
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
  font-size: 13px;
  font-weight: 400;
  line-height: 16px;
  border-top: 1.5px solid #ccc;
`;

const Autocomplete = styled.li<{ isSelected: boolean }>`
  display: flex;
  gap: 5px;
  align-items: center;
  padding: 10px 14px;
  &:hover {
    background-color: #ddd;
  }
  ${props =>
    props.isSelected ? 'background-color: #ddd;' : 'background-color: none;'};
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

const AutocompleteMessageBox = styled.div`
  padding: 10px 14px;
  color: #b6b6b6;
  text-align: center;
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
  height: 100%;
`;

const NoticeMessageBox = styled.div`
  margin-top: 200px;
  color: #b6b6b6;
  font-size: 20px;
  font-weight: 700;
`;

export default PlaceTab;
