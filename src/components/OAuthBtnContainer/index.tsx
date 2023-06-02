import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import styled from 'styled-components';

import { ReactComponent as GoogleLogin } from '@/assets/google-login.svg';
import { ReactComponent as KakaoLogin } from '@/assets/kakao-login.svg';
import { ReactComponent as NaverLogin } from '@/assets/naver-login.svg';
import CircularLoader from '@/components/common/CircularLoader/index';
import Error from '@/components/common/Error';
import OAuthBtn from '@/components/OAuthBtnContainer/OAuthBtn';

const OAuthBtnContainer = () => {
  const OAuthList = [
    { name: 'google', svg: <GoogleLogin /> },
    {
      name: 'naver',
      svg: <NaverLogin />,
    },
    { name: 'kakao', svg: <KakaoLogin /> },
  ];

  const { reset } = useQueryErrorResetBoundary();

  const OAuthBtnList = OAuthList.map(oauthServer => {
    return (
      <li key={oauthServer.name}>
        <OAuthBtn
          oauthServerName={oauthServer.name}
          oauthServerSvg={oauthServer.svg}
        />
      </li>
    );
  });

  return (
    <Container>
      <ErrorBoundary FallbackComponent={Error} onReset={reset}>
        <Suspense fallback={<CircularLoader />}>{OAuthBtnList}</Suspense>
      </ErrorBoundary>
    </Container>
  );
};

export default OAuthBtnContainer;

const Container = styled.ul`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 176px;
`;
