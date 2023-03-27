import { useState } from 'react';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';

import Description from '@/components/common/Description/index';
import Spacing from '@/components/common/Spacing/index';
import color from '@/constants/color';
import { UserProfileNickname } from '@/states/userProfile';
import { nicknameRegExp } from '@/utils/regExp';
import HTTP from '@/api';
import { useMutation } from '@tanstack/react-query';

const User = () => {
  const [nickname, setNickname] = useRecoilState(UserProfileNickname);
  const { totalDistanceOfPastTrip, totalNumOfTrip } = {
    totalDistanceOfPastTrip: 410,
    totalNumOfTrip: 10,
  };
  const [isEdit, setIsEdit] = useState(false);
  const [nicknameInputValue, setNicknameInputValue] = useState('');

  const { mutate, isLoading } = useMutation(
    (newNickname: string) => HTTP.changeNickname(newNickname),
    {
      onSuccess: (data, variables) => {
        setNickname(variables);
        setIsEdit(false);
      },
      onError: () => {
        alert('서버 오류');
        setIsEdit(false);
      },
    }
  );

  const handleNicknameEditBtnClick = () => {
    setIsEdit(true);
  };

  const handleNicknameCancelBtnClick = () => {
    setIsEdit(false);
  };

  const isValidNickname = (curNicknameInputValue: string) => {
    const isValid = nicknameRegExp.test(curNicknameInputValue);
    return isValid;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isValidNickname(nicknameInputValue)) {
      mutate(nicknameInputValue);
    } else {
      alert(
        '올바르지 않은 입력입니다. 3~20 글자 사이의 한글, 영문, 숫자만 가능합니다.'
      );
    }
  };

  const handleChangeNicknameInput = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNicknameInputValue(event.target.value);
  };

  const NicknameContainer = isEdit ? (
    <NicknameForm onSubmit={handleSubmit}>
      <NicknameEditInput
        type="text"
        placeholder="이름을 입력해주세요."
        value={nicknameInputValue}
        onChange={handleChangeNicknameInput}
        autoFocus
        maxLength={20}
      />
      <NicknameIconBox>
        <NicknameIconBtn type="submit">확인</NicknameIconBtn>
        <NicknameIconBtn type="button" onClick={handleNicknameCancelBtnClick}>
          취소
        </NicknameIconBtn>
      </NicknameIconBox>
    </NicknameForm>
  ) : (
    <>
      <Nickname>{`${nickname} 님`}</Nickname>
      <NicknameIconBox>
        <NicknameIconBtn type="button" onClick={handleNicknameEditBtnClick}>
          수정
        </NicknameIconBtn>
      </NicknameIconBox>
    </>
  );

  return (
    <UserInfoBox>
      <TripBadge src="https://user-images.githubusercontent.com/84956036/227441024-9853dda6-2100-466a-af20-b13d2e720f5f.png" />
      <Spacing size={52} />
      {isLoading ? (
        <div>loading...</div>
      ) : (
        <NicknameBox>{NicknameContainer}</NicknameBox>
      )}
      <Spacing size={45} />
      <TripInfoBox>
        <TotalDistanceOfPastTrip>
          <Description color={color.black} fontSize={3}>
            나의 여정
          </Description>
          <Description color={color.black} fontSize={6}>
            {`${totalDistanceOfPastTrip} KM`}
          </Description>
        </TotalDistanceOfPastTrip>
        <TotalNumOfTrip>
          <Description color={color.black} fontSize={3}>
            나의 일정
          </Description>
          <Description color={color.black} fontSize={6}>
            {`${totalNumOfTrip} KM`}
          </Description>
        </TotalNumOfTrip>
      </TripInfoBox>
    </UserInfoBox>
  );
};

const UserInfoBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 124px;
  height: 100%;
  width: 500px;
  margin: 0 auto;
`;

const TripBadge = styled.img`
  width: 282px;
  height: 421px;
  border-radius: 36px;
`;

const NicknameForm = styled.form`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 17px;
`;

const NicknameBox = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  gap: 17px;
`;

const Nickname = styled.p`
  height: 30px;
  font-size: 3rem;
  text-align: end;
`;

const NicknameEditInput = styled.input`
  height: 30px;
  padding: 0;
  text-align: end;
  font-size: 3rem;
  border-bottom: 1px solid gray;
  width: 210px;
  ::placeholder {
    font-size: 2rem;
  }
`;

const NicknameIconBox = styled.div`
  display: flex;
  justify-content: flex-start;
  gap: 10px;
  // TODO: 고쳐야함
  width: 130px;
  margin-right: 30px;
`;

const NicknameIconBtn = styled.button`
  width: 55px;
  height: 30px;
  border: 1px solid black;
  font-weight: 400;
  font-size: 2rem;
`;

const TripInfoBox = styled.div`
  display: flex;
  gap: 81px;
`;

const TotalDistanceOfPastTrip = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;

const TotalNumOfTrip = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;

export default User;
