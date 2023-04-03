import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';

import HTTP from '@/api';
import CircularLoader from '@/components/common/Loader/index';
import { UserProfileNickname } from '@/states/userProfile';
import { nicknameRegExp } from '@/utils/regExp';

const DynamicUserNickname = () => {
  const [nickname, setNickname] = useRecoilState(UserProfileNickname);
  const [nicknameInputValue, setNicknameInputValue] = useState('');
  const [isEdit, setIsEdit] = useState(false);

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
    setNicknameInputValue('');
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

  const DynamicNickname = isEdit ? (
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
    <>
      {isLoading ? (
        <NicknameBox>
          <CircularLoader />
        </NicknameBox>
      ) : (
        <NicknameBox>{NicknameContents}</NicknameBox>
      )}
    </>
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

const Nickname = styled.p`
  height: 30px;
  font-size: 3rem;
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
