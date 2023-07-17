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
import {
  specialCharRegExp,
  nicknameRegExp,
  min1max100RegExp,
} from '@/utils/regExp';

const DynamicUserNickname = () => {
  const { isMobile } = useMedia();

  const userId = useRecoilValue(UserId);

  const [isEdit, setIsEdit] = useState(false);
  const nicknameInputRef = useRef<HTMLInputElement>(null);

  // TODO: userInfo 요청과 병렬 처리 및 Skeleton 적용 필요함.
  const queryClient = useQueryClient();
  const { data: nicknameData, isFetching } = useGetUserProfile({
    userId,
    selectKey: 'nickName',
  });
  const { mutate, isLoading } = useMutation(
    (newNickname: string) =>
      HTTP.changeNickname({ userId, nickName: newNickname }),
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
  };

  const handleNicknameOnEditClickAway = () => {
    setIsEdit(false);
  };

  const isValidNickname = (curNicknameInputValue: string): boolean => {
    const isValid = nicknameRegExp.test(curNicknameInputValue);
    return isValid;
  };

  const isContainSpecialChar = (curNicknameInputValue: string): boolean => {
    const isContain = specialCharRegExp.test(curNicknameInputValue);
    return isContain;
  };

  const isNickNameValidRange = (curNicknameInputValue: string): boolean => {
    const isVaildRange = min1max100RegExp.test(curNicknameInputValue);
    return isVaildRange;
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
    } else if (isContainSpecialChar(curNicknameInput)) {
      toast.error(
        `닉네임에는 특수 문자를 사용하실 수 없습니다. 영문자, 숫자, 및 한글만 입력 가능합니다.`,
        {
          autoClose: 3000,
          pauseOnHover: false,
          draggable: false,
        }
      );
    } else if (isNickNameValidRange(curNicknameInput)) {
      toast.error(
        '입력 가능한 글자 수는 최소 1글자, 최대 100글자입니다. 다시 입력해주세요.',
        {
          autoClose: 3000,
          pauseOnHover: false,
          draggable: false,
        }
      );
    } else {
      toast.error(
        '유효하지 않은 입력입니다. 공백 이외의 문자를 포함하여 1 ~ 100자로 입력해주세요.',
        {
          autoClose: 3000,
          pauseOnHover: false,
          draggable: false,
        }
      );
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
      <ProfileBox backgroundColor={color.blue1} isMobile={isMobile}>
        <NicknameForm onSubmit={handleSubmit}>
          <NicknameEditInput
            type="text"
            placeholder={nicknameData as string}
            ref={nicknameInputRef}
            autoFocus
            maxLength={100}
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

const NicknameForm = styled.form`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
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
