import Axios from 'axios';

const BASE_URL = process.env.API_SERVER;

const axios = Axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export default axios;
