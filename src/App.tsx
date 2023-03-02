import { RecoilRoot } from 'recoil';

import Router from '@/Router';
import GlobalStyle from '@/styles/GlobalStyle';

const App = () => {
  return (
    <RecoilRoot>
      <GlobalStyle />
      <Router />
    </RecoilRoot>
  );
};

export default App;
