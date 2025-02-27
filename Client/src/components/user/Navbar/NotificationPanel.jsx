import React from "react";

function NotificationPanel() {
    return (
        <div className="fixed top-12 lg:top-16 right-2 lg:right-20 z-50 w-52 bg-white shadow-md border border-gray-100 rounded-md p-3">
        <h2 className="text-md font-semibold mb-2">Notifications</h2>
        <div className="text-sm text-gray-600">No new notifications</div>
        </div>
    );
}

export default NotificationPanel;
