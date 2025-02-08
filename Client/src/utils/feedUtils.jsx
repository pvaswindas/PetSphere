import axiosInstance from "../axios/axiosinstance"

export const getUserFeed = async () => {
    try {
        const response = await axiosInstance('posts/user-feed/')
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