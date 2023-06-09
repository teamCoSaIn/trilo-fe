import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';

import { ReactComponent as GoogleLogin } from '@/assets/google-login.svg';
import { ReactComponent as KakaoLogin } from '@/assets/kakao-login.svg';
import { ReactComponent as NaverLogin } from '@/assets/naver-login.svg';
import Error from '@/components/common/Error';
import CircularLoader from '@/components/common/Loader/index';
import OAuthBtn from '@/components/OAuthBtnContainer/OAuthBtn';

const OAuthBtnContainer = () => {
  const oauthState = uuidv4();
  localStorage.setItem('oauthState', oauthState);

  const OAuthList = [
    {
      name: 'google',
      svg: <GoogleLogin />,
      loginUri: `https://accounts.google.com/o/oauth2/v2/auth?scope=https://www.googleapis.com/auth/userinfo.email&include_granted_scopes=true&response_type=code&state=${oauthState}&redirect_uri=${process.env.OAUTH_REDIRECT_URI}&client_id=${process.env.GOOGLE_CLIENT_ID}`,
    },
    {
      name: 'naver',
      svg: <NaverLogin />,
      loginUri: `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${process.env.NAVER_CLIENT_ID}&state=${oauthState}&redirect_uri=${process.env.OAUTH_REDIRECT_URI}`,
    },
    {
      name: 'kakao',
      svg: <KakaoLogin />,
      loginUri: `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${process.env.KAKAO_CLIENT_ID}&scope=profile_nickname%20profile_image%20account_email&state=${oauthState}&redirect_uri=${process.env.OAUTH_REDIRECT_URI}`,
    },
  ];

  const { reset } = useQueryErrorResetBoundary();

  const OAuthBtnList = OAuthList.map(oauthServer => {
    return (
      <li key={oauthServer.name}>
        <OAuthBtn
          oauthServerName={oauthServer.name}
          oauthServerSvg={oauthServer.svg}
          oauthServerLoginUri={oauthServer.loginUri}
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
