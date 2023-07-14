import React, { MouseEventHandler, useState } from 'react';
import { toast } from 'react-toastify';
import { useRecoilState, useResetRecoilState, useSetRecoilState } from 'recoil';
import styled, { css } from 'styled-components';

import { ITrip } from '@/api/trip';
import { ReactComponent as CameraIcon } from '@/assets/camera.svg';
import { ReactComponent as EllipsisIcon } from '@/assets/ellipsis.svg';
import { ReactComponent as MultiplyIcon } from '@/assets/multiply.svg';
import { ReactComponent as PencilIcon } from '@/assets/pencil.svg';
import { ReactComponent as RefreshIcon } from '@/assets/refresh.svg';
import { ReactComponent as TrashCanIcon } from '@/assets/trash-can.svg';
import { ReactComponent as CheckIcon } from '@/assets/whiteCheck.svg';
import Description from '@/components/common/Description';
import DimLoader from '@/components/common/DimLoader';
import Flex from '@/components/common/Flex';
import Spacing from '@/components/common/Spacing';
import DynamicTripCardTitle from '@/components/TripCardList/DynamicTripCardTitle';
import color from '@/constants/color';
import useMedia from '@/hooks/useMedia';
import useChangeTripImg from '@/queryHooks/useChangeTripImg';
import useDeleteTrip from '@/queryHooks/useDeleteTrip';
import {
  PreviewImgFamily,
  IsOptionOpenFamily,
  IsTitleEditFamily,
} from '@/states/trip';

interface ITripCardBottomProps {
  trip: ITrip;
}

const TripCardBottom = ({ trip }: ITripCardBottomProps) => {
  const { isMobile } = useMedia();

  const [isOptionOpen, setIsOptionOpen] = useRecoilState(
    IsOptionOpenFamily(trip.tripId)
  );
  const setIsTitleEdit = useSetRecoilState(IsTitleEditFamily(trip.tripId));
  const [previewImg, setPreviewImg] = useRecoilState(
    PreviewImgFamily(trip.tripId)
  );
  const resetPreviewImg = useResetRecoilState(PreviewImgFamily(trip.tripId));

  const [imgData, setImgData] = useState<FormData | null>(null);

  const { mutate: deleteTripMutate, isLoading: isDeleteTripLoading } =
    useDeleteTrip();
  const { mutate: changeTripImgMutate, isLoading: isChangeTripImgLoading } =
    useChangeTripImg();

  const convertDate = (date: string) => date.replace(/-/g, '.').substring(2);

  const tripPeriod = (
    <TripPeriod color={color.gray2} fontSize={isMobile ? 1.2 : 1.4}>
      {trip.startDate
        ? `${convertDate(trip.startDate)} ~ ${convertDate(trip.endDate)}`
        : '여행 기간 미정'}
    </TripPeriod>
  );

  const handleOptionOpenBtnClick: MouseEventHandler = e => {
    e.stopPropagation();

    setIsOptionOpen(true);
  };

  const handleTitleEditBtnClick = () => {
    setIsTitleEdit(true);
    setIsOptionOpen(false);
  };

  const handleTripDeleteBtnClick = () => {
    if (window.confirm('해당 여행을 삭제하시겠습니까?')) {
      deleteTripMutate(trip.tripId);
    }
  };

  const handleOptionCloseBtnClick = () => {
    resetPreviewImg();
    setIsTitleEdit(false);
    setIsOptionOpen(false);
  };

  const handleTripImgInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      if (!file) {
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        toast.error('첨부 이미지는 2MB 이내로 등록 가능합니다.', {
          autoClose: 3000,
          pauseOnHover: false,
          draggable: false,
        });
        return;
      }
      const formData = new FormData();
      formData.append('image', file);
      setImgData(formData);

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        if (!reader.result) {
          return;
        }
        setPreviewImg(reader.result as string);
      };
    }
  };

  const handleTripImgRefreshBtnClick = () => {
    resetPreviewImg();
  };

  const handleTripImgSaveBtnClick = () => {
    if (!imgData) return;
    changeTripImgMutate({ tripId: trip.tripId, formData: imgData });
  };

  const OptionContent = previewImg ? (
    <>
      <IconBtn isMobile={isMobile} onClick={handleTripImgRefreshBtnClick}>
        <IconWrapper>
          <RefreshIcon width={16} height={16} />
        </IconWrapper>
        되돌리기
      </IconBtn>
      <IconBtn isMobile={isMobile} onClick={handleTripImgSaveBtnClick}>
        <IconWrapper>
          <CheckIcon fill={color.gray3} />
        </IconWrapper>
        사진 저장
      </IconBtn>
    </>
  ) : (
    <>
      <TripImgLabel isMobile={isMobile} htmlFor={`tripThumbnail${trip.tripId}`}>
        <IconWrapper>
          <CameraIcon />
        </IconWrapper>
        사진 변경
      </TripImgLabel>
      <TripImgInput
        type="file"
        accept="image/jpeg, image/jpg, image/png, image/gif, image/webp"
        id={`tripThumbnail${trip.tripId}`}
        onChange={handleTripImgInputChange}
      />
      <IconBtn isMobile={isMobile} onClick={handleTitleEditBtnClick}>
        <IconWrapper>
          <PencilIcon />
        </IconWrapper>
        이름 수정
      </IconBtn>
      <IconBtn isMobile={isMobile} onClick={handleTripDeleteBtnClick}>
        <IconWrapper>
          <TrashCanIcon />
        </IconWrapper>
        계획 삭제
      </IconBtn>
    </>
  );

  const BottomContent = isOptionOpen ? (
    <OptionBox isMobile={isMobile}>
      {(isDeleteTripLoading || isChangeTripImgLoading) && <DimLoader />}
      <OptionCloseBtn onClick={handleOptionCloseBtnClick}>
        <MultiplyIcon />
      </OptionCloseBtn>
      {OptionContent}
    </OptionBox>
  ) : (
    <BottomBox column alignCenter={!isMobile} justifyCenter isMobile={isMobile}>
      <DynamicTripCardTitle tripCardId={trip.tripId} tripTitle={trip.title} />
      <Spacing height={9} />
      <Wrapper>
        {tripPeriod}
        <OptionOpenBtn isMobile={isMobile} onClick={handleOptionOpenBtnClick}>
          <EllipsisIcon
            width={isMobile ? 30 : 17}
            height={isMobile ? 30 : 17}
          />
        </OptionOpenBtn>
      </Wrapper>
    </BottomBox>
  );

  return BottomContent;
};

