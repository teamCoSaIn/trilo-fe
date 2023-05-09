import { ClickAwayListener } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRef, useState } from 'react';
import styled, { css } from 'styled-components';

import HTTP from '@/api';
import { ReactComponent as CheckIcon } from '@/assets/check.svg';
import { ReactComponent as EditIcon } from '@/assets/pencil.svg';
import Description from '@/components/common/Description';
import CircularLoader from '@/components/common/Loader/index';
import color from '@/constants/color';
import useGetUserProfile from '@/queryHooks/useGetUserProfile';
import { nicknameRegExp } from '@/utils/regExp';

const DynamicUserNickname = () => {
  // TODO: userInfo 요청과 병렬 처리 및 Skeleton 적용 필요함.
  const { data, isFetching } = useGetUserProfile({ selectKey: 'nickname' });
  const nickname = data as string;
  const [nicknameInputValue, setNicknameInputValue] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const queryClient = useQueryClient();
  const nicknameOnEditRef = useRef<HTMLDivElement>(null);

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

  const handleNicknameOnEditClickAway = () => {
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
    <ProfileBox backgroundColor={color.gray1} />
  ) : (
    <ProfileBox backgroundColor={color.white}>
      <ProfileKey color={color.blue3} fontSize={1.6}>
        닉네임
      </ProfileKey>
      <ProfileNickname nickname={nickname} color={color.gray3} fontSize={1.6}>
        {nickname}
      </ProfileNickname>
      <IconBtn type="button" onClick={handleNicknameEditBtnClick}>
        <EditIcon width={16} height={16} />
      </IconBtn>
    </ProfileBox>
  );

  const NicknameOnEdit = (
    <ClickAwayListener onClickAway={handleNicknameOnEditClickAway}>
      <ProfileBox backgroundColor={color.blue1} ref={nicknameOnEditRef}>
        <NicknameForm
          onSubmit={handleSubmit}
          inputLength={nicknameInputValue.length}
        >
          <NicknameEditInput
            type="text"
            placeholder={nickname}
            value={nicknameInputValue}
            onChange={handleChangeNicknameInput}
            autoFocus
            maxLength={20}
          />
          <IconBtn type="submit">
            <CheckIcon fill={color.blue3} width={17} height={17} />
          </IconBtn>
        </NicknameForm>
      </ProfileBox>
    </ClickAwayListener>
  );

  const DynamicNickname = isEdit ? NicknameOnEdit : Nickname;

  return isLoading ? (
    <ProfileBox backgroundColor={color.blue1}>
      <CircularLoader />
    </ProfileBox>
  ) : (
    DynamicNickname
  );
};

const ProfileBox = styled.div<{ backgroundColor?: string }>`
  position: relative;
  width: 307px;
  height: 50px;
  border-radius: 48px;
  ${({ backgroundColor }) => css`
    ${backgroundColor && { backgroundColor }}
  `};
  box-shadow: 0 2px 24px rgba(0, 0, 0, 0.1);
`;

const ProfileKey = styled(Description)`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 55px;
`;

const ProfileValue = styled(Description)`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 211px;
`;

const ProfileNickname = styled(ProfileValue)<{ nickname: string }>`
  max-width: 45px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  ${({ nickname }) => {
    if (nickname) {
      return css`
        &:hover {
          max-width: 100%;
        }
        &:hover:after {
          content: '${nickname}';
          position: absolute;
          top: 0;
          left: 0;
          background-color: white;
        }
      `;
    }
  }}
`;

const NicknameForm = styled.form<{ inputLength: number }>`
  ${({ inputLength }) => {
    if (inputLength >= 20) {
      return css`
        &::after {
          content: '20글자 이내로 입력해주세요.';
          color: red;
          position: absolute;
          top: 2px;
          left: 55px;
        }
      `;
    }
  }}
`;

const NicknameEditInput = styled.input`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 55px;
  font-size: 1.6rem;
  font-weight: 700;
  color: #606060;
  ::placeholder {
    font-size: 1.6rem;
  }
`;

const IconBtn = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 270px;
`;

export default DynamicUserNickname;
