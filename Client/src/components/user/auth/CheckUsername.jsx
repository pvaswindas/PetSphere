import axios from "axios";

export const CheckUsername = async (username) => {
    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
    const response = await axios.post(`${apiBaseUrl}account/check-username/`, { username });
    return response.data;
};