const BottomBox = styled(Flex)<{ isMobile: boolean }>`
  position: relative;
  width: 100%;
  height: 100%;
  padding: 14px 12px;
  ${({ isMobile }) => {
    if (isMobile) {
      return css`
        padding: 10px 52px 10px 12px;
      `;
    }
  }}
`;

const Wrapper = styled(Flex)`
  width: 100%;
  flex-grow: 1;
  padding: 0 8px;
`;

const TripPeriod = styled(Description)`
  display: flex;
  align-items: center;
`;

const OptionOpenBtn = styled.button<{ isMobile: boolean }>`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  ${({ isMobile }) => {
    if (isMobile) {
      return css`
        top: 50%;
        right: 10px;
        transform: translateY(-50%);
      `;
    }
    return css`
      right: 20px;
    `;
  }}
`;

const OptionBox = styled(Flex)<{ isMobile: boolean }>`
  position: relative;
  width: 100%;
  height: 100%;
  &:hover {
    color: ${color.blue3};
  }
  ${({ isMobile }) => {
    if (isMobile) {
      return css`
        gap: 20px;
        padding: 10px 22px;
      `;
    }
    return css`
      justify-content: space-evenly;
      padding: 14px 22px;
    `;
  }}
`;

const TripImgInput = styled.input`
  display: none;
`;

const TripImgLabel = styled.label<{ isMobile: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  font-weight: 500;
  color: ${color.gray3};
  &:hover {
    color: ${color.blue3};
    > div {
      border-color: ${color.blue3};
      > svg {
        fill: ${color.blue3};
      }
    }
  }
  cursor: pointer;
  ${({ isMobile }) => {
    if (isMobile) {
      return css`
        font-weight: 400;
        font-size: 1rem;
      `;
    }
    return css`
      font-weight: 500;
      font-size: 1.2rem;
    `;
  }}
`;

const IconBtn = styled.button<{ isMobile: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  color: ${color.gray3};
  &:hover {
    color: ${color.blue3};
    > div {
      border-color: ${color.blue3};
      > svg {
        fill: ${color.blue3};
      }
    }
  }
  ${({ isMobile }) => {
    if (isMobile) {
      return css`
        font-weight: 400;
        font-size: 1rem;
      `;
    }
    return css`
      font-weight: 500;
      font-size: 1.2rem;
    `;
  }}
`;

const IconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 0.6px solid ${color.gray3};
`;

const OptionCloseBtn = styled.button`
  position: absolute;
  top: 6px;
  right: 6px;
  &:hover {
    > svg {
      fill: ${color.blue3};
    }
  }
`;

export default TripCardBottom;
