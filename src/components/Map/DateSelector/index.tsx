import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil';
import styled from 'styled-components';

import HTTP from '@/api';
import { ICreateScheduleParams } from '@/api/schedule';
import DimLoader from '@/components/common/DimLoader';
import useGetDailyPlanList from '@/queryHooks/useGetDailyPlanList';
import { GoogleMarkerLatLng, InfoBoxVisible } from '@/states/googleMaps';
import { PlaceName } from '@/states/schedule';

const INITIAL_HOUR = '00';
const INITIAL_MINUTE = '00';

const DateSelector = () => {
  const { tripId } = useParams();

  const { data: dailyPlanListData } = useGetDailyPlanList({
    tripId: +(tripId as string),
  });

  const [isDateSelectorVisible, setIsDateSelectorVisible] =
    useRecoilState(InfoBoxVisible);
  const googleMarkerLatLng = useRecoilValue(GoogleMarkerLatLng);
  const placeName = useRecoilValue(PlaceName);
  const resetGoogleMarkerLatLng = useResetRecoilState(GoogleMarkerLatLng);

  const infoBoxRef = useRef<HTMLDivElement>(null);

  const handleClickAway = useCallback((event: MouseEvent) => {
    if (isDateSelectorVisible && event.target !== infoBoxRef.current) {
      setIsDateSelectorVisible(false);
    }
  }, []);

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
      },
    }
  );

  useEffect(() => {
    if (isDateSelectorVisible) {
      document.addEventListener('click', handleClickAway);
    }
    return () => {
      document.removeEventListener('click', handleClickAway);
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
        title: placeName || '알 수 없는 장소',
        content: '',
        placeName: placeName || '알 수 없는 장소',
        coordinate: {
          latitude: googleMarkerLatLng.lat,
          longitude: googleMarkerLatLng.lng,
        },
        startTime: INITIAL_HOUR,
        endTime: INITIAL_MINUTE,
      };
      mutate(newSchedule);
      setIsDateSelectorVisible(false);
    }
  };

  const dateSelectorDateList = dailyPlanListData?.map((dailyPlanData, idx) => {
    const date = dailyPlanData.date?.split('-').join('.').substring(2);
    return (
      <DateSelectorDateItem key={dailyPlanData.dayId}>
        <DateSelectorDateBtn
          onClick={handleCreateScheduleClick(dailyPlanData.dayId)}
        >{`Day ${idx + 1} - ${date}`}</DateSelectorDateBtn>
      </DateSelectorDateItem>
    );
  });

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
      {isLoading && <DimLoader />}
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
  font-size: 14px;
  font-weight: 400;
  color: #fff;
  background-color: #456ceb;
  border-radius: 5px 5px 0 0;
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
  font-size: 12px;
  font-family: 'Noto Sans KR';
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
  font-size: 12px;
  font-weight: 500;
  color: #4d77ff;
  background-color: #ecf0ff;
  border-radius: 0px 0px 5px 5px;
`;

export default DateSelector;
