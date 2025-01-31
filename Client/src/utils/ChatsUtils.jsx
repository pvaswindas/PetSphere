import axiosInstance from "../axios/axiosinstance";

export const getConversation = async () => {
    try {
        const response = await axiosInstance.get('messaging/conversations/');
        return response.data
    } catch (error) {
        throw error
    }
}


export const getMessages = async (username) => {
    try {
        const response = await axiosInstance.get(`messaging/chat/${username}/`);
        return response.data;
    } catch (error) {
        throw error
    }
};
