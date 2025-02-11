import axiosInstance from "../axios/axiosinstance"
import qs from "qs";

export const getUserFeed = async () => {
    try {
        const fields = ["id", "user", "profile_picture", "IsSubscribed"]
        const response = await axiosInstance.get("posts/user-feed/", {
            params: { fields },
            paramsSerializer: (params) => qs.stringify(params, { arrayFormat: "repeat" })
        })
        return response.data
    } catch (error){
        throw error
    }
}


export const getMarketPlace = async () => {
    try {
        const response = await axiosInstance('posts/marketplace/')
        return response.data
    } catch (error) {
        throw error
    }
}