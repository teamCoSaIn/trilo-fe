import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';

import { ITrip } from '@/api/trip';
import { ReactComponent as CheckIcon } from '@/assets/check.svg';
import Description from '@/components/common/Description';
import color from '@/constants/color';
import useChangeTripTitle from '@/queryHooks/useChangeTripTitle';
import { IsTitleEditFamily } from '@/states/trip';
import { tripTitleRegExp } from '@/utils/regExp';

interface IDynamicTripCardTitleProps {
  tripTitle: ITrip['title'];
  tripCardId: ITrip['tripId'];
}

const DynamicTripCardTitle = ({
  tripCardId,
  tripTitle,
}: IDynamicTripCardTitleProps) => {
  const [isTitleEdit, setIsTitleEdit] = useRecoilState(
    IsTitleEditFamily(tripCardId)
  );
  const [titleInputValue, setTitleInputValue] = useState('');

  const { mutate } = useChangeTripTitle();

  const handleTitleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const isInputValid = tripTitleRegExp.test(
      titleInputValue.replace(/\s/g, '')
    );
    if (!isInputValid) {
      toast.error(
        '올바르지 않은 입력입니다. 공백 이외의 문자를 포함하여 20자 이내로 입력해주세요.',
        {
          autoClose: 3000,
          pauseOnHover: false,
          draggable: false,
        }
      );
      return;
    }
    if (isInputValid && tripTitle !== titleInputValue) {
      mutate({ title: titleInputValue, tripId: tripCardId });
    }
    setTimeout(() => {
      setTitleInputValue('');
      setIsTitleEdit(false);
    }, 0);
  };

  const handleTitleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setTitleInputValue(event.target.value);
  };

  const DynamicTitle = isTitleEdit ? (
    <TitleForm onSubmit={handleTitleSubmit}>
      <TitleEditInput
        type="text"
        value={titleInputValue}
        placeholder={tripTitle}
        onChange={handleTitleInputChange}
        autoFocus
        maxLength={20}
      />
      <TitleConfirmBtn type="submit">
        <CheckIcon fill="#4D77FF" width={14} height={14} />
      </TitleConfirmBtn>
    </TitleForm>
  ) : (
    <Box>
      <Description color={color.gray3} fontSize={1.6}>
        {tripTitle}
      </Description>
    </Box>
  );

  return DynamicTitle;
};

const TitleForm = styled.form`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #eaefff;
  height: 28px;
  width: 220px;
  padding: 2px 8px;
  box-sizing: border-box;
`;

const TitleEditInput = styled.input`
  font-size: 1.6rem;
  color: #b8b8b8;
  width: 100%;
`;

const Box = styled.div`
  display: flex;
  align-items: center;
  height: 28px;
  width: 220px;
  padding: 2px 8px;
`;

const TitleConfirmBtn = styled.button`
  display: flex;
  align-items: center;
`;

export default DynamicTripCardTitle;
