import { GoogleMap, MarkerF } from '@react-google-maps/api';
import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useRecoilState } from 'recoil';

import { HEADER_HEIGHT } from '@/constants/size';
import useGetDayList from '@/queryHooks/useGetDayList';
import {
  PlacesService,
  MapInstance,
  AutocompleteService,
  SelectedMarker,
} from '@/states/googleMaps';
import convertToDataUrl from '@/utils/convertToDataURL';
import createMarkerSvg from '@/utils/createMarkerSvg';

const Map = () => {
  const googleMapCenter = useMemo(() => ({ lat: 21.3, lng: -157.82 }), []);
  const googleMapStyle = {
    width: '100%',
    height: `calc(100vh - ${HEADER_HEIGHT})`,
  };
  const googleMapOptions = {
    streetViewControl: false,
    fullscreenControl: false,
    mapTypeControl: false,
  };
  const googleMapZoomLevel = 12;

  const [mapInstance, setMapInstance] = useRecoilState<google.maps.Map | null>(
    MapInstance
  );
  const [placesService, setPlacesService] =
    useRecoilState<google.maps.places.PlacesService | null>(PlacesService);
  const [autocompleteService, setAutocompleteService] =
    useRecoilState<google.maps.places.AutocompleteService | null>(
      AutocompleteService
    );
  const [selectedMarker, setSelectedMarker] = useRecoilState(SelectedMarker);

  // TODO: 일정탭에서 설정한 atom으로 변경해야함.
  // 일단 0: 전체일정, 1: 첫날 일정, ...으로 설정
  const [selectedDateIdx, setSelectedDateIdx] = useState<number>(0);

  const { id } = useParams();
  const { data: tripDaysData } = useGetDayList({
    planId: id as string,
  });

  const handleOnMapLoad = (map: google.maps.Map) => {
    const service = new google.maps.places.PlacesService(map);
    const service2 = new google.maps.places.AutocompleteService();
    setMapInstance(map);
    setPlacesService(service);
    setAutocompleteService(service2);
  };

  const handleClickGoogleMap = (event: google.maps.MapMouseEvent) => {
    const selectedLocation = {
      lat: event.latLng?.lat(),
      lng: event.latLng?.lng(),
    };
    setSelectedMarker(selectedLocation);
  };

  const handleClickMarker = (event: google.maps.MapMouseEvent) => {
    console.log('marker clicked', event);
  };

  const scheduleMarkers = tripDaysData?.map(tripDayData =>
    tripDayData.schedules.map((scheduleData, idx) => {
      const triloMarkerDataUrl = convertToDataUrl(
        createMarkerSvg(idx + 1, tripDayData.color)
      );
      return (
        <MarkerF
          key={scheduleData.scheduleId}
          position={{
            lat: scheduleData.coordinate.latitude,
            lng: scheduleData.coordinate.longitude,
          }}
          onClick={handleClickMarker}
          icon={{
            url: triloMarkerDataUrl,
          }}
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
        {selectedMarker?.lat && selectedMarker?.lng && (
          <MarkerF
            position={{ lat: selectedMarker.lat, lng: selectedMarker.lng }}
            onClick={handleClickMarker}
          />
        )}
        {tripDaysData && scheduleMarkers}
      </GoogleMap>
    </>
  );
};

export default Map;
