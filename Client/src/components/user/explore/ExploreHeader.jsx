import { Search } from "lucide-react";
import { useState } from "react";

export function ExploreHeader({ fetchPosts, fetchPetListings }) {
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        fetchPosts(e.target.value)
        fetchPetListings(e.target.value)
    };

    return (
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b">
            <div className="container flex items-center h-16 px-4">
                <h1 className="text-2xl font-bold">Explore</h1>
                <div className="flex-1 px-4">
                    <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className="pl-8 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
