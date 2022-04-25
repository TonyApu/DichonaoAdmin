import axiosClient from "./axiosClient";

const campaignsApi = {
  get(id) {
    const url = `/campaigns/${id}`;
    return axiosClient.get(url);
  },
  getAll(params) {
    const url = "/campaigns/all";
    return axiosClient.get(url, { params });
  },
  getAppy(params) {
    const url = "/campaigns/apply-request";
    return axiosClient.get(url, { params });
  },
  getFarmApply(params) {
    const url = `/campaigns/farm-apply-request/${params.campaignId}`;
    return axiosClient.get(url, { params });
  },
  getHarvestApply(params) {
    const url = `/campaigns/harvest-apply-request/${params.campaignId}/${params.farmId}`;
    return axiosClient.get(url, { params });
  },
  createCampaign(data) {
    const url = "/campaigns";

    return axiosClient.post(url, data);
  },
  updateCampaign(params) {
    const url = `/campaigns/${params.id}`;
    return axiosClient.put(url, params)
  },
  remove(params) {
    const url = `/campaigns/${params.id}?note=${params.note}`;
    return axiosClient.delete(url);
  }
};

export default campaignsApi;
