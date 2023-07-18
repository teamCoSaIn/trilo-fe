import { JwtPayload } from 'jwt-decode';

declare module 'jwt-decode' {
  interface JwtPayload {
    id?: string;
  }
}
