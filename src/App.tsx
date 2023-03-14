import { Suspense } from 'react';

import AuthProvider from '@/components/AuthProvider';
import LoadingFallback from '@/components/AuthProvider/loadingFallback';
import Router from '@/Router';

import worker from './mocks/browser';

if (process.env.NODE_ENV === 'development') {
  worker.start();
}

const App = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <AuthProvider>
        <Router />
      </AuthProvider>
    </Suspense>
  );
};

export default App;
