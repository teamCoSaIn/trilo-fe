import { GoogleMap } from '@react-google-maps/api';
import { useMemo } from 'react';
import { useRecoilState } from 'recoil';

import { HEADER_HEIGHT } from '@/constants/size';
import {
  PlacesService,
  MapInstance,
  AutocompleteService,
} from '@/states/googleMaps';

const Map = () => {
  const googleMapCenter = useMemo(() => ({ lat: 37.56, lng: 127 }), []);
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

  const handleOnMapLoad = (map: google.maps.Map) => {
    const service = new google.maps.places.PlacesService(map);
    const service2 = new google.maps.places.AutocompleteService();
    // if (mapInstance || placesService || autocompleteService) {
    //   return;
    // }
    setMapInstance(map);
    setPlacesService(service);
    setAutocompleteService(service2);
  };

  return (
    <>
      <GoogleMap
        zoom={googleMapZoomLevel}
        center={googleMapCenter}
        mapContainerStyle={googleMapStyle}
        options={googleMapOptions}
        onLoad={handleOnMapLoad}
      />
    </>
  );
};

export default Map;
