import React from "react";
import NavigationPanel from "./NavigationPanel";
import NewsFeedPanel from "./NewsFeedPanel";


const Sidebar = () => {

    return (
        <aside className="w-full h-[750px] bg-white shadow-md rounded-lg p-4">
            <NavigationPanel />
            <NewsFeedPanel />
        </aside>
    );
};

export default Sidebar;
