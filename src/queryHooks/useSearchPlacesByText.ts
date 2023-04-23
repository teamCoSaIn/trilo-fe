import { useQuery } from '@tanstack/react-query';

import searchPlacesByText from '@/api/searchPlacesByText';

const useSearchPlacesByText = (
  searchText: string,
  placesService: google.maps.places.PlacesService | null,
  onSuccess: (data: google.maps.places.PlaceResult[]) => void
) => {
  return useQuery(
    ['placeList', searchText],
    () => {
      if (placesService) {
        return searchPlacesByText(searchText, placesService);
      }
      return new Promise<[]>(resolve => {
        resolve([]);
      });
    },
    { staleTime: Infinity, cacheTime: Infinity, onSuccess }
  );
};

export default useSearchPlacesByText;
