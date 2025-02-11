import React from 'react';

function FeedSelection({ selectedFeed, setSelectedFeed }) {
    return (
        <div className="flex bg-white md:rounded-lg justify-between items-center font-medium shadow-md mb-4 overflow-hidden">
            <div 
                className="text-center flex flex-col items-center w-full relative py-2 hover:bg-gray-50 cursor-pointer"
                onClick={() => setSelectedFeed("Home")}
            >
                <h1>Home</h1>
                {selectedFeed === "Home" && (
                    <hr className="bg-og-gradient h-[7px] rounded-e-full md:rounded-full align-bottom w-full absolute bottom-0 left-0" />
                )}
            </div>
            <div
                className="text-center flex flex-col items-center w-full relative py-2 hover:bg-gray-50 cursor-pointer"
                onClick={() => setSelectedFeed("FindAFriend")}
            >
                <h1>FindAFriend</h1>
                {selectedFeed === "FindAFriend" && (
                    <hr className="bg-og-gradient h-[7px] rounded-s-full md:rounded-full align-bottom w-full absolute bottom-0 left-0" />
                )}
            </div>
        </div>
    );
}

export default FeedSelection;
