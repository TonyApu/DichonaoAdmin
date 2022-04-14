import axiosClient from "./axiosClient";

const wareHouseApi = {
    getAll(params) {
        const url = "/ware-houses";
        return axiosClient.get(url, {params})
    },
    get(id) {
        const url = `/ware-houses/${id}`;
        return axiosClient.get(url, id);
    },
    update(params) {
        const url = `/ware-houses/${params.id}`;
        return axiosClient.put(url, params)
    },
    create(params) {
        const url = "/ware-houses";
        return axiosClient.post(url, params)
    },
    delete(id) {
        const url = `/ware-houses/${id}`;
        return axiosClient.delete(url, id);
    },
}

export default wareHouseApi;