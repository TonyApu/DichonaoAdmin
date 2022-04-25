import axiosClient from "./axiosClient";

const farmApi = {
    getAll(params) {
        const url = '/farms';
        return axiosClient.get(url, {params});
    },
    get(id) {
        const url = `/farms/${id}`;
        return axiosClient.get(url);
    },
    getFarmsInCampaign(params) {
        const url = `/farms/farm-in-campaign/${params.id}`;
        return axiosClient.get(url, {params})
    },
    getFarmRevenue(params) {
        const url = `/farms/statistical/${params.id}`;
        return axiosClient.get(url, params);
    }
    
}

export default farmApi;