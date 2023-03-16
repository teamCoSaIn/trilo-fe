import jwt_decode, { JwtPayload } from 'jwt-decode';

const isAccessTokenExpired = (accessToken: string) => {
  const decoded: JwtPayload = jwt_decode(accessToken);
  const expiredDate = decoded.exp;
  const currentDate = Date.now() / 1000;

  if (expiredDate && expiredDate < currentDate) {
    return true;
  }
  return false;
};

export default isAccessTokenExpired;
