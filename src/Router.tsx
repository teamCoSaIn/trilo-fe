import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import HeaderLayout from '@/Layouts/HeaderLayout';
import { Home, Login, User, Callback, TripPlanList } from '@/pages';
import TripPlan from '@/pages/TripPlan';
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
            path="/tripplan-list"
            element={<ExceptLogoutUser page={<TripPlanList />} />}
          />
          <Route
            path="/tripplan/:id"
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
