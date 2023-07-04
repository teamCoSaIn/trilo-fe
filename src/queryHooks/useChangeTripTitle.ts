import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { produce } from 'immer';
import { toast } from 'react-toastify';

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
        err: AxiosError<{
          errorCode?: string;
          errorDetail?: string;
          errorMessage?: string;
        }>,
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
        if (err.response?.data?.errorDetail) {
          toast.error(err.response.data.errorDetail, {
            autoClose: 3000,
            pauseOnHover: false,
            draggable: false,
          });
        } else {
          toast.error('Server Error', {
            autoClose: 3000,
            pauseOnHover: false,
            draggable: false,
          });
        }
      },
    }
  );
};

export default useChangeTripTitle;
