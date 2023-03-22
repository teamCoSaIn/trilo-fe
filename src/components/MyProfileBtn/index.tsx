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
import {
  KeyboardEvent,
  SyntheticEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import styled from 'styled-components';

import HTTP from '@/api';
import MuiButton from '@/components/common/MuiButton';
import { UserProfileImgUrl } from '@/states/userProfile';
import UserStatus, { UserStatusTypes } from '@/states/userStatus';

const MyProfileBtn = () => {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();
  const setUserStatus = useSetRecoilState(UserStatus);
  const userProfileImgUrl = useRecoilValue(UserProfileImgUrl);

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

  const handleClickMyAccount = () => {
    navigate('/user');
    setOpen(false);
  };

  const handleClickLogout = async () => {
    navigate('/');
    setOpen(false);

    try {
      await HTTP.logout();
      setUserStatus(UserStatusTypes.LOGOUT);
    } catch (e) {
      alert('logout fail. please retry.');
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

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current!.focus();
    }
    prevOpen.current = open;
  }, [open]);

  return (
    <Stack direction="row" spacing={2}>
      <div>
        <MuiButton
          width={92}
          ref={anchorRef}
          id="composition-button"
          aria-controls={open ? 'composition-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-haspopup="true"
          onClick={handleToggle}
        >
          <UserProfileImg profileImgUrl={userProfileImgUrl} />
        </MuiButton>
        <Popper
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          placement="bottom-start"
          transition
          disablePortal
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
                    <DropDownMenuItem onClick={handleClickMyAccount}>
                      내 정보
                    </DropDownMenuItem>
                    <DropDownMenuItem onClick={handleClickLogout}>
                      로그아웃
                    </DropDownMenuItem>
                  </DropDownMenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </div>
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
  font-size: 14px;
`;

export default MyProfileBtn;
