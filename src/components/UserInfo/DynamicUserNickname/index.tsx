import { ClickAwayListener } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { useRecoilValue } from 'recoil';
import styled, { css } from 'styled-components';

import HTTP from '@/api';
import { ReactComponent as CheckIcon } from '@/assets/check.svg';
import { ReactComponent as EditIcon } from '@/assets/pencil.svg';
import CircularLoader from '@/components/common/CircularLoader/index';
import Description from '@/components/common/Description';
import color from '@/constants/color';
import useMedia from '@/hooks/useMedia';
import useGetUserProfile from '@/queryHooks/useGetUserProfile';
import { UserId } from '@/states/userStatus';
import { nicknameRegExp } from '@/utils/regExp';

const DynamicUserNickname = () => {
  const { isMobile } = useMedia();

  const userId = useRecoilValue(UserId);

  const [isOverNicknameInputLength, setIsOverNicknameInputLength] =
    useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const nicknameInputRef = useRef<HTMLInputElement>(null);
  const nicknameOnEditRef = useRef<HTMLDivElement>(null);

  // TODO: userInfo 요청과 병렬 처리 및 Skeleton 적용 필요함.
  const queryClient = useQueryClient();
  const { data: nicknameData, isFetching } = useGetUserProfile({
    userId,
    selectKey: 'nickName',
  });
  const { mutate, isLoading } = useMutation(
    (newNickname: string) => HTTP.changeNickname(newNickname),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['userProfile']);
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
      onSettled: () => {
        setIsEdit(false);
      },
    }
  );

  const handleNicknameEditBtnClick = () => {
    setIsEdit(true);
    setIsOverNicknameInputLength(false);
  };

  const handleNicknameOnEditClickAway = () => {
    setIsEdit(false);
  };

  const isValidNickname = (curNicknameInputValue: string) => {
    const isValid = nicknameRegExp.test(curNicknameInputValue);
    return isValid;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const curNicknameInput = nicknameInputRef.current?.value;
    if (!curNicknameInput || nicknameData === curNicknameInput) {
      setIsEdit(false);
      return;
    }
    if (isValidNickname(curNicknameInput)) {
      mutate(curNicknameInput);
    } else {
      toast.error(
        '올바르지 않은 입력입니다. 공백 이외의 문자를 포함하여 20자 이내로 입력해주세요.',
        {
          autoClose: 3000,
          pauseOnHover: false,
          draggable: false,
        }
      );
    }
  };

  const handleChangeNicknameInput = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const curInput = event.target.value;
    if (curInput.length >= 20) {
      setIsOverNicknameInputLength(true);
    } else {
      setIsOverNicknameInputLength(false);
    }
  };

  const Nickname = isFetching ? (
    <ProfileBox backgroundColor={color.gray1} isMobile={isMobile} />
  ) : (
    <ProfileBox backgroundColor={color.white} isMobile={isMobile}>
      <ProfileKey color={color.blue3} fontSize={1.6}>
        닉네임
      </ProfileKey>
      <FlexibleSpacing />
      <ProfileValueBox>
        <ProfileNickname
          color={color.gray3}
          fontSize={1.6}
          title={nicknameData as string}
        >
          {nicknameData as string}
        </ProfileNickname>
        <IconBtn type="button" onClick={handleNicknameEditBtnClick}>
          <EditIcon width={16} height={16} />
        </IconBtn>
      </ProfileValueBox>
    </ProfileBox>
  );

  const NicknameOnEdit = (
    <ClickAwayListener onClickAway={handleNicknameOnEditClickAway}>
      <ProfileBox
        backgroundColor={color.blue1}
        ref={nicknameOnEditRef}
        isMobile={isMobile}
      >
        <NicknameForm
          onSubmit={handleSubmit}
          isOverLength={isOverNicknameInputLength}
        >
          <NicknameEditInput
            type="text"
            placeholder={nicknameData as string}
            ref={nicknameInputRef}
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
    <ProfileBox backgroundColor={color.blue1} isMobile={isMobile}>
      <CircularLoader />
    </ProfileBox>
  ) : (
    DynamicNickname
  );
};

const ProfileBox = styled.div<{ backgroundColor?: string; isMobile?: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  flex-shrink: 0;
  padding: 0 50px;
  border-radius: 48px;
  ${({ backgroundColor }) => css`
    ${backgroundColor && { backgroundColor }}
  `};
  ${({ isMobile }) => {
    if (isMobile) {
      return css`
        width: 250px;
        height: 50px;
      `;
    }
    return css`
      width: 310px;
      height: 70px;
    `;
  }}
  box-shadow: 0 2px 24px rgba(0, 0, 0, 0.1);
`;

const FlexibleSpacing = styled.div`
  flex-grow: 1;
  flex-shrink: 1;
  min-width: 15px;
`;

const ProfileValueBox = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  overflow: hidden;
`;

const ProfileKey = styled(Description)`
  flex-shrink: 0;
`;

const ProfileNickname = styled(Description)`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const NicknameForm = styled.form<{ isOverLength: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  ${({ isOverLength }) => {
    if (isOverLength) {
      return css`
        &::after {
          content: '20글자 이내로 입력해주세요.';
          font-size: 1.2rem;
          color: red;
          position: absolute;
          top: -10px;
          left: 50px;
        }
      `;
    }
  }}
`;

const NicknameEditInput = styled.input`
  max-width: 85%;
  font-size: 1.6rem;
  font-weight: 700;
  color: #606060;
  ::placeholder {
    font-size: 1.6rem;
  }
`;

const IconBtn = styled.button``;

export default DynamicUserNickname;
