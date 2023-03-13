import { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import AuthLayout from '@/components/Layouts/AuthLayout';
import LoadingFallback from '@/components/Layouts/AuthLayout/loadingFallback';
import HeaderLayout from '@/components/Layouts/HeaderLayout';
import { User, Home, Login, NotFound } from '@/pages';
import Callback from '@/pages/Callback';

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <AuthLayout />
            </Suspense>
          }
        >
          <Route path="/" element={<HeaderLayout />}>
            <Route index element={<Home />} />
            <Route path="/user" element={<User />} />
          </Route>
          <Route path="/login" element={<Login />} />
        </Route>
        <Route path="/oauth2/callback" element={<Callback />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
