import {
  GoogleMap,
  MarkerF,
  PolylineF,
  InfoBoxF,
} from '@react-google-maps/api';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  useRecoilState,
  useRecoilValue,
  useResetRecoilState,
  useSetRecoilState,
} from 'recoil';
import styled from 'styled-components';
import { LatLng } from 'use-places-autocomplete';

import HTTP from '@/api';
import { ReactComponent as PositionIcon } from '@/assets/position.svg';
import CircularLoader from '@/components/common/CircularLoader';
import DateSelector from '@/components/Map/DateSelector';
import SelectedMarkerInfo from '@/components/Map/SelectedMarkerInfo';
import { SIZE_OF_TEMP_PLAN_PAGE, TEMP_PLAN_COLOR } from '@/constants/tempPlan';
import useGetDailyPlanList from '@/queryHooks/useGetDailyPlanList';
import useGetTempPlanPageList from '@/queryHooks/useGetTempPlanPageList';
import {
  PlacesService,
  MapInstance,
  AutocompleteService,
  GoogleMarkerLatLng,
  InfoBoxVisible,
} from '@/states/googleMaps';
import {
  DropdownIndexFamily,
  PlaceInfo,
  SelectedEditorScheduleId,
  SelectedMarkerScheduleId,
} from '@/states/schedule';
import convertToDataUrl from '@/utils/convertToDataUrl';
import {
  createPositionMarkerSvg,
  createSelectedTriloMarkerSvg,
  createTriloMarkerSvg,
} from '@/utils/createMarkerSvg';

const ZOOM_LEVEL = 15;

