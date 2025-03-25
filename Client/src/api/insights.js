import axiosInstance from "../axios/axiosinstance"

// Reports
export const fetchTotalReportedIssues = async () => {
    try {
        const response = await axiosInstance.get()
        return response.data
    } catch (error) {
        throw error
    }
}

// Team Members
export const fetchLatestTeamMembers = async (count = 4) => {
    try {
        const response = await axiosInstance.get(`user/get-latest-staffs/?limit=${count}`)
        return response.data
    } catch (error) {
        throw error
    }
}

// Users
export const fetchActiveUsers = async () => {
    try {
        const response = await axiosInstance.get('accounts/active-users/')
        return response.data
    } catch (error) {
        throw error
    }
}

// Revenue
export const fetchRevenue = async () => {
    try {
        const response = await axiosInstance.get('subscription/get-revenue/')
        return response.data
    } catch (error) {
        throw error
    }
}

export const fetchReportMetrics = async () => {
    try {
        const response = await axiosInstance.get('reports/admin/metrics/report-metrics/');
        return response.data;
    } catch (error) {
        throw error;
    }
};