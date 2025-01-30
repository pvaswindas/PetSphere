import React from 'react'
import PawStoryCard from './PawStoryCard'

function HomePreview({ selectedFeed }) {
    return (
        <div className='lg:grid lg:grid-cols-2 lg:gap-3 space-y-5 lg:space-y-0'>
            <PawStoryCard />
            <PawStoryCard />
            <PawStoryCard />
            <PawStoryCard />
        </div>
    )
}

export default HomePreview