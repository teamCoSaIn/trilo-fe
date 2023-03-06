import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import { Suspense } from 'react';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import styled from 'styled-components';

import OAuthBtnContainer from '@/pages/Login/OAuthBtnContainer';

const ErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
  return (
    <>
      <div>{error.message}</div>
      <button type="button" onClick={() => resetErrorBoundary()}>
        다시 시도
      </button>
    </>
  );
};

const Login = () => {
  // 백엔드한테 authorization 로그인 페이지 url 요청 후 각각의 버튼에게 주소 넘겨주기
  const { reset } = useQueryErrorResetBoundary();
  return (
    <LoginButtonBox>
      <ErrorBoundary FallbackComponent={ErrorFallback} onReset={reset}>
        <Suspense fallback={<div>loading spinner</div>}>
          <OAuthBtnContainer />
        </Suspense>
      </ErrorBoundary>
    </LoginButtonBox>
  );
};

export default Login;

const LoginButtonBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 2rem;
`;
