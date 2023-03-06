import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { Layout, User, Home, Login, NotFound } from '@/pages';

import Callback from './pages/Callback';

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/user" element={<User />} />
        </Route>
        <Route path="/login" element={<Login />} />

        <Route path="/callback" element={<Callback />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
