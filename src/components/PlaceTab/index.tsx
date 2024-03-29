import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components';
import { LatLng } from 'use-places-autocomplete';

import { ReactComponent as DeleteIcon } from '@/assets/delete.svg';
import { ReactComponent as SearchIcon } from '@/assets/search.svg';
import { ReactComponent as FocusedMarkerIcon } from '@/assets/triloMarker-focused.svg';
import Button from '@/components/common/Button';
import CircularLoader from '@/components/common/CircularLoader';
import Flex from '@/components/common/Flex';
import PlaceCard from '@/components/PlaceTab/PlaceCard';
import PlaceCardSkeleton from '@/components/PlaceTab/PlaceCardSkeleton';
import color from '@/constants/color';
import { PLACE_SEARCH_DEBOUNCE_TIME } from '@/constants/debounce';
import LAT_LNG_SEOUL from '@/constants/latlng';
import { PLACE_SEARCH_INPUT_Z_INDEX } from '@/constants/zIndex';
import useSearchPlacesByText from '@/queryHooks/useSearchPlacesByText';
import {
  PlacesService,
  AutocompleteService,
  MapInstance,
} from '@/states/googleMaps';
import { placeSearchInputRegExp } from '@/utils/regExp';
import truncate from '@/utils/truncate';

interface IAutocompleteData {
  placeId: string | undefined;
  mainText: string;
  description: string;
}

const PlaceTab = () => {
  const placeLabelDataList = [
    { name: '식당', id: 1 },
    { name: '관광명소', id: 2 },
    { name: '카페', id: 3 },
    { name: '호텔', id: 4 },
  ];

  const korToEng = {
    식당: 'restaurant',
    관광명소: 'attraction',
    카페: 'cafe',
    호텔: 'hotel',
  } as const;

  const placesService = useRecoilValue(PlacesService);
  const autocompleteService = useRecoilValue(AutocompleteService);
  const mapInstance = useRecoilValue(MapInstance);

  const [inputValue, setInputValue] = useState<string>('');
  const [searchText, setSearchText] = useState<string>('');
  const [isFirstRender, setIsFirstRender] = useState<boolean>(true);
  const [currAutocompleteIdx, setCurrAutocompleteIdx] = useState<number>(0);
  const [isAutocompleteVisible, setIsAutocompleteVisible] =
    useState<boolean>(false);
  const [autocompleteDataList, setAutocompleteDataList] = useState<
    IAutocompleteData[] | undefined
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
          description: prediction.description,
        };
      });
      setAutocompleteDataList(filteredPredictions);
    } else if (status === google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
      setAutocompleteDataList([]);
    } else {
      console.log(status);
    }
  };

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

  const handlePlaceSearchSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    const isInputValid = placeSearchInputRegExp.test(inputValue);
    if (placesService && mapInstance) {
      if (isInputValid) {
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
      } else if (inputValue === '') {
        toast.error('값을 입력해주세요!', {
          autoClose: 3000,
          pauseOnHover: false,
          draggable: false,
        });
      } else if (inputValue.length > 85) {
        toast.error('85자 이하의 글자만 검색할 수 있습니다.', {
          autoClose: 3000,
          pauseOnHover: false,
          draggable: false,
        });
      } else {
        toast.error('<, > 는 검색어에 포함할 수 없습니다.', {
          autoClose: 3000,
          pauseOnHover: false,
          draggable: false,
        });
      }
    } else {
      toast.error('Google Maps API Error', {
        autoClose: 3000,
        pauseOnHover: false,
        draggable: false,
      });
    }
  };

  const handlePlaceLabelClick = async (event: React.MouseEvent) => {
    const target = event.target as HTMLElement;
    if (placesService && mapInstance) {
      const innerText = target.innerText as keyof typeof korToEng;
      setCurLocation({
        lat: mapInstance.getCenter()?.lat() || LAT_LNG_SEOUL.lat,
        lng: mapInstance.getCenter()?.lng() || LAT_LNG_SEOUL.lng,
      });
      setInputValue(innerText);
      setSearchText(korToEng[innerText]);
      setIsFirstRender(false);
    }
  };

  const handleAutoCompleteClick = (description: string) => {
    if (placesService && mapInstance) {
      setCurLocation({
        lat: mapInstance.getCenter()?.lat() || LAT_LNG_SEOUL.lat,
        lng: mapInstance.getCenter()?.lng() || LAT_LNG_SEOUL.lng,
      });
      setInputValue(description);
      setSearchText(description);
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
    setTimeout(() => {
      setIsAutocompleteVisible(false);
    }, 100);
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

  const autocompleteList = autocompleteDataList?.length ? (
    autocompleteDataList?.map((autocompleteData, idx) => {
      const isSelected = currAutocompleteIdx === idx + 1;
      const newMainText = truncate(autocompleteData.mainText, 25);
      return (
        <Autocomplete
          key={autocompleteData.placeId || idx}
          isSelected={isSelected}
          onClick={() => {
            handleAutoCompleteClick(autocompleteData.description);
          }}
        >
          <div>
            {autocompleteData.placeId ? (
              <FocusedMarkerIcon width={16} height={16} />
            ) : (
              <SearchIcon width={16} height={16} />
            )}
          </div>
          <AutocompleteMainText>{newMainText}</AutocompleteMainText>
          <AutocompleteDescription>
            {autocompleteData.description}
          </AutocompleteDescription>
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
        id={place.place_id}
        name={place.name}
        rating={place.rating}
        address={place.formatted_address}
        numOfReviews={place.user_ratings_total}
        openingHours={place.opening_hours}
        googleMapLink={place.url}
        imgUrl={place.photos && place.photos[0].getUrl()}
        location={
          place.geometry?.location && {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          }
        }
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
  font-size: 1.6rem;
  font-weight: 400;
  line-height: 16px;
  z-index: ${PLACE_SEARCH_INPUT_Z_INDEX};
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
`;

const AutocompleteListBox = styled.ul`
  display: flex;
  flex-direction: column;
  padding: 10px 0 15px 0;
  font-size: 1.3rem;
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

const AutocompleteDescription = styled.span`
  font-size: 1rem;
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
  z-index: ${PLACE_SEARCH_INPUT_Z_INDEX};
`;

const DeleteIconBtnBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 46px;
  padding: 0 14px;
  z-index: ${PLACE_SEARCH_INPUT_Z_INDEX};
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
  font-size: 1.4rem;
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
  font-size: 2rem;
  font-weight: 700;
`;

export default PlaceTab;
