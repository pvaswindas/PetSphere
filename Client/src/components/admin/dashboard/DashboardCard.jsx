import React from "react"

const DashboardCard = () => {
    return (
        <div className="bg-white shadow-lg rounded-2xl p-6 w-full">
            <div className="grid grid-cols-2 gap-4">
                {/* Card 1 */}
                <div className="bg-blue-100 p-10 rounded-3xl flex items-center justify-center shadow">
                    <p className="text-blue-700 font-medium">Card 1</p>
                </div>

                {/* Card 2 */}
                <div className="bg-green-100 p-10 rounded-3xl flex items-center justify-center shadow">
                    <p className="text-green-700 font-medium">Card 2</p>
                </div>

                {/* Card 3 */}
                <div className="bg-yellow-100 p-10 rounded-3xl flex items-center justify-center shadow">
                    <p className="text-yellow-700 font-medium">Card 3</p>
                </div>

                {/* Card 4 */}
                <div className="bg-red-100 p-10 rounded-3xl flex items-center justify-center shadow">
                    <p className="text-red-700 font-medium">Card 4</p>
                </div>
            </div>
        </div>
    )
}

export default DashboardCard
