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
      if (placesService && latlng) {
        return searchPlacesByText(searchText, placesService, latlng);
      }
      return new Promise<[]>(resolve => {
        setTimeout(() => {
          resolve([]);
        }, 2000);
      });
    },
    { staleTime: Infinity, cacheTime: Infinity, enabled: !isFirstRender }
  );
};

export default useSearchPlacesByText;
