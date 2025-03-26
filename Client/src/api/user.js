import axiosInstance from "../axios/axiosinstance"

export const ChangePassword = async (data) => {
    try {
        const response = await axiosInstance.patch('accounts/change-password/', data)
        return response
    } catch (error) {
        throw error
    }
}
