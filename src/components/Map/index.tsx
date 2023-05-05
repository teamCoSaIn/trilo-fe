import {
  GoogleMap,
  MarkerF,
  PolylineF,
  InfoBoxF,
} from '@react-google-maps/api';
import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';

import { HEADER_HEIGHT } from '@/constants/size';
import useGetDayList from '@/queryHooks/useGetDayList';
import {
  PlacesService,
  MapInstance,
  AutocompleteService,
  GoogleMarkerLatLng,
} from '@/states/googleMaps';
import convertToDataUrl from '@/utils/convertToDataURL';
import { createTriloMarkerSvg } from '@/utils/createMarkerSvg';

/* TODO:
- 일정 창이 열리면 해당 일정에 대한 마커를 물방울로 변경
- 일정 창이 닫히면 해당 일정에 대한 마커를 동그라미로 변경
*/

const Map = () => {
  const [mapInstance, setMapInstance] = useRecoilState<google.maps.Map | null>(
    MapInstance
  );
  const [placesService, setPlacesService] =
    useRecoilState<google.maps.places.PlacesService | null>(PlacesService);
  const [autocompleteService, setAutocompleteService] =
    useRecoilState<google.maps.places.AutocompleteService | null>(
      AutocompleteService
    );
  const [googleMarkerLatLng, setGoogleMarkerLatLng] =
    useRecoilState(GoogleMarkerLatLng);

  // TODO: 일정탭에서 설정한 atom으로 변경해야함.
  // 일단 0: 전체일정, 1: 첫날 일정, ...으로 설정
  const [selectedDateIdx, _] = useState<number>(0);

  const { id } = useParams();

  const { data: tripDaysData } = useGetDayList({
    planId: id as string,
  });

  const googleMapCenter = useMemo(() => ({ lat: 21.3, lng: -157.83 }), []);

  const googleMapStyle = {
    width: '100%',
    height: `calc(100vh - ${HEADER_HEIGHT})`,
  };

  const googleMapOptions = {
    streetViewControl: false,
    fullscreenControl: false,
    mapTypeControl: false,
  };

  const googleMapZoomLevel = 14;

  const infoBoxOptions = {
    closeBoxURL: '',
    enableEventPropagation: false,
    pixelOffset: new window.google.maps.Size(25, -35),
  };

  const handleOnMapLoad = (map: google.maps.Map) => {
    const service = new google.maps.places.PlacesService(map);
    const service2 = new google.maps.places.AutocompleteService();
    if (mapInstance || autocompleteService || placesService) {
      console.log('이미 설정되어 있습니다.');
      return;
    }
    setMapInstance(map);
    setPlacesService(service);
    setAutocompleteService(service2);
  };

  const handleClickGoogleMap = (event: google.maps.MapMouseEvent) => {
    const selectedLocation = {
      lat: event.latLng?.lat(),
      lng: event.latLng?.lng(),
    };
    setGoogleMarkerLatLng(selectedLocation);
  };

  const handleClickGoogleMarker = (event: google.maps.MapMouseEvent) => {
    console.log('marker clicked', event);
    // TODO: body에 이벤트를 걸고 click away listener로 dateSelector 끄기
  };

  const handleClickTriloMarker = (
    event: google.maps.MapMouseEvent,
    scheduleId: number
  ) => {
    console.log('trilo marker clicked.', scheduleId);
  };

  const handleClickInfoBox = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  const handleWheelInfoBox = (event: React.WheelEvent) => {
    event.stopPropagation();
  };

  const handleMouseDownInfoBox = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  const scheduleMarkers = tripDaysData
    ?.filter(tripDayData => tripDayData.schedules.length > 0)
    .map(tripDayData =>
      tripDayData.schedules.map((scheduleData, idx) => {
        const triloMarkerDataUrl = convertToDataUrl(
          createTriloMarkerSvg(idx + 1, tripDayData.color)
        );
        return (
          <MarkerF
            key={scheduleData.scheduleId}
            position={{
              lat: scheduleData.coordinate.latitude,
              lng: scheduleData.coordinate.longitude,
            }}
            icon={{
              url: triloMarkerDataUrl,
            }}
            onClick={event => {
              handleClickTriloMarker(event, scheduleData.scheduleId);
            }}
          />
        );
      })
    );

  const schedulePolyLines = tripDaysData
    ?.filter(tripDayData => tripDayData.schedules.length > 1)
    .map(tripDayData =>
      tripDayData.schedules.slice(0, -1).map((scheduleData, idx) => {
        const path = [
          {
            lat: tripDayData.schedules[idx].coordinate.latitude,
            lng: tripDayData.schedules[idx].coordinate.longitude,
          },
          {
            lat: tripDayData.schedules[idx + 1].coordinate.latitude,
            lng: tripDayData.schedules[idx + 1].coordinate.longitude,
          },
        ];
        const options = {
          strokeWeight: 0,
          icons: [
            {
              icon: {
                path: 'M 0,0 0,2 1,2 1,0 Z',
                fillColor: tripDayData.color,
                fillOpacity: 1,
                scale: 2.8,
                strokeWeight: 0,
              },
              repeat: '10px',
            },
          ],
        };
        return (
          <PolylineF
            key={scheduleData.scheduleId}
            path={path}
            options={options}
          />
        );
      })
    );

  return (
    <>
      <GoogleMap
        zoom={googleMapZoomLevel}
        center={googleMapCenter}
        mapContainerStyle={googleMapStyle}
        options={googleMapOptions}
        onLoad={handleOnMapLoad}
        onClick={handleClickGoogleMap}
      >
        {googleMarkerLatLng?.lat && googleMarkerLatLng?.lng && (
          <>
            <MarkerF
              position={{
                lat: googleMarkerLatLng.lat,
                lng: googleMarkerLatLng.lng,
              }}
              onClick={handleClickGoogleMarker}
            >
              <InfoBoxF options={infoBoxOptions}>
                <DateSelectorBox
                  onClick={handleClickInfoBox}
                  onWheel={handleWheelInfoBox}
                  onMouseDown={handleMouseDownInfoBox}
                >
                  <DateSelctorHeader>일정 추가하기</DateSelctorHeader>
                  <DateSelectorDateListBox>
                    <DateSelectorDateList>
                      <DateSelectorDateBtn>
                        Day 1 - 23.02.16
                      </DateSelectorDateBtn>
                    </DateSelectorDateList>
                    <DateSelectorDateList>
                      <DateSelectorDateBtn>
                        Day 2 - 23.02.17
                      </DateSelectorDateBtn>
                    </DateSelectorDateList>
                    <DateSelectorDateList>
                      <DateSelectorDateBtn>
                        Day 3 - 23.02.18
                      </DateSelectorDateBtn>
                    </DateSelectorDateList>
                    <DateSelectorDateList>
                      <DateSelectorDateBtn>
                        Day 4 - 23.02.18
                      </DateSelectorDateBtn>
                    </DateSelectorDateList>
                    <DateSelectorDateList>
                      <DateSelectorDateBtn>
                        Day 5 - 23.02.18
                      </DateSelectorDateBtn>
                    </DateSelectorDateList>
                    <DateSelectorDateList>
                      <DateSelectorDateBtn>
                        Day 6 - 23.02.18
                      </DateSelectorDateBtn>
                    </DateSelectorDateList>
                  </DateSelectorDateListBox>
                  <DateSelectorTempStorageBox>
                    <DateSelectorDateBtn>임시 보관함</DateSelectorDateBtn>
                  </DateSelectorTempStorageBox>
                </DateSelectorBox>
              </InfoBoxF>
            </MarkerF>
          </>
        )}
        {tripDaysData && scheduleMarkers}
        {tripDaysData && schedulePolyLines}
      </GoogleMap>
    </>
  );
};

