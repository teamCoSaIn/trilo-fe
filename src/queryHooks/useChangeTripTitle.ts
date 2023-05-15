import { useMutation, useQueryClient } from '@tanstack/react-query';

import HTTP from '@/api';
import { ITrip, TChangeTripTitleParams } from '@/api/trip';

const useChangeTripTitle = () => {
  const queryClient = useQueryClient();

  return useMutation(
    (titleData: TChangeTripTitleParams) => HTTP.changeTripTitle(titleData),
    {
      onMutate: async (titleData: TChangeTripTitleParams) => {
        await queryClient.cancelQueries(['tripList']);

        const previousTripList = queryClient.getQueryData<ITrip[]>([
          'tripList',
        ]);

        if (previousTripList) {
          queryClient.setQueryData<ITrip[]>(['tripList'], prevTripList => {
            return prevTripList?.map((trip: ITrip) => {
              if (trip.tripId === titleData.tripId) {
                return { ...trip, title: titleData.title };
              }
              return trip;
            });
          });
        }

        return { previousTripList };
      },
      onError: (
        err,
        variables,
        context?: { previousTripList: ITrip[] | undefined }
      ) => {
        if (context?.previousTripList) {
          queryClient.setQueryData<ITrip[]>(
            ['tripList'],
            context.previousTripList
          );
        }
      },
    }
  );
};

export default useChangeTripTitle;
