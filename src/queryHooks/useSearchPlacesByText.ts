import { useQuery } from '@tanstack/react-query';

import searchPlacesByText, { LatLng } from '@/api/searchPlacesByText';

const useSearchPlacesByText = (
  searchText: string,
  placesService: google.maps.places.PlacesService | null,
  isFirstRender: boolean,
  latlng: LatLng
) => {
  return useQuery(
    ['placeList', searchText, latlng],
    () => {
      if (placesService) {
        return searchPlacesByText(searchText, placesService, latlng);
      }
      return new Promise<[]>(resolve => {
        resolve([]);
      });
    },
    { staleTime: Infinity, cacheTime: Infinity, enabled: !isFirstRender }
  );
};

export default useSearchPlacesByText;
