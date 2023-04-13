import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import styled from 'styled-components';

import HTTP from '@/api';
import Description from '@/components/common/Description';
import CircularLoader from '@/components/common/Loader/index';
import useGetUserProfile from '@/queryHooks/useGetUserProfile';
import { nicknameRegExp } from '@/utils/regExp';

const DynamicUserNickname = () => {
  // TODO: userInfo 요청과 병렬 처리 및 Skeleton 적용 필요함.
  const { data, isFetching } = useGetUserProfile({ selectKey: 'nickname' });
  const nickname = data as string;
  const [nicknameInputValue, setNicknameInputValue] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation(
    (newNickname: string) => HTTP.changeNickname(newNickname),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['userProfile']);
      },
      onError: () => {
        alert('서버 오류');
      },
      onSettled: () => {
        setIsEdit(false);
        setNicknameInputValue('');
      },
    }
  );

  const handleNicknameEditBtnClick = () => {
    setIsEdit(true);
  };

  const handleNicknameCancelBtnClick = () => {
    setIsEdit(false);
    setNicknameInputValue('');
  };

  const isValidNickname = (curNicknameInputValue: string) => {
    const isValid = nicknameRegExp.test(curNicknameInputValue);
    return isValid;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (nickname === nicknameInputValue) {
      setIsEdit(false);
      setNicknameInputValue('');
      return;
    }
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

  const Nickname = isFetching ? (
    <div>fetching...</div>
  ) : (
    <>
      <NicknameDescription fontSize={3}>{nickname} 님</NicknameDescription>
      <NicknameIconBox>
        <NicknameIconBtn type="button" onClick={handleNicknameEditBtnClick}>
          수정
        </NicknameIconBtn>
      </NicknameIconBox>
    </>
  );

  const NicknameOnEdit = (
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
  );

  const DynamicNickname = isEdit ? NicknameOnEdit : Nickname;

  return (
    <NicknameBox>
      {isLoading ? <CircularLoader /> : DynamicNickname}
    </NicknameBox>
  );
};

const NicknameBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 80px;
  gap: 17px;
`;

const NicknameForm = styled.form`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 17px;
`;

const NicknameDescription = styled(Description)`
  height: 30px;
  text-align: end;
  width: 60%;
`;

const NicknameEditInput = styled.input`
  height: 30px;
  padding: 0;
  text-align: end;
  font-size: 3rem;
  border-bottom: 1px solid gray;
  width: 60%;
  ::placeholder {
    font-size: 2rem;
  }
`;

const NicknameIconBox = styled.div`
  display: flex;
  justify-content: flex-start;
  gap: 10px;
  width: 40%;
  margin-right: 30px;
`;

const NicknameIconBtn = styled.button`
  width: 55px;
  height: 30px;
  border: 1px solid black;
  font-weight: 400;
  font-size: 2rem;
`;

export default DynamicUserNickname;
