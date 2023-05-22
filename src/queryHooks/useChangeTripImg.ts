import { useMutation, useQueryClient } from '@tanstack/react-query';

import HTTP from '@/api';
import { ITrip } from '@/api/trip';

interface IUseChangeTripImgParams {
  imgData: FormData;
  imgUrl: string;
}
const useChangeTripImg = () => {
  const queryClient = useQueryClient();

  return useMutation(
    ({ imgData }: IUseChangeTripImgParams) => HTTP.changeTripImg(imgData),
    {
      onMutate: async ({ imgData, imgUrl }) => {
        await queryClient.cancelQueries(['tripList']);

        const previousTripList = queryClient.getQueryData<ITrip[]>([
          'tripList',
        ]);

        if (previousTripList) {
          queryClient.setQueryData<ITrip[]>(['tripList'], prevTripList => {
            const tripId = imgData.get('tripId');
            if (!tripId) {
              return;
            }
            return prevTripList?.map((trip: ITrip) => {
              if (trip.tripId === +tripId) {
                return { ...trip, picUrl: imgUrl };
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

export default useChangeTripImg;
