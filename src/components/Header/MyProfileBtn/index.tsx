/* eslint-disable react/jsx-props-no-spreading */
import {
  ClickAwayListener,
  Grow,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  Stack,
} from '@mui/material';
import { KeyboardEvent, SyntheticEvent, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import styled from 'styled-components';

import HTTP from '@/api';
import MuiButton from '@/components/common/MuiButton';
import { HEADER_HEIGHT } from '@/constants/size';
import useGetUserProfile from '@/queryHooks/useGetUserProfile';
import UserStatus, { UserId, UserStatusTypes } from '@/states/userStatus';

const MyProfileBtn = () => {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();

  const userId = useRecoilValue(UserId);
  const setUserStatus = useSetRecoilState(UserStatus);

  const { data: userProfileImgUrlData } = useGetUserProfile({
    userId,
    selectKey: 'profileImageURL',
  });

  const handleToggle = () => {
    setOpen(prevOpen => !prevOpen);
  };

  const handleClose = (event: Event | SyntheticEvent) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setOpen(false);
  };

  const handleMyAccountClick = () => {
    navigate('/user');
    setOpen(false);
  };

  const handleLogoutClick = async () => {
    navigate('/');
    setOpen(false);

    try {
      await HTTP.logout();
      setUserStatus(UserStatusTypes.LOGOUT);
    } catch (e) {
      toast.error('logout fail. please retry.', {
        autoClose: 3000,
        pauseOnHover: false,
        draggable: false,
      });
    }
  };

  const handleListKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === 'Escape') {
      setOpen(false);
    }
  };

  return (
    <Stack direction="row" spacing={2}>
      <MuiButton
        width={92}
        height={HEADER_HEIGHT}
        ref={anchorRef}
        id="composition-button"
        aria-controls={open ? 'composition-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
      >
        <UserProfileImg profileImgUrl={userProfileImgUrlData as string} />
      </MuiButton>
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        placement="bottom-start"
        transition
        disablePortal
        modifiers={[
          {
            name: 'preventOverflow',
            enabled: false,
          },
        ]}
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === 'bottom-start' ? 'left top' : 'left bottom',
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <DropDownMenuList
                  autoFocusItem={open}
                  id="composition-menu"
                  aria-labelledby="composition-button"
                  onKeyDown={handleListKeyDown}
                >
                  <DropDownMenuItem onClick={handleMyAccountClick}>
                    내 정보
                  </DropDownMenuItem>
                  <DropDownMenuItem onClick={handleLogoutClick}>
                    로그아웃
                  </DropDownMenuItem>
                </DropDownMenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </Stack>
  );
};

const UserProfileImg = styled.img<{ profileImgUrl: string }>`
  width: 39px;
  height: 39px;
  border-radius: 50%;
  background-image: url(${props => props.profileImgUrl});
  background-size: cover;
`;

const DropDownMenuList = styled(MenuList)`
  width: 92px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const DropDownMenuItem = styled(MenuItem)`
  width: 92px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  font-size: 1.4rem;
`;

export default MyProfileBtn;
