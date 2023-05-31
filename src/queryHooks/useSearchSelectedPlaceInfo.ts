import { useQuery } from '@tanstack/react-query';
import { LatLng } from 'use-places-autocomplete';

import searchPlacesByText from '@/api/searchPlacesByText';

const useSearchSelectedPlaceInfo = (
  placeId: string,
  placeName: string,
  placesService: google.maps.places.PlacesService | null,
  latlng: LatLng
) => {
  return useQuery(
    ['placeList', placeId, latlng],
    async () => {
      if (placesService && placeId && placeName) {
        const result = await searchPlacesByText(
          placeName,
          placesService,
          latlng
        );
        const requiredPlace = result.find(data => data.place_id === placeId);
        // placeName 으로 검색 후 검색 결과 중 placeId 가 있는 경우
        if (requiredPlace) {
          return new Promise<google.maps.places.PlaceResult>(resolve => {
            resolve(requiredPlace);
          });
        }
        // 검색 결과 중 placeId 가 없는 경우
        return new Promise<google.maps.places.PlaceResult>(resolve => {
          resolve({});
        });
      }
      // placeName 이 없는 장소
      return new Promise<google.maps.places.PlaceResult>(resolve => {
        resolve({});
      });
    },
    { staleTime: Infinity, cacheTime: Infinity }
  );
};

export default useSearchSelectedPlaceInfo;
