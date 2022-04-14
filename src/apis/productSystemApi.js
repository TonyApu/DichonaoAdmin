import axiosClient from "./axiosClient";

const productSystemApi = {
    getAllWithPaging(params) {
        // const url = `/product-systems?page=${params.page}&size=${params.size}`;
        const url = "/product-systems";
        return axiosClient.get(url, {params});
    },
    addNew(data) {
        const url = "/product-systems";
        return axiosClient.post(url, data);
    },
    delete(id) {
        const url = `/product-systems/${id}`;
        return axiosClient.delete(url, id);
    },
    get(id) {
        const url = `/product-systems/${id}`;
        return axiosClient.get(url, id);
    },
    update(param) {
        const url =  `/product-systems/${param.id}`;
        return axiosClient.put(url, param)
    },
    getAll() {
        const url = '/product-systems/all';
        return axiosClient.get(url);
    }
}
export default productSystemApi;