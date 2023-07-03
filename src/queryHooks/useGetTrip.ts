import { useQuery } from '@tanstack/react-query';

import HTTP from '@/api';
import { ITrip } from '@/api/trip';

interface IUseGetTripParam {
  tripId: ITrip['tripId'];
  onSuccess?: (data: ITrip) => void;
  onError?: () => void;
  enabled?: boolean;
}

const useGetTrip = ({
  tripId,
  onSuccess,
  onError,
  enabled,
}: IUseGetTripParam) => {
  return useQuery([`trip${tripId}`], () => HTTP.getTrip(tripId), {
    onSuccess,
    onError,
    suspense: true,
    staleTime: Infinity,
    cacheTime: 1000 * 60 * 10,
    enabled,
  });
};

export default useGetTrip;
