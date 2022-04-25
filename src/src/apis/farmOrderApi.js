import axiosClient from "./axiosClient";

const farmOrderApi = {
    getAll(params) {
        const url = `/farm-orders/${params.campaignId}/${params.farmId}`;
        return axiosClient.get(url, params);
    },
    getRevenue(params) {
        const url = "/farm-orders/revenuse";
        return axiosClient.get(url, {params})
    }
}

export default farmOrderApi;