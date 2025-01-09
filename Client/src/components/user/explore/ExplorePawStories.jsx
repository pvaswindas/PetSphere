import React, { useState, useEffect } from 'react'
import Shimmer from '../../Shimmer/Shimmer'

export function ExplorePawStories({ posts }) {
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (posts.length > 0) {
            setLoading(false)
        }
    }, [posts])

    const handlePostClick = (slug) => {
        
    }

    return (
        <div className="grid gap-6">
            {loading || posts.length === 0 ? (
                <div className="grid grid-cols-4 gap-0.5">
                    {Array.from({ length: 12 }).map((_, index) => (
                        <div
                            key={index}
                            className="relative w-full aspect-square cursor-pointer lg:rounded-lg"
                        >
                            <Shimmer className="w-full h-full" />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-4 gap-0.5">
                    {Array.isArray(posts) && posts.slice().reverse().map((post, index) => (
                        <div
                            key={index}
                            className="relative w-full aspect-square cursor-pointer rounded-lg"
                            onClick={() => handlePostClick(post.slug)}
                        >
                            <img
                                src={post.images[0].image}
                                alt={post.content}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
