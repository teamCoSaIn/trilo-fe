import { useMutation, useQueryClient } from '@tanstack/react-query';

import HTTP from '@/api';
import { PlanCardData, PlanCardTitleType } from '@/api/planCard';

const useChangePlanCardTitle = () => {
  const queryClient = useQueryClient();

  return useMutation(
    (titleData: PlanCardTitleType) => HTTP.changePlanCardTitle(titleData),
    {
      onMutate: async (titleData: PlanCardTitleType) => {
        await queryClient.cancelQueries(['planCardList']);

        const previousPlanCardList = queryClient.getQueryData<PlanCardData[]>([
          'planCardList',
        ]);

        if (previousPlanCardList) {
          queryClient.setQueryData<PlanCardData[]>(
            ['planCardList'],
            prevPlanCardList => {
              return prevPlanCardList?.map((planCard: PlanCardData) => {
                if (planCard.id === titleData.id) {
                  return { ...planCard, title: titleData.title };
                }
                return planCard;
              });
            }
          );
        }

        return { previousPlanCardList };
      },
      onError: (
        err,
        variables,
        context?: { previousPlanCardList: PlanCardData[] | undefined }
      ) => {
        if (context?.previousPlanCardList) {
          queryClient.setQueryData<PlanCardData[]>(
            ['planCardList'],
            context.previousPlanCardList
          );
        }
      },
    }
  );
};

export default useChangePlanCardTitle;
