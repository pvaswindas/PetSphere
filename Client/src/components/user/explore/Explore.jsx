import { useEffect, useState, useCallback } from "react";
import { ExplorePeopleList } from "./ExplorePeopleList";
import { ExplorePawStories } from "./ExplorePawStories";
import { ExplorePetListings } from "./ExplorePetListings";
import { ExploreHeader } from "./ExploreHeader";
import { ExploreFilters } from "./ExploreFilters";
import axiosInstance from "../../../axios/axiosinstance";

export function ExploreComponent() {
    const [activeTab, setActiveTab] = useState("pawstories")
    const [posts, setPosts] = useState([])
    const [petListings, setPetListings] = useState([])

    const fetchPosts = useCallback(async (query = "") => {
        try {
            let url = 'posts/posts-list/';
            if (query) {
                url += `?search=${query}`;
            }
            const response = await axiosInstance.get(url);
            const data = await response.data;
            setPosts(data);
        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    }, []);

    const fetchPetListings = useCallback(async (query = "") => {
        try {
            let url = 'posts/petlistings-list/';
            if (query) {
                url += `?search=${query}`;
            }
            const response = await axiosInstance.get(url);
            const data = await response.data;
            setPetListings(data);
        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    }, []);

    useEffect(() => {
        fetchPosts()
        fetchPetListings()
    }, [fetchPosts, fetchPetListings]);

    const renderContent = () => {
        switch (activeTab) {
        case "people":
            return <ExplorePeopleList />;
        case "pawstories":
            return <ExplorePawStories posts={posts} />;
        case "petlistings":
            return <ExplorePetListings petListings={petListings} />;
        default:
            return null;
        }
    };

    return (
        <div className="w-full min-h-screen bg-white lg:rounded-lg lg:shadow-md overflow-hidden mb-1">
            <ExploreHeader fetchPosts={fetchPosts} fetchPetListings={fetchPetListings} />
            <ExploreFilters activeTab={activeTab} onTabChange={setActiveTab} />
            <main className="container px-4 py-6">
                {renderContent()}
            </main>
        </div>
    );
}
