import { useQuery } from '@tanstack/react-query';

import HTTP from '@/api';
import { ISchedule } from '@/api/schedule';

// interface IUseGetScheduleDetailsParams {
//   scheduleId: ISchedule['scheduleId'];
// }

const useGetScheduleDetails = (scheduleId: ISchedule['scheduleId']) => {
  return useQuery(
    [`scheduleDetail${scheduleId}`],
    () => HTTP.getScheduleDetails(scheduleId),
    {
      suspense: true,
      staleTime: Infinity,
    }
  );
};

export default useGetScheduleDetails;
