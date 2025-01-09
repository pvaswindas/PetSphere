import SearchBar from "../Navbar/SearchBar";

export function ExploreHeader() {

    return (
        <div className="lg:hidden sticky top-0 z-10 bg-white/95 backdrop-blur border-b">
            <div className="container flex items-center h-16 px-4">
                <div className="flex-1 px-4">
                    <div className="relative">
                        <SearchBar />
                    </div>
                </div>
            </div>
        </div>
    )
}
