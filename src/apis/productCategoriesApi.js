import axiosClient from "./axiosClient";

const productCategoriesApi = {
    getAll(params) {
        const url = '/product-categories';
        return axiosClient.get(url, {params});
    },
}

export default productCategoriesApi;