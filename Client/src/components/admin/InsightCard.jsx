import React from "react"
import DashboardWelcome from "../../assets/admin/dashboardcard.svg"

const InsightCard = () => {
    return (
        <div className="bg-softSkyBlue shadow-lg flex items-center justify-center rounded-[2.5rem] h-64 w-full">
            <div className="grid grid-cols-2 gap-4">
                {/* Card 1 */}
                <div className="bg-white w-40 h-24 rounded-3xl flex items-center justify-center transform transition-transform duration-300 hover:scale-110">
                    {/* Add content here */}
                </div>

                {/* Card 2 */}
                <div className="w-40 h-24 rounded-3xl flex items-center justify-center overflow-hidden transform transition-transform duration-300 hover:scale-110">
                    <img src={DashboardWelcome} alt="" className="object-contain w-full" />
                </div>

                {/* Card 3 */}
                <div className="bg-white w-40 h-24 rounded-3xl flex items-center justify-center transform transition-transform duration-300 hover:scale-110">
                    {/* Add content here */}
                </div>

                {/* Card 4 */}
                <div className="bg-pastelBlue w-40 h-24 rounded-3xl flex items-center justify-center transform transition-transform duration-300 hover:scale-110">
                    {/* Add content here */}
                </div>
            </div>
        </div>
    )
}

export default InsightCard
