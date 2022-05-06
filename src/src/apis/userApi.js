import axiosClient from "./axiosClient";

const userApi = {
  getAccount(params) {
    const url = `/users/user/${params.role}`;
    return axiosClient.get(url, {params});
  },
  updateAccount(id) {
    const url = `/users/ban-unban/${id}`;
    return axiosClient.delete(url, id);
  },
  login(data) {
    const url = `/users/login`;
    return axiosClient.post(url, data);
  },
  getUser(id) {
    const url = `/users/${id}`;
    return axiosClient.get(url, id);
  },
  getManagerFree() {
    const url = "/users/warehouse";
    return axiosClient.get(url);
  },
  registerWareHouseManager(params) {
    const url = "/users/admin";
    return axiosClient.post(url, params);
  },
  getDataDashboard() {
    const url = "/users/admin/dashboard";
    return axiosClient.get(url);
  },
  getStatistical() {
    const url = "/users/admin/statistical";
    return axiosClient.get(url);
  },
};

export default userApi;
