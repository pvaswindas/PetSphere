import axios from "axios";

export const validateUser = async (username) => {
    try {
        const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
        const response = await axios.post(`${apiBaseUrl}accounts/check-username/`, {
        username,
        })
        return response.data;
    } catch (error) {
        throw new Error("Error checking username availability.")
    }
}
