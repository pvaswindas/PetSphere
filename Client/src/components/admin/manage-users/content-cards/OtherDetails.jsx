import React from 'react'
import { formatDate } from '../../../../utils/admin-utils/formatDate'

function OtherDetails({ profile }) {
    return (
        <div className="bg-pastelBlue lg:shadow-lg rounded-xl p-4 h-64 lg:hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-md font-semibold text-white mb-4">
                Other Details
            </h2>
            <div className="text-sm space-y-2 text-softSkyBlue">
                <p>
                    <span className="font-medium text-softSkyBlue80">Subscription Status:</span>{" "}
                    {profile?.IsSubscribed ? "Subscribed" : "Not Subscribed"}
                </p>
                <p>
                    <span className="font-medium text-softSkyBlue80">Joined Date:</span>{" "}
                    {formatDate(profile?.user.date_joined)}
                </p>
            </div>
        </div>
    )
}

export default OtherDetails