const DateSelectorBox = styled.div`
  width: 140px;
  background-color: #f6f6f6;
  border-radius: 5px;
`;

const DateSelctorHeader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 36px;
  padding: 8px 30px;
  font-size: 14px;
  font-weight: 400;
  color: #fff;
  background-color: #456ceb;
  border-radius: 5px 5px 0 0;
`;

const DateSelectorDateListBox = styled.ul`
  padding: 5px 11px;
  max-height: 126px;
  overflow-y: overlay;
  ::-webkit-scrollbar {
    width: 6px;
  }
  ::-webkit-scrollbar-thumb {
    background-color: #bbb;
    border-radius: 20px;
  }
`;

const DateSelectorDateList = styled.li`
  width: 118px;
  height: 25px;
  text-align: center;
  font-weight: 400;
  font-size: 12px;
  font-family: 'Noto Sans KR';
  color: #4f4f4f;
  &:hover {
    background: #ecf0ff;
    border-radius: 11.5px;
  }
`;

const DateSelectorDateBtn = styled.button`
  font-size: inherit;
  font-weight: inherit;
  font-family: inherit;
  color: inherit;
  width: 100%;
  height: 100%;
`;

const DateSelectorTempStorageBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 36px;
  font-size: 12px;
  font-weight: 500;
  color: #4d77ff;
  background-color: #ecf0ff;
  border-radius: 0px 0px 5px 5px;
`;

export default Map;