const Map = () => {
  const { tripId } = useParams();

  const [mapInstance, setMapInstance] = useRecoilState<google.maps.Map | null>(
    MapInstance
  );
  const resetMapInstance = useResetRecoilState(MapInstance);
  const setPlacesService =
    useSetRecoilState<google.maps.places.PlacesService | null>(PlacesService);
  const setAutocompleteService =
    useSetRecoilState<google.maps.places.AutocompleteService | null>(
      AutocompleteService
    );
  const [googleMarkerLatLng, setGoogleMarkerLatLng] =
    useRecoilState(GoogleMarkerLatLng);
  const [isDateSelectorVisible, setIsDateSelectorVisible] =
    useRecoilState(InfoBoxVisible);
  const dropdownMenuIdx = useRecoilValue(DropdownIndexFamily(tripId as string));
  const resetPlaceInfo = useResetRecoilState(PlaceInfo);
  const selectedEditorScheduleId = useRecoilValue(SelectedEditorScheduleId);
  const [selectedMarkerScheduleId, setSelectedMarkerScheduleId] =
    useRecoilState(SelectedMarkerScheduleId);
  const resetSelectedMarkerScheduleId = useResetRecoilState(
    SelectedMarkerScheduleId
  );

  const [userPosition, setUserPosition] = useState<LatLng | null>(null);
  const [isGetCurrPosLoading, setIsGetCurrPosLoading] = useState(false);

  const { data: dailyPlanListData } = useGetDailyPlanList({
    tripId: +(tripId as string),
  });

  const { data: tempPlanPageData } = useGetTempPlanPageList(
    +(tripId as string)
  );

  const { data: initLocationData } = useQuery(
    ['initLocation'],
    () => HTTP.getLocation(),
    {
      suspense: true,
      staleTime: Infinity,
    }
  );

  const googleMapStyle = {
    width: '100%',
    height: '100%',
  };

  const googleMapOptions = {
    streetViewControl: false,
    fullscreenControl: false,
    mapTypeControl: false,
  };

  const googleMapCenter = useMemo(() => {
    return {
      lat: initLocationData.latitude,
      lng: initLocationData.longitude,
    };
  }, []);

  const dateSelectorInfoBoxOptions = {
    closeBoxURL: '',
    enableEventPropagation: false,
    pixelOffset: new window.google.maps.Size(25, -35),
    disableAutoPan: true,
  };

  const SelectedMarkerInfoBoxOptions = {
    closeBoxURL: '',
    enableEventPropagation: false,
    pixelOffset:
      selectedEditorScheduleId === selectedMarkerScheduleId
        ? new window.google.maps.Size(-90, -170)
        : new window.google.maps.Size(-90, -150),
    disableAutoPan: true,
  };

  const boundsArray = useMemo(() => {
    const tempArr: google.maps.LatLngBounds[] = [];
    if (dailyPlanListData) {
      const allBounds = new google.maps.LatLngBounds();
      tempArr.push(allBounds);
      for (let i = 0; i < dailyPlanListData.days.length; i += 1) {
        const dailyPlanData = dailyPlanListData.days[i];
        const bounds = new google.maps.LatLngBounds();
        for (let j = 0; j < dailyPlanData.schedules.length; j += 1) {
          const scheduleData = dailyPlanData.schedules[j];
          bounds.extend({
            lat: scheduleData.coordinate.latitude,
            lng: scheduleData.coordinate.longitude,
          });
          allBounds.extend({
            lat: scheduleData.coordinate.latitude,
            lng: scheduleData.coordinate.longitude,
          });
        }
        tempArr.push(bounds);
      }
    }
    return tempArr;
  }, [dailyPlanListData]);

  const onGetCurPosSuccess = (position: GeolocationPosition) => {
    const curPosition = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    };
    if (mapInstance) {
      mapInstance.setCenter(curPosition);
      mapInstance.setZoom(ZOOM_LEVEL);
    }
    setUserPosition(curPosition);
    setIsGetCurrPosLoading(false);
  };

  const onGetCurPosFail = () => {
    alert(`현재 배포 버전(http)에서는 현재 위치 탐색이 불가능합니다.`);
    setIsGetCurrPosLoading(false);
  };

  useEffect(() => {
    if (!boundsArray[dropdownMenuIdx + 1].isEmpty() && mapInstance) {
      mapInstance.fitBounds(boundsArray[dropdownMenuIdx + 1], 200);
      if (
        boundsArray[dropdownMenuIdx + 1]
          .getNorthEast()
          .equals(boundsArray[dropdownMenuIdx + 1].getSouthWest())
      ) {
        mapInstance.setZoom(ZOOM_LEVEL);
      }
    }
  }, [dropdownMenuIdx, mapInstance]);

  useEffect(() => {
    return () => {
      resetMapInstance();
    };
  }, []);

  const handleOnMapLoad = (map: google.maps.Map) => {
    const service = new google.maps.places.PlacesService(map);
    const service2 = new google.maps.places.AutocompleteService();
    setMapInstance(map);
    setPlacesService(service);
    setAutocompleteService(service2);
  };

  const handleClickGoogleMap = (event: google.maps.MapMouseEvent) => {
    if (!isDateSelectorVisible && event.latLng) {
      const selectedLocation = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      };
      setGoogleMarkerLatLng(selectedLocation);
    }
    resetPlaceInfo();
  };

  const handleClickGoogleMarker = () => {
    setIsDateSelectorVisible(true);
  };

  const handleClickTriloMarker = (scheduleId: number) => () => {
    if (selectedMarkerScheduleId === scheduleId) {
      resetSelectedMarkerScheduleId();
    } else {
      setSelectedMarkerScheduleId(scheduleId);
    }
  };

  const handlePositionBtnClick = () => {
    setIsGetCurrPosLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        onGetCurPosSuccess,
        onGetCurPosFail
      );
    } else {
      alert(`Browser doesn't support Geolocation!`);
    }
  };

  const scheduleMarkers = useMemo(() => {
    if (!dailyPlanListData) {
      return [];
    }
    return dailyPlanListData.days.map(dailyPlanData =>
      dailyPlanData.schedules.map((scheduleData, idx) => {
        const svg =
          selectedEditorScheduleId === scheduleData.scheduleId ||
          selectedMarkerScheduleId === scheduleData.scheduleId
            ? createSelectedTriloMarkerSvg(idx + 1, dailyPlanData.dayColor.code)
            : createTriloMarkerSvg(idx + 1, dailyPlanData.dayColor.code);
        const triloMarkerDataUrl = convertToDataUrl(svg);
        const animation =
          selectedEditorScheduleId === scheduleData.scheduleId
            ? google.maps.Animation.BOUNCE
            : google.maps.Animation.DROP;

        return (
          <MarkerF
            key={scheduleData.scheduleId}
            position={{
              lat: scheduleData.coordinate.latitude,
              lng: scheduleData.coordinate.longitude,
            }}
            options={{
              icon: {
                url: triloMarkerDataUrl,
              },
            }}
            onClick={handleClickTriloMarker(scheduleData.scheduleId)}
            animation={animation}
          >
            {selectedMarkerScheduleId === scheduleData.scheduleId && (
              <InfoBoxF options={SelectedMarkerInfoBoxOptions}>
                <SelectedMarkerInfo scheduleData={scheduleData} />
              </InfoBoxF>
            )}
          </MarkerF>
        );
      })
    );
  }, [dailyPlanListData, selectedEditorScheduleId, selectedMarkerScheduleId]);

  const tempScheduleMarkers = useMemo(() => {
    if (!tempPlanPageData) {
      return [];
    }
    return tempPlanPageData.pages.map((page, pageIdx) => {
      return page.tempSchedules.map((scheduleData, idx) => {
        const svg =
          selectedEditorScheduleId === scheduleData.scheduleId
            ? createSelectedTriloMarkerSvg(
                pageIdx * SIZE_OF_TEMP_PLAN_PAGE + idx + 1,
                TEMP_PLAN_COLOR
              )
            : createTriloMarkerSvg(
                pageIdx * SIZE_OF_TEMP_PLAN_PAGE + idx + 1,
                TEMP_PLAN_COLOR
              );
        const triloMarkerDataUrl = convertToDataUrl(svg);
        const animation =
          selectedEditorScheduleId === scheduleData.scheduleId
            ? google.maps.Animation.BOUNCE
            : google.maps.Animation.DROP;
        return (
          <MarkerF
            key={scheduleData.scheduleId}
            position={{
              lat: scheduleData.coordinate.latitude,
              lng: scheduleData.coordinate.longitude,
            }}
            options={{
              icon: {
                url: triloMarkerDataUrl,
              },
            }}
            onClick={handleClickTriloMarker(scheduleData.scheduleId)}
            animation={animation}
          >
            {selectedMarkerScheduleId === scheduleData.scheduleId && (
              <InfoBoxF options={SelectedMarkerInfoBoxOptions}>
                <SelectedMarkerInfo scheduleData={scheduleData} />
              </InfoBoxF>
            )}
          </MarkerF>
        );
      });
    });
  }, [tempPlanPageData, selectedEditorScheduleId, selectedMarkerScheduleId]);

  const schedulePolyLines = useMemo(() => {
    if (!dailyPlanListData) {
      return [];
    }
    return dailyPlanListData.days.map(dailyPlanData =>
      dailyPlanData.schedules.slice(0, -1).map((scheduleData, idx) => {
        const path = [
          {
            lat: dailyPlanData.schedules[idx].coordinate.latitude,
            lng: dailyPlanData.schedules[idx].coordinate.longitude,
          },
          {
            lat: dailyPlanData.schedules[idx + 1].coordinate.latitude,
            lng: dailyPlanData.schedules[idx + 1].coordinate.longitude,
          },
        ];
        const options = {
          strokeWeight: 0,
          icons: [
            {
              icon: {
                path: 'M 0,0 0,2 1,2 1,0 Z',
                fillColor: dailyPlanData.dayColor.code,
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
  }, [dailyPlanListData]);

  const selectedScheduleMarkers =
    dropdownMenuIdx === -1 ? scheduleMarkers : scheduleMarkers[dropdownMenuIdx];

  const selectedTempScheduleMarkers =
    dropdownMenuIdx === -1 && tempScheduleMarkers;

  const selectedSchedulePolyLines =
    dropdownMenuIdx === -1
      ? schedulePolyLines
      : schedulePolyLines[dropdownMenuIdx];

  const userPositionMarkerUrl = convertToDataUrl(createPositionMarkerSvg());

  return (
    <GoogleMap
      zoom={ZOOM_LEVEL}
      center={googleMapCenter}
      mapContainerStyle={googleMapStyle}
      options={googleMapOptions}
      onLoad={handleOnMapLoad}
      onClick={handleClickGoogleMap}
    >
      {googleMarkerLatLng?.lat && googleMarkerLatLng?.lng && (
        <MarkerF
          position={{
            lat: googleMarkerLatLng.lat,
            lng: googleMarkerLatLng.lng,
          }}
          animation={google.maps.Animation.DROP}
          onClick={handleClickGoogleMarker}
        >
          {isDateSelectorVisible && (
            <InfoBoxF options={dateSelectorInfoBoxOptions}>
              <DateSelector />
            </InfoBoxF>
          )}
        </MarkerF>
      )}
      {selectedScheduleMarkers}
      {selectedTempScheduleMarkers}
      {selectedSchedulePolyLines}
      <GetPositionBtn onClick={handlePositionBtnClick}>
        {isGetCurrPosLoading ? (
          <CircularLoader size={20} />
        ) : (
          <PositionIcon strokeWidth="20" />
        )}
      </GetPositionBtn>
      {userPosition && (
        <MarkerF
          position={{ lat: userPosition.lat, lng: userPosition.lng }}
          options={{
            icon: {
              url: userPositionMarkerUrl,
            },
          }}
          animation={google.maps.Animation.DROP}
        />
      )}
    </GoogleMap>
  );
};

const GetPositionBtn = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  bottom: 115px;
  right: 10px;
  width: 40px;
  height: 40px;
  box-shadow: rgba(0, 0, 0, 0.3) 0 1px 4px -1px;
  background-color: #fff;
  border-radius: 2px;
  &:hover {
    svg > path {
      fill: #111;
    }
  }
`;

export default Map;
