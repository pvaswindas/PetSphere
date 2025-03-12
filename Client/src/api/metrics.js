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



// Subscription Revenue
export const fetchSubscriptionRevenueData = async () => {
    try {
      const response = await axiosInstance.get('subscription/metrics/subscription-revenue');
      return response;
    } catch (error) {
      console.error("Error fetching subscription revenue data:", error);
      throw error;
    }
};



// Subscription Status
export const fetchSubscriptionStatusData = async () => {
    try {
        const response = await axiosInstance.get('subscription/metrics/subscription-status/');
        return response.data;
    } catch (error) {
        console.error("Error fetching subscription status data:", error);
        throw error;
    }
};


// Geographic Listing
export const fetchGeographicListingData = async () => {
    try {
        const response = await axiosInstance.get('subscription/metrics/geographic-listings/');
        return response.data;
    } catch (error) {
        console.error("Error fetching geographic listing data:", error);
        throw error;
    }
};