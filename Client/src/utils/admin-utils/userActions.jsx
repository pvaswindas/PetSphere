import axiosInstance from "../../axios/axiosinstance";

export const suspendUserAccount = async (user_id) => {
    try {
        const response = await axiosInstance.patch(`accounts/suspend-account/${user_id}/`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const reinstateUserAccount = async (user_id) => {
    try {
        const response = await axiosInstance.patch(`accounts/reinstate-account/${user_id}/`);
        return response.data;
    } catch (error) {
        throw error;
    }
};