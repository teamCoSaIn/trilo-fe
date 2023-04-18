import { GoogleMap } from '@react-google-maps/api';
import { useMemo } from 'react';

import { HEADER_HEIGHT } from '@/constants/size';

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

  return (
    <>
      <GoogleMap
        zoom={googleMapZoomLevel}
        center={googleMapCenter}
        mapContainerStyle={googleMapStyle}
        options={googleMapOptions}
      />
    </>
  );
};

export default Map;
