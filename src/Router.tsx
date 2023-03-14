import { Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import AuthLayout from '@/components/Layouts/AuthLayout';
import LoadingFallback from '@/components/Layouts/AuthLayout/loadingFallback';
import HeaderLayout from '@/components/Layouts/HeaderLayout';
import { Home, Login, User, Callback } from '@/pages';
import { MustLogin, MustNone } from '@/utils/route';

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
            <Route path="/user" element={<MustLogin page={<User />} />} />
          </Route>
          <Route path="/login" element={<MustNone page={<Login />} />} />
        </Route>
        <Route path="/oauth2/callback" element={<Callback />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
