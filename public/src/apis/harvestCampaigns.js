import axiosClient from "./axiosClient";

const harvestCampaignsApi = {
    getAll(params) {
        const url = '/product-harvest-in-campaigns';
        return axiosClient.get(url, {params});
    },
    get(id) {
        const url = `/product-harvest-in-campaigns/${id}`;
        return axiosClient.get(url); 
    },
    approve(id) {
        const url = `/product-harvest-in-campaigns/accept`;
        return axiosClient.put(url, id);
    },
    reject(params) {
        const url = `/product-harvest-in-campaigns/reject?id=${params.id}&note=${params.note}`;
        return axiosClient.put(url);
    },
    getFarmHarvest(params) {
        const url = `/product-harvest-in-campaigns/campaign/${params.campaignId}/farm/${params.farmId}`;
        return axiosClient.get(url, {params});
    }
}

export default harvestCampaignsApi;