import axios from 'axios';

const BASE_URL = process.env.API_SERVER;

const client = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export default client;
