import axios from 'axios';

export const getLocation = async () => {
  const res = await axios({
    method: 'get',
    url: 'https://geolocation-db.com/json/',
  });
  return res.data;
};
