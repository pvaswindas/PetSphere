import React from 'react'
import PawStoryCard from './PawStoryCard'

function HomePreview({ pawStories = [] }) {
    return (
        <div className="lg:grid lg:grid-cols-2 lg:gap-3 space-y-5 lg:space-y-0">
            {pawStories.length > 0 ? (
                pawStories.map((story, index) => (
                    <PawStoryCard key={story.id || index} story={story} />
                ))
            ) : (
                <div className="col-span-2 text-center text-gray-500 py-10">
                    No stories available
                </div>
            )}
        </div>
    );
}

export default HomePreview;
