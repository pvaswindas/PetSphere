import axiosInstance from "../axios/axiosinstance";

export const submitReport = async (
    reportType=null,
    reportReason=null,
    additionalInfo=null,
    targetId=null,
    linkToContent=null
) => {
    try {
        await axiosInstance.post('reports/report-content/', {
            type: reportType,
            reason: reportReason,
            description: additionalInfo,
            reported_content: targetId.toString(),
            link_to_content: linkToContent,
            status: 'pending'
        });
    } catch (error) {
        throw error
    }
}

export const getReports = async () => {
    try {
        const response = await axiosInstance.get('reports/report-content/')
        return response.data
    } catch (error) {
        throw error
    }
}


export const getReportStats = async () => {
    try {
        const response = await axiosInstance.get('reports/stats/')
        return response.data;
    } catch (error) {
        throw error;
    }
  };