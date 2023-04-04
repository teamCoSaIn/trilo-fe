import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import HeaderLayout from '@/Layouts/HeaderLayout';
import { Home, Login, User, Callback, TripList } from '@/pages';
import TripPlan from '@/pages/TripPlan/index';
import {
  EveryUser,
  OnlyLoginUser,
  ExceptLogoutUser,
  ExceptLoginUser,
} from '@/utils/route';

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HeaderLayout />}>
          <Route index element={<EveryUser page={<Home />} />} />
          <Route path="/user" element={<OnlyLoginUser page={<User />} />} />
          <Route
            path="/trip-list"
            element={<ExceptLogoutUser page={<TripList />} />}
          />
          <Route
            path="/trip-plan/:id"
            element={<ExceptLogoutUser page={<TripPlan />} />}
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
