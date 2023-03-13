import { FallbackProps } from 'react-error-boundary';

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

export default ErrorFallback;
