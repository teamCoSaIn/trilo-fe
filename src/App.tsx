import Router from '@/Router';

import worker from './mocks/browser';

if (process.env.NODE_ENV === 'development') {
  worker.start();
}

const App = () => {
  return <Router />;
};

export default App;
