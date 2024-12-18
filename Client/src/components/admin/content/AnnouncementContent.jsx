import React from "react"
import FlexiCard from "../FlexiCard"

const AnnouncementContent = () => {

    return (
        <div>
            {/* Content Section */}
            <div className="flex flex-col my-4">
                <h1 className="text-xl lg:text-2xl font-medium text-midnightBlue">Manage Feed Updates</h1>
                <p className="text-xs mb-2 text-midnightBlue opacity-50">
                Add updates for users to stay engaged and informed.
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FlexiCard title={"Add Updates"} description={"Add new updates for users to stay engaged and informed."} />
                <FlexiCard title={"Recent Updates"} description={"View and manage the latest updates."} />
            </div>
        </div>
    )
}

export default AnnouncementContent
