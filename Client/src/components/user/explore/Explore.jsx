import { useEffect, useState, useCallback } from "react";
import { ExplorePeopleList } from "./ExplorePeopleList";
import { ExplorePawStories } from "./ExplorePawStories";
import { ExplorePetListings } from "./ExplorePetListings";
import { ExploreHeader } from "./ExploreHeader";
import axiosInstance from "../../../axios/axiosinstance";
import TabUI from "../../headlessui/TabUi";
import { useSelector } from "react-redux";
import SearchBar from "../Navbar/SearchBar";

export function ExploreComponent() {
    const [activeTab, setActiveTab] = useState("pawstories")
    const [posts, setPosts] = useState([])
    const [petListings, setPetListings] = useState([])
    const [people, setPeople] = useState([])
    const search = useSelector((state) => state.globalSearch.search)
    const query = search
    

    const fetchPosts = useCallback(async (query) => {
        try {
            let url = 'posts/posts-list/';
            if (query) {
                url += `?search=${query}`;
            }
            const response = await axiosInstance.get(url);
            const data = await response.data
            setPosts(data)
        } catch (error) {

        }
    }, []);

    const fetchPetListings = useCallback(async (query) => {
        try {
            let url = 'posts/petlistings-list/'
            if (query) {
                url += `?search=${query}`
            }
            const response = await axiosInstance.get(url);
            const data = await response.data
            setPetListings(data)
        } catch (error) {

        }
    }, [] )

    const fetchPeople = useCallback(async (query) => {
        try {
            let url = 'user/people-list/'
            if (query) {
                url += `?search=${query}`
            }
            const response = await axiosInstance.get(url)
            const data = await response.data
            setPeople(data)
        } catch (error) {
            
        }
    }, [])

    useEffect(() => {
        if (activeTab === "pawstories") {
            fetchPosts(query);
        } else if (activeTab === "petlistings") {
            fetchPetListings(query);
        } else if (activeTab === "people") {
            fetchPeople(query)
        }
    }, [activeTab, query, fetchPosts, fetchPetListings, fetchPeople])

    const renderContent = () => {
        switch (activeTab) {
        case "people":
            return <ExplorePeopleList people={people} />;
        case "pawstories":
            return <ExplorePawStories posts={posts} />;
        case "petlistings":
            return <ExplorePetListings petListings={petListings} />;
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
            <main className="container px-4 py-6">
                {renderContent()}
            </main>
        </div>
    );
}
