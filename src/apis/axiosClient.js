import axios from "axios";
import queryString from "query-string";

const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASEURL,
  headers: {
    "content-type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
    timeout: 3000,
  },
  paramsSerializer: (params) => queryString.stringify(params),
});

axiosClient.interceptors.request.use(async (config) => {
  //Handle token.....
  console.log("interceptors request");
  return config;
});

axiosClient.interceptors.response.use(
  (response) => {
    console.log("interceptors response");
    if (response && response.data) {
      return response.data;
    }
    return response;
  },
  (error) => {
    //Hanle error
    throw error;
  }
);

export default axiosClient;
