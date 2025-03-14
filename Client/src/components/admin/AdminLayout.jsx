import React, { useState } from "react"
import { motion } from "framer-motion"
import WelcomeCard from "./dashboard/WelcomeCard"
import AdminSidebar from "./AdminSidebar"
import AdminNavbar from "./AdminNavbar"
import InsightCard from "./common/InsightCard"
import CalendarViewCard from "./common/CalendarViewCard"
import AdminBottombar from "./AdminBottombar"
import { FileUp, List, Grid, ArrowLeftToLine } from "lucide-react"

const AdminLayout = ({
    activeIcon,
    children,
    showWelcomeCard,
    pageTitle,
    pageDescription,
    actionButton=null,
    buttonAction=null,
    secondButton=null,
    secondButtonAction=null,
    setViewMode=null,
    viewMode="grid",
    isReports=false,
    isReportDetails=false,
    onBack=null,
}) => {
    // Animation variants
    const sidebarAnimation = {
        hidden: { x: -100, opacity: 0 },
        visible: { 
            x: 0, 
            opacity: 1,
            transition: { duration: 0.5, ease: "easeOut" }
        }
    }

    const mainContentAnimation = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1,
            transition: { 
                when: "beforeChildren",
                staggerChildren: 0.1,
                duration: 0.3,
                ease: "easeOut"
            }
        }
    }
    
    const itemAnimation = {
        hidden: { y: 20, opacity: 0 },
        visible: { 
            y: 0, 
            opacity: 1,
            transition: { duration: 0.5, ease: "easeOut" }
        }
    }
    
    const rightSectionAnimation = {
        hidden: { x: 100, opacity: 0 },
        visible: { 
            x: 0, 
            opacity: 1,
            transition: { duration: 0.5, delay: 0.2, ease: "easeOut" }
        }
    }
    
    const buttonAnimation = {
        hidden: { scale: 0.8, opacity: 0 },
        visible: { 
            scale: 1, 
            opacity: 1,
            transition: { 
                type: "spring", 
                stiffness: 500, 
                damping: 25 
            }
        }
    }

    return (
        <div className="bg-whiteOpacity02 min-h-screen flex h-screen overflow-hidden py-7">
            {/* Sidebar Section */}
            <motion.div 
                className="hidden lg:block h-full px-7"
                initial="hidden"
                animate="visible"
                variants={sidebarAnimation}
            >
                <AdminSidebar activeIcon={activeIcon} />
            </motion.div>

            {/* Main Layout */}
            <motion.div 
                className="flex flex-col flex-grow w-full lg:w-4/5 h-screen px-4 lg:px-0"
                initial="hidden"
                animate="visible"
                variants={mainContentAnimation}
            >
                {/* Navbar */}
                <motion.div variants={itemAnimation}>
                    <AdminNavbar />
                </motion.div>

                {/* Reserved space for WelcomeCard */}
                {showWelcomeCard && (
                    <motion.div 
                        className="mt-4 lg:mt-2 transition-all duration-300 lg:px-3"
                        variants={itemAnimation}
                    >
                        <WelcomeCard />
                    </motion.div>
                )}

                {/* Reserved space for PageTitle */}
                {pageTitle && (
                    <motion.div 
                        className="flex justify-between lg:px-4 mt-6"
                        variants={itemAnimation}
                    >
                        <span className="flex flex-col">
                            <h1 className="text-xl lg:text-2xl font-medium text-midnightBlue">{pageTitle}</h1>
                            {pageDescription &&
                                <p className="text-xs mb-4 text-midnightBlue opacity-50">{pageDescription}</p>
                            }
                        </span>
                        <div className="flex gap-3">
                            {isReports &&
                                <div className="flex items-center space-x-4">
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`p-2 rounded ${viewMode === 'grid' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
                                    >
                                        <Grid size={20} />
                                    </button>
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={`p-2 rounded ${viewMode === 'list' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
                                    >
                                        <List size={20} />
                                    </button>
                                </div>
                            }
                            
                            {isReportDetails && onBack &&
                                <button 
                                    onClick={onBack}
                                    className="flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6"
                                >
                                    <ArrowLeftToLine className="h-5 w-5 mr-2" />
                                    Back to Reports
                                </button>
                            }

                            {secondButton && secondButtonAction &&
                                <motion.button
                                    className="flex items-center gap-1 bg-deepCrimsonRed hover:bg-deep-crimson-red-gradient-end text-white
                                    px-5 lg:px-10 py-0 h-10 rounded-full"
                                    onClick={secondButtonAction}
                                    variants={buttonAnimation}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {secondButton}
                                </motion.button>
                            }
                            {actionButton && buttonAction &&
                                <motion.button
                                    className="flex items-center gap-1 bg-deepOceanBlue hover:bg-deep-ocean-blue-gradient-end text-white
                                    px-5 lg:px-10 py-0 h-10 rounded-full"
                                    onClick={buttonAction}
                                    variants={buttonAnimation}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {actionButton}
                                    {actionButton === "Export" && <FileUp size={17} />}
                                </motion.button>
                            }
                        </div>
                    </motion.div>
                )}

                {/* Content Section (Scrollable) */}
                <motion.div 
                    className="px-2 pb-10 lg:px-4 flex-grow overflow-y-auto"
                    variants={itemAnimation}
                >
                    {children}
                </motion.div>
            </motion.div>

            {/* Right Section */}
            <motion.div 
                className="hidden lg:flex flex-col gap-6 h-full w-[35%] px-7 overflow-y-auto"
                initial="hidden"
                animate="visible"
                variants={rightSectionAnimation}
            >
                <motion.div variants={itemAnimation} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                    <InsightCard />
                </motion.div>
                <motion.div variants={itemAnimation} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                    <CalendarViewCard />
                </motion.div>
            </motion.div>
            <AdminBottombar activeIcon={activeIcon} />
        </div>
    )
}

export default AdminLayout