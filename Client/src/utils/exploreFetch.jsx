import axiosInstance from "../axios/axiosinstance";

export const fetchPosts = async (query) => {
    try {
        let url = "posts/posts-list/";
        if (query) {
            url += `?search=${query}`;
        }
        const response = await axiosInstance.get(url);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const fetchPetListings = async (query) => {
    try {
        let url = "posts/petlistings-list/";
        if (query) {
            url += `?search=${query}`;
        }
        const response = await axiosInstance.get(url);
        return response.data;
    } catch (error) {
        console.error("Error fetching pet listings:", error);
        throw error;
    }
};

export const fetchPeople = async (query) => {
    try {
        let url = "user/people-list/";
        if (query) {
            url += `?search=${query}`;
        }
        const response = await axiosInstance.get(url);
        return response.data;
    } catch (error) {
        console.error("Error fetching people:", error);
        throw error;
    }
};
