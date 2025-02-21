import React, { useState } from "react";
import NavigationPanel from "./NavigationPanel";
import AnnouncementsPanel from "./AnnouncementsPanel";


const Sidebar = () => {

    const [announcementsAvailable, setAnnouncementsAvailable] = useState(false)

    return (
        <aside className={`w-full ${announcementsAvailable ? 'h-[620px]': 'h-[425px]'} bg-white shadow-md rounded-lg p-4`}>
            <NavigationPanel />
            <AnnouncementsPanel setAnnouncementsAvailable={setAnnouncementsAvailable} />
        </aside>
    );
};

export default Sidebar;
