import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { produce } from 'immer';

import HTTP from '@/api';
import { IGetTripListResponse, TChangeTripTitleParams } from '@/api/trip';

const useChangeTripTitle = () => {
  const queryClient = useQueryClient();

  return useMutation(
    (titleData: TChangeTripTitleParams) => HTTP.changeTripTitle(titleData),
    {
      onMutate: async (titleData: TChangeTripTitleParams) => {
        await queryClient.cancelQueries(['tripList']);

        const previousTripList = queryClient.getQueryData<
          InfiniteData<IGetTripListResponse>
        >(['tripList']);

        if (previousTripList) {
          queryClient.setQueryData<InfiniteData<IGetTripListResponse>>(
            ['tripList'],
            prevTripListPageData => {
              const nextTripListPageData = produce(
                prevTripListPageData,
                draftTripListPageData => {
                  draftTripListPageData?.pages.forEach(draftTripListData => {
                    (draftTripListData.trips || []).forEach(
                      (draftTripData, idx, arr) => {
                        if (draftTripData.tripId === titleData.tripId) {
                          arr[idx].title = titleData.title;
                        }
                      }
                    );
                  });
                }
              );
              return nextTripListPageData;
            }
          );
        }

        return { previousTripList };
      },
      onError: (
        err,
        variables,
        context?: {
          previousTripList: InfiniteData<IGetTripListResponse> | undefined;
        }
      ) => {
        if (context?.previousTripList) {
          queryClient.setQueryData<InfiniteData<IGetTripListResponse>>(
            ['tripList'],
            context.previousTripList
          );
        }
      },
    }
  );
};

export default useChangeTripTitle;
