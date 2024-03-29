import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useRecoilValue, useResetRecoilState, useSetRecoilState } from 'recoil';
import styled from 'styled-components';

import HTTP from '@/api';
import { ICreateScheduleParams } from '@/api/schedule';
import DimLoader from '@/components/common/DimLoader';
import Portal from '@/components/common/Portal';
import useGetDailyPlanList from '@/queryHooks/useGetDailyPlanList';
import { GoogleMarkerLatLng, InfoBoxVisible } from '@/states/googleMaps';
import { PlaceInfo } from '@/states/schedule';

const DateSelector = () => {
  const { tripId } = useParams();

  const { data: dailyPlanListData } = useGetDailyPlanList({
    tripId: +(tripId as string),
  });

  const setIsDateSelectorVisible = useSetRecoilState(InfoBoxVisible);
  const googleMarkerLatLng = useRecoilValue(GoogleMarkerLatLng);
  const placeInfo = useRecoilValue(PlaceInfo);
  const resetGoogleMarkerLatLng = useResetRecoilState(GoogleMarkerLatLng);

  const infoBoxRef = useRef<HTMLDivElement>(null);

  const handleMousedownAway = (event: MouseEvent) => {
    if (event.target !== infoBoxRef.current) {
      setIsDateSelectorVisible(false);
    }
  };

  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation(
    (schedule: ICreateScheduleParams) => HTTP.createSchedule(schedule),
    {
      onSuccess: (_, variables) => {
        if (variables.dayId) {
          queryClient.invalidateQueries([`dailyPlanList${tripId}`]);
        } else {
          queryClient.invalidateQueries([`tempPlanList${tripId}`]);
        }
        resetGoogleMarkerLatLng();
        setIsDateSelectorVisible(false);
      },
      onError: (
        err: AxiosError<{
          errorCode?: string;
          errorDetail?: string;
          errorMessage?: string;
        }>
      ) => {
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

  useEffect(() => {
    document.addEventListener('mousedown', handleMousedownAway);
    return () => {
      document.removeEventListener('mousedown', handleMousedownAway);
    };
  }, []);

  const handleInfoBoxClick = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  const handleInfoBoxWheel = (event: React.WheelEvent) => {
    event.stopPropagation();
  };

  const handleInfoBoxMouseDown = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  const handleInfoBoxDoubleClick = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  const handleCreateScheduleClick = (dailyPlanId: number | null) => () => {
    if (tripId && googleMarkerLatLng) {
      const newSchedule: ICreateScheduleParams = {
        tripId: +tripId,
        dayId: dailyPlanId,
        title: placeInfo.name,
        placeId: placeInfo.id,
        placeName: placeInfo.name,
        coordinate: {
          latitude: googleMarkerLatLng.lat,
          longitude: googleMarkerLatLng.lng,
        },
      };
      mutate(newSchedule);
    }
  };

  const dateSelectorDateList = dailyPlanListData?.days.length ? (
    dailyPlanListData.days.map((dailyPlanData, idx) => {
      const date = dailyPlanData.date?.split('-').join('.').substring(2);
      return (
        <DateSelectorDateItem key={dailyPlanData.dayId}>
          <DateSelectorDateBtn
            onClick={handleCreateScheduleClick(dailyPlanData.dayId)}
          >{`Day ${idx + 1} - ${date}`}</DateSelectorDateBtn>
        </DateSelectorDateItem>
      );
    })
  ) : (
    <EmptyBox>여행 기간을 정해주세요.</EmptyBox>
  );

  return (
    <DateSelectorBox
      onClick={handleInfoBoxClick}
      onWheel={handleInfoBoxWheel}
      onMouseDown={handleInfoBoxMouseDown}
      onDoubleClick={handleInfoBoxDoubleClick}
      ref={infoBoxRef}
    >
      <DateSelctorHeader>일정 추가하기</DateSelctorHeader>
      <DateSelectorDateListBox>{dateSelectorDateList}</DateSelectorDateListBox>
      <DateSelectorTempStorageBox>
        <DateSelectorDateBtn onClick={handleCreateScheduleClick(null)}>
          임시 보관함
        </DateSelectorDateBtn>
      </DateSelectorTempStorageBox>
      {isLoading && <Portal childComponent={<DimLoader />} />}
    </DateSelectorBox>
  );
};

const DateSelectorBox = styled.div`
  width: 140px;
  background-color: #f6f6f6;
  border-radius: 5px;
`;

const DateSelctorHeader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 36px;
  padding: 8px 30px;
  font-size: 1.4rem;
  font-weight: 400;
  color: #fff;
  background-color: #456ceb;
  border-radius: 5px 5px 0 0;
  white-space: nowrap;
`;

const DateSelectorDateListBox = styled.ul`
  padding: 5px 5px 5px 11px;
  max-height: 126px;
  overflow-y: auto;
  ::-webkit-scrollbar {
    width: 6px;
  }
  ::-webkit-scrollbar-thumb {
    background-color: #bbb;
    border-radius: 20px;
  }
`;

const DateSelectorDateItem = styled.li`
  width: 118px;
  height: 25px;
  text-align: center;
  font-weight: 400;
  font-size: 1.2rem;
  color: #4f4f4f;
  &:hover {
    background: #ecf0ff;
    border-radius: 11.5px;
  }
`;

const DateSelectorDateBtn = styled.button`
  font-size: inherit;
  font-weight: inherit;
  font-family: inherit;
  color: inherit;
  width: 100%;
  height: 100%;
`;

const DateSelectorTempStorageBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 36px;
  font-size: 1.2rem;
  font-weight: 500;
  color: #4d77ff;
  background-color: #ecf0ff;
  border-radius: 0 0 5px 5px;
`;

const EmptyBox = styled.div`
  color: #b6b6b6;
  height: 35px;
  line-height: 35px;
  text-align: center;
  padding-right: 6px;
`;

export default DateSelector;
