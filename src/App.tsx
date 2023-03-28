import { Suspense } from 'react';

import AuthProvider from '@/components/AuthProvider';
import CircularLoader from '@/components/common/Loader/index';
import Router from '@/Router';

import worker from './mocks/browser';

if (process.env.NODE_ENV === 'development') {
  worker.start();
}

const App = () => {
  return (
    <Suspense fallback={<CircularLoader />}>
      <AuthProvider>
        <Router />
      </AuthProvider>
    </Suspense>
  );
};

export default App;
