import React, { useState } from "react";
import TabUI from "../../headlessui/TabUi";
import SearchBar from "../Navbar/SearchBar";
import { ExplorePeopleList } from "./ExplorePeopleList";
import { ExplorePawStories } from "./ExplorePawStories";
import { ExplorePetListings } from "./ExplorePetListings";

export function ExploreComponent() {
    const [activeTab, setActiveTab] = useState("pawstories");

    const renderContent = () => {
        switch (activeTab) {
            case "people":
                return <ExplorePeopleList />;
            case "pawstories":
                return <ExplorePawStories />;
            case "petlistings":
                return <ExplorePetListings />;
            default:
                return null;
        }
    };

    const TabCategories = [
        { name: "PawStories", key: "pawstories" },
        { name: "PetListings", key: "petlistings" },
        { name: "People", key: "people" },
    ];

    return (
        <div className="w-full min-h-screen bg-white lg:rounded-lg lg:shadow-md overflow-hidden mb-1">
            <div className="lg:hidden p-2">
                <SearchBar addedStyles="w-full" />
            </div>
            <TabUI activeTab={activeTab} setActiveTab={setActiveTab} TabCategories={TabCategories} />
            <main className="container px-4 py-6">{renderContent()}</main>
        </div>
    );
}
