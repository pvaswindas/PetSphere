import React from "react"
import DashboardWelcome from "../../../assets/admin/dashboardcard.svg"

const DashboardCard = () => {
    return (
        <div className="bg-softSkyBlue shadow-lg flex items-center justify-center rounded-[2.5rem] h-64 w-full">
            <div className="grid grid-cols-2 gap-4">
                {/* Card 1 */}
                <div className="bg-white w-40 h-24 rounded-3xl flex items-center justify-center">

                </div>

                {/* Card 2 */}
                <div className="w-40 h-24 rounded-3xl flex items-center justify-center overflow-hidden">
                    <img src={DashboardWelcome} alt="" className="object-contain w-full" />
                </div>

                {/* Card 3 */}
                <div className="bg-white w-40 h-24 rounded-3xl flex items-center justify-center">

                </div>

                {/* Card 4 */}
                <div className="bg-pastelBlue w-40 h-24 rounded-3xl flex items-center justify-center">

                </div>
            </div>
        </div>
    )
}

export default DashboardCard
