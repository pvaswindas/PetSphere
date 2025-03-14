import React from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import { ArrowLeftToLine, Flag, User, Calendar, AlertTriangle, Ban, MessageSquareWarning, CheckCircle, XCircle } from 'lucide-react';


function ReportDetails({ report, onBack, onAction }) {
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
        case 'comment':
            return [
            { label: 'Hide Comment', icon: MessageSquareWarning, action: 'hide', color: 'yellow' },
            { label: 'Delete Comment', icon: XCircle, action: 'delete', color: 'red' },
            { label: 'Approve', icon: CheckCircle, action: 'approve', color: 'green' }
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
        default:
            return 'bg-gray-100 text-gray-800';
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
                            <p className="mt-1 flex items-center text-lg font-medium text-gray-900">
                                <User className="h-5 w-5 mr-2 text-gray-400" />
                                {report.type === 'user' ? report.reportedUser :
                                report.type === 'listing' ? report.reportedListing :
                                report.reportedContent}
                            </p>
                            </div>

                            <div>
                            <h3 className="text-sm font-medium text-gray-500">Report Date</h3>
                            <p className="mt-1 flex items-center text-lg font-medium text-gray-900">
                                <Calendar className="h-5 w-5 mr-2 text-gray-400" />
                                {report.date}
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

                        <div className="mt-8 border-t border-gray-200 pt-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Take Action</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {getActionButtons().map((button) => (
                            <button
                                key={button.action}
                                onClick={() => onAction(report.id, button.action)}
                                className={`flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                                ${button.color === 'red' ? 'bg-red-600 hover:bg-red-700' :
                                    button.color === 'yellow' ? 'bg-yellow-500 hover:bg-yellow-600' :
                                    button.color === 'orange' ? 'bg-orange-500 hover:bg-orange-600' :
                                    'bg-green-600 hover:bg-green-700'}`}
                            >
                                <button.icon className="h-5 w-5 mr-2" />
                                {button.label}
                            </button>
                            ))}
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

export default ReportDetails;