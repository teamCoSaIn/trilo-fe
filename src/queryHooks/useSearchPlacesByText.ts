import { useQuery } from '@tanstack/react-query';

import searchPlacesByText from '@/api/searchPlacesByText';

const useSearchPlacesByText = (
  searchText: string,
  placesService: google.maps.places.PlacesService | null,
  isFirstRender: boolean
) => {
  return useQuery(
    ['placeList', searchText],
    () => {
      if (placesService) {
        return searchPlacesByText(searchText, placesService);
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
