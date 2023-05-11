import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import HeaderLayout from '@/Layouts/HeaderLayout';
import { Home, Login, User, Callback, TripList, Trip } from '@/pages';
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
