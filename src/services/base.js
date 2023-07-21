import axios from 'axios';
import axiosRetry from 'axios-retry';

axiosRetry(axios, { retries: 5 });

const ERR_OK = 0;
const baseURL = '/';

axios.defaults.baseURL = baseURL;

export function get(url, params) {
  return axios.get(url, {
    params
  }).then(res => {
    const data = res.data;
    if (data.code === ERR_OK) {
      return data.result;
    }
  }).catch(e => {
    console.log(e);
  })
}
