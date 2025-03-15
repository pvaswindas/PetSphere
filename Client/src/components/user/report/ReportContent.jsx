import React, { useState, useEffect, useCallback } from 'react';
import { X, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { submitReport } from '../../../api/reports';
import AlertSnackbar from '../../Snackbar/AlertSnackbar';

function ReportContent({ 
  isOpen = false, 
  onClose, 
  reportType = 'post', 
  targetId,
  targetSlug = '',
  targetUsername = '',
  customClass = '' 
}) {
    const [reportReason, setReportReason] = useState('');
    const [additionalInfo, setAdditionalInfo] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const [snackbarMessage, setSnackbarMessage] = useState("")
    const [snackbarOpen, setSnackbarOpen] = useState(false)
    const [snackbarAlertType, setSnackbarAlertType] = useState("error")
  
    const reportOptions = {
        post: [
        'Inappropriate content',
        'Harassment or bullying',
        'Spam',
        'False information',
        'Violence',
        'Self-harm',
        'Other'
        ],
        user: [
        'Fake account',
        'Impersonation',
        'Inappropriate content',
        'Harassment',
        'Spam',
        'Other'
        ],
        comment: [
        'Harassment or bullying',
        'Spam',
        'Inappropriate content',
        'False information',
        'Other'
        ]
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!reportReason) {
            return;
        }
        
        setLoading(true);
        try {
            let linkToContent = '';
            if (reportType === 'post') {
                linkToContent = targetSlug;
            } else if (reportType === 'user') {
                linkToContent = targetUsername;
            } else if (reportType === 'comment') {
                linkToContent = targetId.toString();
            }
            
            await submitReport(
                reportType,
                reportReason,
                additionalInfo,
                targetId,
                linkToContent
            );
            
            setLoading(false);
            setSubmitted(true);
            
            // Auto close after 4 seconds
            setTimeout(() => {
                handleClose('success', 'Report submitted successfully');
            }, 4000);
            
        } catch (error) {
            setSnackbarMessage("Report submission error")
            setSnackbarAlertType("error")
            setSnackbarOpen(true)
            console.error('Report submission error:', error);
            setLoading(false);
        }
    };

    const handleClose = useCallback((status, message) => {
        setSubmitted(false);
        setReportReason('');
        setAdditionalInfo('');
        onClose && onClose(status, message);
    }, [onClose]);

    const options = reportOptions[reportType] || reportOptions.post;

    // Handle ESC key
    useEffect(() => {
        const handleEsc = (e) => {
        if (e.key === 'Escape' && isOpen) {
            if (submitted) {
                handleClose('success', 'Report submitted successfully');
            } else {
                handleClose();
            }
        }
        };
        
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose, submitted, handleClose]);

    // Animation variants
    const mobileVariants = {
        hidden: { y: '100%' },
        visible: { 
        y: 0,
        transition: { 
            type: 'spring', 
            damping: 25, 
            stiffness: 300 
        }
        },
        exit: { 
        y: '100%',
        transition: {
            type: 'spring',
            damping: 30,
            stiffness: 300
        }
        }
    };

    const desktopVariants = {
        hidden: { opacity: 0 },
        visible: { 
        opacity: 1,
        transition: { duration: 0.2 }
        },
        exit: { 
        opacity: 0,
        transition: { duration: 0.2 }
        }
    };

    // Backdrop for mobile view
    const backdropVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
        exit: { opacity: 0 }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence mode="wait">
        <AlertSnackbar
            open={snackbarOpen}
            message={snackbarMessage}
            alert_type={snackbarAlertType}
            onClose={() => setSnackbarOpen(false)}
        />
        {isOpen && (
            <>
            {/* Mobile backdrop overlay */}
            <motion.div 
                className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={backdropVariants}
                onClick={() => !submitted && handleClose()}
            />

            {/* Mobile slide-up panel */}
            <motion.div 
                className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-lg shadow-lg h-3/4 overflow-hidden"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={mobileVariants}
            >
                <div className="p-4 border-b flex justify-between items-center">
                <h2 className="text-lg font-semibold">
                    {submitted ? "Thanks for your feedback" : `Report ${reportType}`}
                </h2>
                <button 
                    onClick={() => submitted ? handleClose('success', 'Report submitted successfully') : handleClose()} 
                    className="text-gray-500 hover:text-gray-700"
                >
                    <X size={20} />
                </button>
                </div>

                <div className="p-4 overflow-y-auto" style={{ maxHeight: 'calc(75vh - 60px)' }}>
                {submitted ? (
                    <div className="flex flex-col items-center text-center py-8">
                        <CheckCircle size={64} className="text-teal-500 mb-4" />
                        <h3 className="text-xl font-medium mb-2">Thank you for your report</h3>
                        <p className="text-gray-600 mb-6">
                            We appreciate your help in keeping our community safe. Our team will review your report and take appropriate action.
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-medium mb-2">
                            Why are you reporting this {reportType}?
                        </label>
                        <div className="space-y-2">
                            {options.map((option) => (
                            <div key={option} className="flex items-start">
                                <input
                                type="radio"
                                id={`mobile-${option}`}
                                name="reportReason"
                                value={option}
                                checked={reportReason === option}
                                onChange={() => setReportReason(option)}
                                className="mt-1"
                                />
                                <label htmlFor={`mobile-${option}`} className="ml-2 text-gray-700">
                                {option}
                                </label>
                            </div>
                            ))}
                        </div>
                        </div>

                        <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-medium mb-2">
                            Additional information (optional)
                        </label>
                        <textarea
                            className="w-full border rounded-md p-2 text-gray-700 resize-none focus:outline-none focus:ring-1 focus:ring-gray-200"
                            rows="4"
                            value={additionalInfo}
                            onChange={(e) => setAdditionalInfo(e.target.value)}
                            placeholder="Please provide any additional details that might help us understand the issue."
                        />
                        </div>

                        <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={() => handleClose()}
                            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600 flex items-center"
                            disabled={!reportReason || loading}
                        >
                            {loading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Submitting...
                            </>
                            ) : (
                            'Submit Report'
                            )}
                        </button>
                        </div>
                    </form>
                )}
                </div>
            </motion.div>

            {/* Desktop version */}
            <motion.div 
                className={`hidden lg:flex bg-white rounded-e-lg flex-col ${customClass}`}
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={desktopVariants}
            >
                <div className="p-4 border-b flex justify-between items-center">
                <h2 className="text-lg font-semibold">
                    {submitted ? "Thanks for your feedback" : `Report ${reportType}`}
                </h2>
                <button 
                    onClick={() => submitted ? handleClose('success', 'Report submitted successfully') : handleClose()} 
                    className="text-gray-500 hover:text-gray-700"
                >
                    <X size={20} />
                </button>
                </div>
                
                <div className="p-4 flex-grow overflow-y-auto">
                {submitted ? (
                    <div className="flex flex-col items-center text-center py-8">
                        <CheckCircle size={64} className="text-teal-500 mb-4" />
                        <h3 className="text-xl font-medium mb-2">Thank you for your report</h3>
                        <p className="text-gray-600 mb-6">
                            We appreciate your help in keeping our community safe. Our team will review your report and take appropriate action.
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-medium mb-2">
                            Why are you reporting this {reportType}?
                        </label>
                        <div className="space-y-2">
                            {options.map((option) => (
                            <div key={option} className="flex items-start">
                                <input
                                type="radio"
                                id={`desktop-${option}`}
                                name="reportReason"
                                value={option}
                                checked={reportReason === option}
                                onChange={() => setReportReason(option)}
                                className="mt-1"
                                />
                                <label htmlFor={`desktop-${option}`} className="ml-2 text-gray-700">
                                {option}
                                </label>
                            </div>
                            ))}
                        </div>
                        </div>

                        <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-medium mb-2">
                            Additional information (optional)
                        </label>
                        <textarea
                            className="w-full border rounded-md p-2 text-gray-700 resize-none focus:outline-none focus:ring-1 focus:ring-gray-200"
                            rows="4"
                            value={additionalInfo}
                            onChange={(e) => setAdditionalInfo(e.target.value)}
                            placeholder="Please provide any additional details that might help us understand the issue."
                        />
                        </div>

                        <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={() => handleClose()}
                            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600 flex items-center"
                            disabled={!reportReason || loading}
                        >
                            {loading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Submitting...
                            </>
                            ) : (
                            'Submit Report'
                            )}
                        </button>
                        </div>
                    </form>
                )}
                </div>
            </motion.div>
            </>
        )}
        </AnimatePresence>
    );
}

export default ReportContent;