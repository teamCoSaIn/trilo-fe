import { lazy } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import HeaderLayout from '@/Layouts/HeaderLayout';
import { Home } from '@/pages';
import {
  EveryUser,
  OnlyLoginUser,
  ExceptLogoutUser,
  ExceptLoginUser,
} from '@/utils/route';

const Login = lazy(
  () => import(/* webpackChunkName: "login" */ '@/pages/Login')
);
const User = lazy(() => import(/* webpackChunkName: "user" */ '@/pages/User'));
const TripList = lazy(
  () => import(/* webpackChunkName: "tripList" */ '@/pages/TripList')
);
const Trip = lazy(() => import(/* webpackChunkName: "trip" */ '@/pages/Trip'));
const Callback = lazy(
  () => import(/* webpackChunkName: "callback" */ '@/pages/Callback')
);

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HeaderLayout />}>
          <Route index element={<EveryUser page={<Home />} />} />
          <Route path="/user" element={<OnlyLoginUser page={<User />} />} />
          <Route
            path="/triplist"
            element={<ExceptLogoutUser page={<TripList />} />}
          />
          <Route
            path="/triplist/:tripId"
            element={<ExceptLogoutUser page={<Trip />} />}
          />
        </Route>
        <Route path="/login" element={<ExceptLoginUser page={<Login />} />} />
        <Route path="/oauth2/callback" element={<Callback />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
