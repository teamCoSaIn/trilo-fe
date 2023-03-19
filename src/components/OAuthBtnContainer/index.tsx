import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import styled from 'styled-components';

import { ReactComponent as GoogleLogin } from '@/assets/google-login.svg';
import { ReactComponent as KakaoLogin } from '@/assets/kakao-login.svg';
import { ReactComponent as NaverLogin } from '@/assets/naver-login.svg';
import OAuthBtn from '@/components/OAuthBtn';
import ErrorFallback from '@/components/OAuthBtnContainer/errorFallback';
import LoadingFallback from '@/components/OAuthBtnContainer/loadingFallback';

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
    <ul>
      <ErrorBoundary FallbackComponent={ErrorFallback} onReset={reset}>
        <Suspense fallback={<LoadingFallback />}>{OAuthBtnList}</Suspense>
      </ErrorBoundary>
    </ul>
  );
};

export default OAuthBtnContainer;
