import axiosInstance from "../axios/axiosinstance"

export const initiateCall = async () => {
    try {
        const response = await axiosInstance.get(`video`)
    } catch (error) {
        throw error
    }
}