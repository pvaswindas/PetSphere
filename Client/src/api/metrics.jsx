import axiosInstance from "../axios/axiosinstance"

// Post Engagement
export const fetchPostEngagementData = async () => {
    try{
        const response = await axiosInstance.get("posts/admin/metrics/engagement")
        return response.data
    } catch(error) {
        throw error
    }
}