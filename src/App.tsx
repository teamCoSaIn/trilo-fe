import { Suspense } from 'react';

import AuthChecker from '@/components/AuthChecker';
import CircularLoader from '@/components/common/CircularLoader/index';
import Router from '@/Router';

import worker from './mocks/browser';

if (process.env.MODE === 'development') {
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
