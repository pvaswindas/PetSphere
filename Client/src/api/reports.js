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