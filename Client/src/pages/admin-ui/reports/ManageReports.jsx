import React, { useEffect, useState } from 'react'
import AdminLayout from '../../../components/admin/AdminLayout'
import { Flag, Users, ShoppingBag, Image, BarChart3 } from 'lucide-react';
import ReportDetails from './ReportsDetails';
import { getReports, getReportStats } from '../../../api/reports';
import AlertSnackbar from '../../../components/Snackbar/AlertSnackbar';

const reportTypeConfig = {
    'user': { icon: Users, color: 'bg-blue-100 text-blue-600' },
    'listing': { icon: ShoppingBag, color: 'bg-green-100 text-green-600' },
    'post': { icon: Image, color: 'bg-purple-100 text-purple-600' },
    'comment': { icon: Flag, color: 'bg-orange-100 text-orange-600' }
  };

function ManageReports() {
    const activeIcon = "manage-reports";
    const [viewMode, setViewMode] = useState('grid');
    const [selectedReport, setSelectedReport] = useState(null);
    const [reports, setReports] = useState([]);
    const [reportStats, setReportStats] = useState([])
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [alertType, setAlertType] = useState("error")
    const [isLoading, setIsLoading] = useState(true);

    const fetchReports = async () => {
        setIsLoading(true)
        try {
            const response = await getReports();
            setReports(response.results);
        } catch (error) {
            setSnackbarMessage("Error fetching reports");
            setAlertType("error")
            setSnackbarOpen(true);
        } finally {
            setIsLoading(false)
        }
    };

    const fetchReportStats = async () => {
        try {
            const stats = await getReportStats();
            const formattedStats = Object.entries(stats).map(([type, count]) => {
                const config = reportTypeConfig[type] || { 
                    icon: Flag, 
                    color: 'bg-gray-100 text-gray-600' 
                };
                
                return {
                    type: `${type.charAt(0).toUpperCase() + type.slice(1)} Reports`,
                    count,
                    icon: config.icon,
                    color: config.color
                };
            });
            
            setReportStats(formattedStats);
        } catch (error) {
            setSnackbarMessage("Error fetching report statistics");
            setAlertType("error");
            setSnackbarOpen(true);
        }
    };

    useEffect(() => {
        fetchReports();
        fetchReportStats()
    }, []);

    const handleBackToList = () => {
        setSelectedReport(null);
        fetchReports();
        fetchReportStats()
    };


    const handleReportUpdated = (updatedReport) => {
        setReports(prevReports => 
            prevReports.map(report => 
                report.id === updatedReport.id ? updatedReport : report
            )
        );
        
        if (selectedReport && selectedReport.id === updatedReport.id) {
            setSelectedReport(updatedReport);
        }
    };

    if (selectedReport) {
        return (
          <ReportDetails
            report={selectedReport}
            onBack={() => handleBackToList()}
            handleReportUpdated={handleReportUpdated}
          />
        );
      }

    return (
        <AdminLayout
            activeIcon={activeIcon}
            pageTitle={"Reports & Flags"}
            isReports={true}
            viewMode={viewMode}
            setViewMode={setViewMode}
            pageDescription={"Review and manage user-reported content to ensure community guidelines are upheld."}
        >
            <AlertSnackbar
                open={snackbarOpen}
                message={snackbarMessage}
                alert_type={alertType}
                onClose={() => setSnackbarOpen(false)}
            />
            <div className="pb-16">
                <main className="max-w-7xl mx-auto pt-4">
                    {/* Stats Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {reportStats.map((stat) => (
                        <div key={stat.type} className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className={`p-3 rounded-full ${stat.color}`}>
                            <stat.icon className="h-6 w-6" />
                            </div>
                            <div className="ml-4">
                            <h3 className="text-lg font-medium text-gray-900">{stat.type}</h3>
                            <p className="text-2xl font-semibold">{stat.count}</p>
                            </div>
                        </div>
                        </div>
                    ))}
                    </div>

                    {/* Reports List */}
                    <div className="bg-white rounded-lg shadow">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-800">Recent Reports</h2>
                    </div>
                    
                    <div className={`p-6 ${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-4'}`}>
                        {reports.map((report) => (
                        <div 
                            key={report.id} 
                            className={`bg-white ${viewMode === 'grid' ? 'rounded-lg border' : 'border-b'} p-4`}
                        >
                            <div className="flex items-start justify-between">
                            <div className="flex items-center">
                                <Flag className={`h-5 w-5 ${
                                report.status === 'pending' ? 'text-yellow-500' :
                                report.status === 'investigating' ? 'text-blue-500' :
                                'text-green-500'
                                }`} />
                                <span className="ml-2 text-sm font-medium text-gray-500">{report.type}</span>
                            </div>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                                report.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                report.status === 'investigating' ? 'bg-blue-100 text-blue-800' :
                                'bg-green-100 text-green-800'
                            }`}>
                                {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                            </span>
                            </div>
                            
                            <div className="mt-3">
                            <h3 className="text-lg font-medium text-gray-900">
                                {report.reported_content}
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">{report.description}</p>
                            </div>
                            
                            <div className="mt-4 flex items-center justify-between">
                            <span className="text-sm text-gray-500">{report.created_at}</span>
                            <button 
                                className="text-sm text-blue-600 hover:text-blue-800"
                                onClick={() => setSelectedReport(report)}
                            >
                                View Details
                            </button>
                            </div>
                        </div>
                        ))}
                    </div>
                    </div>

                    {/* Report Types Overview */}
                    <div className="mt-8 bg-white rounded-lg shadow">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <div className="flex items-center">
                        <BarChart3 className="h-5 w-5 text-gray-500 mr-2" />
                        <h2 className="text-xl font-semibold text-gray-800">Report Categories Overview</h2>
                        </div>
                    </div>
                    
                    <div className="p-6">
                        <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-500">Harassment</span>
                            <div className="flex items-center">
                            <div className="w-48 h-2 bg-gray-200 rounded-full mr-3">
                                <div className="w-3/4 h-2 bg-red-500 rounded-full"></div>
                            </div>
                            <span className="text-sm font-medium">75%</span>
                            </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-500">Spam</span>
                            <div className="flex items-center">
                            <div className="w-48 h-2 bg-gray-200 rounded-full mr-3">
                                <div className="w-1/2 h-2 bg-yellow-500 rounded-full"></div>
                            </div>
                            <span className="text-sm font-medium">50%</span>
                            </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-500">Suspicious Listings</span>
                            <div className="flex items-center">
                            <div className="w-48 h-2 bg-gray-200 rounded-full mr-3">
                                <div className="w-1/4 h-2 bg-blue-500 rounded-full"></div>
                            </div>
                            <span className="text-sm font-medium">25%</span>
                            </div>
                        </div>
                        </div>
                        
                        <div className="mt-6 text-sm text-gray-500">
                        <p className="font-medium">About the Report System</p>
                        <p className="mt-2">
                            Our reporting system allows users to flag inappropriate content, suspicious listings, 
                            and problematic user behavior. Reports are reviewed by our moderation team and handled 
                            based on severity and type. The average response time is 24 hours for high-priority reports.
                        </p>
                        </div>
                    </div>
                    </div>
                </main>
            </div>
        </AdminLayout>
    )
}

export default ManageReports