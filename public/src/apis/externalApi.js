import axiosClient from "./axiosClient";

const externalApi = {
    getAll() {
        const url = '/externals';
        return axiosClient.get(url);
    },
    getDeliveryZone() {
        const url = '/externals/zone-delivery';
        return axiosClient.get(url);
    },
    getCampaignZone() {
        const url = '/externals/zone-campaign';
        return axiosClient.get(url);
    }
}

export default externalApi;