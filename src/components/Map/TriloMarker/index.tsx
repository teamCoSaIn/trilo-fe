import { MarkerF } from '@react-google-maps/api';

import { TScheduleSummary } from '@/api/plan';
import convertToDataUrl from '@/utils/convertToDataUrl';
import { createTriloMarkerSvg } from '@/utils/createMarkerSvg';

interface ITriloMarkerProps {
  scheduleData: TScheduleSummary;
  idx: number;
  color: string;
}

const TriloMarker = ({ scheduleData, idx, color }: ITriloMarkerProps) => {
  const triloMarkerDataUrl = convertToDataUrl(
    createTriloMarkerSvg(idx + 1, color)
  );

  const handleClickTriloMarker =
    (scheduleId: number) => (event: google.maps.MapMouseEvent) => {
      console.log('trilo marker clicked.', scheduleId, event);
    };

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
      onClick={handleClickTriloMarker(scheduleData.scheduleId)}
    />
  );
};

export default TriloMarker;
