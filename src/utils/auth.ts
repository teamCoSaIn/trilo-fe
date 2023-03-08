import jwt_decode, { JwtPayload } from 'jwt-decode';

const isAccessTokenExpired = (accessToken: string) => {
  const decoded: JwtPayload = jwt_decode(accessToken);
  const expiredDate = decoded.exp;
  const currentDate = Date.now();

  if (expiredDate && expiredDate < currentDate) {
    return true;
  }
  return false;
};

export default isAccessTokenExpired;
