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

import DateSelector from '@/components/Map/DateSelector';
import useGetDailyPlanList from '@/queryHooks/useGetDailyPlanList';
import {
  PlacesService,
  MapInstance,
  AutocompleteService,
  GoogleMarkerLatLng,
  InfoBoxVisible,
} from '@/states/googleMaps';
import { DropdownIndexFamily, PlaceName } from '@/states/schedule';
import convertToDataUrl from '@/utils/convertToDataUrl';
import { createTriloMarkerSvg } from '@/utils/createMarkerSvg';

/* TODO:
- 일정 창이 열리면 해당 일정에 대한 마커를 물방울로 변경
- 일정 창이 닫히면 해당 일정에 대한 마커를 동그라미로 변경
*/

const Map = () => {
  const { tripId } = useParams();

  const setMapInstance = useSetRecoilState<google.maps.Map | null>(MapInstance);
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

  const { data: dailyPlanListData } = useGetDailyPlanList({
    tripId: +(tripId as string),
  });

  const googleMapCenter = useMemo(() => ({ lat: 21.3, lng: -157.83 }), []);

  const googleMapStyle = {
    width: '100%',
    height: '100%',
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

  const handleClickTriloMarker = (
    event: google.maps.MapMouseEvent,
    scheduleId: number
  ) => {
    console.log('trilo marker clicked.', scheduleId);
  };

  const scheduleMarkers = useMemo(() => {
    if (!dailyPlanListData) {
      return [];
    }
    return dailyPlanListData?.map(dailyPlanData =>
      dailyPlanData.schedules.map((scheduleData, idx) => {
        const triloMarkerDataUrl = convertToDataUrl(
          createTriloMarkerSvg(idx + 1, dailyPlanData.color)
        );
        return (
          <MarkerF
            key={scheduleData.scheduleId}
            position={{
              lat: scheduleData.coordinate.latitude,
              lng: scheduleData.coordinate.longitude,
            }}
            options={{
              icon: triloMarkerDataUrl,
            }}
            onClick={event => {
              handleClickTriloMarker(event, scheduleData.scheduleId);
            }}
          />
        );
      })
    );
  }, [dailyPlanListData]);

  const schedulePolyLines = useMemo(() => {
    if (!dailyPlanListData) {
      return [];
    }
    return dailyPlanListData.slice(0, -1).map(dailyPlanData =>
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
      {selectedSchedulePolyLines}
    </GoogleMap>
  );
};

export default Map;
