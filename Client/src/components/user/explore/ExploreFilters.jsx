export function ExploreFilters({ activeTab, onTabChange }) {
    return (
        <div className="container px-4 py-4 flex flex-col gap-4">
            <div className="flex gap-2">
                <button
                    className={`px-4 py-2 rounded-lg ${
                        activeTab === "pawstories" ? "bg-indigo-500 text-white" : "bg-white border border-gray-300"
                    }`}
                    onClick={() => onTabChange("pawstories")}
                >
                    PawStories
                </button>
                <button
                    className={`px-4 py-2 rounded-lg ${
                        activeTab === "petlistings" ? "bg-indigo-500 text-white" : "bg-white border border-gray-300"
                    }`}
                    onClick={() => onTabChange("petlistings")}
                >
                    Pet Listings
                </button>
                <button
                    className={`px-4 py-2 rounded-lg ${
                        activeTab === "people" ? "bg-indigo-500 text-white" : "bg-white border border-gray-300"
                    }`}
                    onClick={() => onTabChange("friends")}
                >
                    People
                </button>
            </div>

            {/* {activeTab === "petlistings" && (
                <div className="flex gap-4">
                    <select className="w-44 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none">
                        <option value="" disabled selected>
                            Location
                        </option>
                        <option value="nearby">Nearby</option>
                        <option value="5km">Within 5km</option>
                        <option value="10km">Within 10km</option>
                        <option value="20km">Within 20km</option>
                    </select>
                    <select className="w-44 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none">
                        <option value="" disabled selected>
                            Pet Type
                        </option>
                        <option value="dog">Dogs</option>
                        <option value="cat">Cats</option>
                        <option value="bird">Birds</option>
                        <option value="other">Other</option>
                    </select>
                    <select className="w-44 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none">
                        <option value="" disabled selected>
                            Age
                        </option>
                        <option value="puppy">Puppy/Kitten</option>
                        <option value="young">Young</option>
                        <option value="adult">Adult</option>
                        <option value="senior">Senior</option>
                    </select>
                </div>
            )} */}
        </div>
    );
}
