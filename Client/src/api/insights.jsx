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
export const getLatestTeamMembers = async (count = 4) => {
    try {
        const response = await axiosInstance.get(`user/get-latest-staffs/?limit=${count}`)
        return response.data
    } catch (error) {
        throw error
    }
}

// Users
export const fetchTotalActiveUsers = async () => {
    try {
        const response = await axiosInstance.get()
        return response.data
    } catch (error) {
        throw error
    }
}

export const fetchUserGrowthFromLastMonth = async () => {
    try {
        const response = await axiosInstance.get()
        return response.data
    } catch (error) {
        throw error
    }
}

// Revenue
export const fetchTotalRevenue = async () => {
    try {
        const response = await axiosInstance.get()
        return response.data
    } catch (error) {
        throw error
    }
}

export const fetchRevenueGrowthFromLastMonth = async () => {
    try {
        const response = await axiosInstance.get()
        return response.data
    } catch (error) {
        throw error
    }
}
