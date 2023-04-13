import { Suspense } from 'react';

import AuthChecker from '@/components/AuthChecker';
import CircularLoader from '@/components/common/Loader/index';
import Router from '@/Router';

import worker from './mocks/browser';

if (process.env.NODE_ENV === 'development') {
  worker.start();
}

const App = () => {
  return (
    <Suspense fallback={<CircularLoader />}>
      <AuthChecker>
        <Router />
      </AuthChecker>
    </Suspense>
  );
};

export default App;
