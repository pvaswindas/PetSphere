import React, { useState } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import { Flag, User, Calendar, AlertTriangle, Ban, CheckCircle, XCircle } from 'lucide-react';
import axiosInstance from '../../../axios/axiosinstance';

function ReportDetails({ report, onBack, onReportUpdated }) {
    const [isLoading, setIsLoading] = useState(false);
    const [actionMessage, setActionMessage] = useState(null);
    const activeIcon = "manage-reports";
    
    const getActionButtons = () => {
        switch (report.type) {
        case 'user':
            return [
            { label: 'Warn User', icon: AlertTriangle, action: 'warn', color: 'yellow' },
            { label: 'Temporary Ban', icon: Ban, action: 'temp-ban', color: 'orange' },
            { label: 'Permanent Ban', icon: Ban, action: 'perm-ban', color: 'red' }
            ];
        case 'listing':
            return [
            { label: 'Flag as Suspicious', icon: Flag, action: 'flag', color: 'yellow' },
            { label: 'Remove Listing', icon: XCircle, action: 'remove', color: 'red' },
            { label: 'Mark as Safe', icon: CheckCircle, action: 'safe', color: 'green' }
            ];
        case 'post':
            return [
                { label: 'Delete Post', icon: XCircle, action: 'delete', color: 'red' },
                { label: 'Approve Post', icon: CheckCircle, action: 'approve', color: 'green' }
            ];
        default:
            return [];
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
        case 'pending':
            return 'bg-yellow-100 text-yellow-800';
        case 'investigating':
            return 'bg-blue-100 text-blue-800';
        case 'resolved':
            return 'bg-green-100 text-green-800';
        case 'rejected':
            return 'bg-gray-100 text-gray-800';
        default:
            return 'bg-gray-100 text-gray-800';
        }
    };

    const handleNavigate = () => {
        let navigateTo = 'post'

        if (report.type === 'user') {
            navigateTo = 'profile'
        }

        if (report.type === 'listing') {
            navigateTo = 'listing'
        }

        window.open(`/${navigateTo}/${report.link_to_content}`, '_blank', 'noopener,noreferrer');
    };
    
    const handleAction = async (reportId, action) => {
        setIsLoading(true);
        setActionMessage(null);
        
        try {
            
            const response = await axiosInstance.post('reports/handle-report-action/', {
                report_id: reportId,
                action: action
            });
            
            if (response.data.status === 'success') {
                setActionMessage({
                    type: 'success',
                    text: response.data.message
                });
                
                if (onReportUpdated) {
                    // Create an updated report object based on the action
                    const updatedReport = {
                        ...report,
                        status: getUpdatedStatus(action)
                    };
                    onReportUpdated(updatedReport);
                }
                
                setTimeout(() => {
                    onBack();
                }, 2000);
            }
        } catch (error) {
            console.error("Error handling action:", error);
            setActionMessage({
                type: 'error',
                text: error.response?.data?.message || 'An error occurred while processing your request'
            });
        } finally {
            setIsLoading(false);
        }
    };
    
    const getUpdatedStatus = (action) => {
        switch (action) {
            case 'warn':
            case 'temp-ban':
            case 'perm-ban':
            case 'delete':
            case 'remove':
                return 'resolved';
            case 'flag':
                return 'investigating';
            case 'approve':
            case 'safe':
                return 'rejected';
            default:
                return report.status;
        }
    };

    return (
        <AdminLayout
            activeIcon={activeIcon}
            pageTitle={"Report Detail"}
            pageDescription={"Review and manage user-reported content to ensure community guidelines are upheld."}
            isReportDetails={true}
            onBack={onBack}
        >
            <div className="bg-gray-50 pb-16">
                <div className="max-w-7xl mx-auto pt-4">
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                        <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-gray-900">Report Details</h1>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(report.status)}`}>
                            {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                        </span>
                        </div>
                    </div>

                    <div className="p-6">
                        {actionMessage && (
                            <div className={`mb-4 p-4 rounded-md ${actionMessage.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                {actionMessage.text}
                            </div>
                        )}
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                            <h3 className="text-sm font-medium text-gray-500">Report Type</h3>
                            <p className="mt-1 flex items-center text-lg font-medium text-gray-900">
                                <Flag className="h-5 w-5 mr-2 text-gray-400" />
                                {report.type.charAt(0).toUpperCase() + report.type.slice(1)}
                            </p>
                            </div>

                            <div>
                            <h3 className="text-sm font-medium text-gray-500">Reported Content</h3>
                            <p 
                                className="mt-1 flex items-center text-lg font-medium text-gray-900 hover:text-amber-500 cursor-pointer"
                                onClick={() => handleNavigate()}
                            >
                                <User className="h-5 w-5 mr-2 text-gray-400" />
                                {report.reported_content}
                            </p>
                            </div>

                            <div>
                            <h3 className="text-sm font-medium text-gray-500">Report Date</h3>
                            <p className="mt-1 flex items-center text-lg font-medium text-gray-900">
                                <Calendar className="h-5 w-5 mr-2 text-gray-400" />
                                {report.created_at}
                            </p>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-medium text-gray-500 mb-2">Reason</h3>
                            <p className="text-gray-900 mb-4">{report.reason}</p>
                            
                            <h3 className="text-sm font-medium text-gray-500 mb-2">Description</h3>
                            <p className="text-gray-900">{report.description}</p>
                        </div>
                        </div>

                        {report.status === "pending" &&
                            <div className="mt-8 border-t border-gray-200 pt-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Take Action</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {getActionButtons().map((button) => (
                                    <button
                                        key={button.action}
                                        onClick={() => handleAction(report.id, button.action)}
                                        disabled={isLoading}
                                        className={`flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                                        ${button.color === 'red' ? 'bg-red-600 hover:bg-red-700' :
                                            button.color === 'yellow' ? 'bg-yellow-500 hover:bg-yellow-600' :
                                            button.color === 'orange' ? 'bg-orange-500 hover:bg-orange-600' :
                                            'bg-green-600 hover:bg-green-700'}
                                        ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        <button.icon className="h-5 w-5 mr-2" />
                                        {button.label}
                                    </button>
                                    ))}
                                </div>
                            </div>
                        }
                    </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

export default ReportDetails;