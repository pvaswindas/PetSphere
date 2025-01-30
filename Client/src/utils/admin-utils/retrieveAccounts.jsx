import axiosInstance from "../../axios/axiosinstance";

export const fetchUserAccounts = async (query, page, page_size) => {
    try {
        let url = `user/filter/?role=user&page=${page}&page_size=${page_size}`;
        if (query) {
            url += `&search=${query}`;
        }
        const response = await axiosInstance.get(url);
        return response.data;
    } catch (error) {
        throw error;
    }
};


export const fetchAdminAccounts = async (query, page, page_size) => {
    try {
        let url = `user/filter/?role=admin&page=${page}&page_size=${page_size}`;
        if (query) {
            url += `&search=${query}`;
        }
        const response = await axiosInstance.get(url);
        return response.data;
    } catch (error) {
        throw error;
    }
};