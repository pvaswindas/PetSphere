export function ExplorePawStories({ posts }) {
    const handlePostClick = (slug) => {
    };


    return (
        <div className="grid gap-6">
            {posts.length === 0 ? (
                <div className="w-full h-64 flex items-center justify-center rounded-lg px-5">
                    <p className="text-gray-500">No posts yet</p>
                </div>
            ) : (
                <div className="grid grid-cols-3 gap-0.5 lg:gap-3">
                    {Array.isArray(posts) && posts.slice().reverse().map((post, index) => (
                        <div
                            key={index}
                            className="relative w-full aspect-square cursor-pointer"
                            onClick={() => handlePostClick(post.slug)}
                        >
                            <img
                                src={post.images[0].image}
                                alt={post.content}
                                className="w-full h-full lg:rounded-lg object-cover"
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
