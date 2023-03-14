import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import HeaderLayout from '@/Layouts/HeaderLayout';
import { Home, Login, User, Callback, TripList } from '@/pages';
import { ExceptLogin, ExceptLogout, MustLogin } from '@/utils/route';

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HeaderLayout />}>
          <Route index element={<Home />} />
          <Route path="/user" element={<MustLogin page={<User />} />} />
          <Route
            path="/trip-list"
            element={<ExceptLogout page={<TripList />} />}
          />
        </Route>
        <Route path="/login" element={<ExceptLogin page={<Login />} />} />
        <Route path="/oauth2/callback" element={<Callback />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
