import axiosClient from "./axiosClient";

const externalApi = {
    getAll() {
        const url = '/externals';
        return axiosClient.get(url);
    },
}

export default externalApi;