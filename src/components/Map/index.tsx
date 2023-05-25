import {
  GoogleMap,
  MarkerF,
  PolylineF,
  InfoBoxF,
} from '@react-google-maps/api';
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import {
  useRecoilState,
  useRecoilValue,
  useResetRecoilState,
  useSetRecoilState,
} from 'recoil';
import styled from 'styled-components';

import { ReactComponent as PositionIcon } from '@/assets/position.svg';
import DateSelector from '@/components/Map/DateSelector';
import useGetDailyPlanList from '@/queryHooks/useGetDailyPlanList';
import useGetTempPlanList from '@/queryHooks/useGetTempPlanList';
import {
  PlacesService,
  MapInstance,
  AutocompleteService,
  GoogleMarkerLatLng,
  InfoBoxVisible,
} from '@/states/googleMaps';
import {
  DropdownIndexFamily,
  PlaceName,
  SelectedScheduleId,
} from '@/states/schedule';
import convertToDataUrl from '@/utils/convertToDataUrl';
import {
  createSelectedTriloMarkerSvg,
  createTriloMarkerSvg,
} from '@/utils/createMarkerSvg';

const Map = () => {
  const { tripId } = useParams();

  const [mapInstance, setMapInstance] = useRecoilState<google.maps.Map | null>(
    MapInstance
  );
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
  const resetPlaceName = useResetRecoilState(PlaceName);
  const [selectedScheduleId, setSelectedScheduleId] =
    useRecoilState(SelectedScheduleId);
  const resetSelectedScheduleId = useResetRecoilState(SelectedScheduleId);

  const { data: dailyPlanListData } = useGetDailyPlanList({
    tripId: +(tripId as string),
  });

  const { data: tempPlanData } = useGetTempPlanList({
    tripId: +(tripId as string),
  });

  const googleMapCenter = useMemo(() => {
    if (dailyPlanListData) {
      for (let i = 0; i < dailyPlanListData.length; i += 1) {
        if (dailyPlanListData[i].schedules.length) {
          return {
            lat: dailyPlanListData[i].schedules[0].coordinate.latitude,
            lng: dailyPlanListData[i].schedules[0].coordinate.longitude,
          };
        }
      }
    }
    return {
      // 광화문
      lat: 37.576026,
      lng: 126.9768428,
    };
  }, []);

  const googleMapStyle = {
    width: '100%',
    height: '100%',
  };

  const googleMapOptions = {
    streetViewControl: false,
    fullscreenControl: false,
    mapTypeControl: false,
  };

  const googleMapZoomLevel = 12;

  const infoBoxOptions = {
    closeBoxURL: '',
    enableEventPropagation: false,
    pixelOffset: new window.google.maps.Size(25, -35),
  };

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
    resetPlaceName();
  };

  const handleClickGoogleMarker = () => {
    setIsDateSelectorVisible(true);
  };

  const handleClickTriloMarker = (scheduleId: number) => () => {
    if (selectedScheduleId === scheduleId) {
      resetSelectedScheduleId();
    } else {
      setSelectedScheduleId(scheduleId);
    }
  };

  const onGetCurPosSuccess = (position: GeolocationPosition) => {
    const curPos = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    };
    if (mapInstance) {
      mapInstance.setCenter(curPos);
    }
    // loading state false
  };

  const onGetCurPosFail = () => {
    // error message
  };

  const handlePositionBtnClick = () => {
    // loading state true;
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
    return dailyPlanListData.map(dailyPlanData =>
      dailyPlanData.schedules.map((scheduleData, idx) => {
        const svg =
          selectedScheduleId === scheduleData.scheduleId
            ? createSelectedTriloMarkerSvg(idx + 1, dailyPlanData.color)
            : createTriloMarkerSvg(idx + 1, dailyPlanData.color);
        const triloMarkerDataUrl = convertToDataUrl(svg);
        const animation =
          selectedScheduleId === scheduleData.scheduleId
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
                // anchor: new google.maps.Point(15, 18),
              },
            }}
            onClick={handleClickTriloMarker(scheduleData.scheduleId)}
            animation={animation}
          />
        );
      })
    );
  }, [dailyPlanListData, selectedScheduleId]);

  const tempScheduleMarkers = useMemo(() => {
    if (!tempPlanData) {
      return [];
    }
    return tempPlanData.schedules.map((scheduleData, idx) => {
      const svg =
        selectedScheduleId === scheduleData.scheduleId
          ? createSelectedTriloMarkerSvg(idx + 1, tempPlanData.color)
          : createTriloMarkerSvg(idx + 1, tempPlanData.color);
      const triloMarkerDataUrl = convertToDataUrl(svg);
      const animation =
        selectedScheduleId === scheduleData.scheduleId
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
              // anchor: new google.maps.Point(15, 18),
            },
          }}
          onClick={handleClickTriloMarker(scheduleData.scheduleId)}
          animation={animation}
        />
      );
    });
  }, [tempPlanData, selectedScheduleId]);

  const schedulePolyLines = useMemo(() => {
    if (!dailyPlanListData) {
      return [];
    }
    return dailyPlanListData.map(dailyPlanData =>
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
                fillColor: dailyPlanData.color,
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

  return (
    <GoogleMap
      zoom={googleMapZoomLevel}
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
          onClick={handleClickGoogleMarker}
        >
          {isDateSelectorVisible && (
            <InfoBoxF options={infoBoxOptions}>
              <DateSelector />
            </InfoBoxF>
          )}
        </MarkerF>
      )}
      {selectedScheduleMarkers}
      {selectedTempScheduleMarkers}
      {selectedSchedulePolyLines}
      <GetPositionBtn onClick={handlePositionBtnClick}>
        <PositionIcon strokeWidth="20" />
      </GetPositionBtn>
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
  box-shadow: rgba(0, 0, 0, 0.3) 0px 1px 4px -1px;
  background-color: #fff;
  border-radius: 2px;
  &:hover {
    svg > path {
      fill: #111;
    }
  }
`;

export default Map;
