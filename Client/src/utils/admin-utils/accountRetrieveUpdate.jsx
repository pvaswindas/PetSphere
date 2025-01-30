import axiosInstance from "../../axios/axiosinstance"

export const retrieveAccountDetails = async (user_id) => {
    try {
        const response = await axiosInstance.get(`user/account/${user_id}`)
        return response.data
    } catch (error) {
        throw error
    }
}

export const updateAccountDetails = async (user_id, data) => {
    try {
        const response = await axiosInstance.put(`user/account/${user_id}/`, data)
        return response.data
    } catch (error) {
        throw error
    }
}