import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import OAuthBtn from '@/components/OAuthBtn';
import ErrorFallback from '@/components/OAuthBtnContainer/errorFallback';
import LoadingFallback from '@/components/OAuthBtnContainer/loadingFallback';

const OAuthBtnContainer = () => {
  const OAuthList = ['google', 'naver', 'kakao'];

  const { reset } = useQueryErrorResetBoundary();

  const OAuthBtnList = OAuthList.map(oauthServer => {
    return (
      <li key={oauthServer}>
        <OAuthBtn oauthServer={oauthServer} />
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
