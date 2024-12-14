import React, { memo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPawstories } from "../../../../redux/thunks/PostThunk";
import { useNavigate } from "react-router-dom";

const PawStories = memo(() => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const posts = useSelector((state) => state.posts?.pawstories || []);

    useEffect(() => {
        dispatch(fetchPawstories());
    }, [dispatch]);

    const handlePostClick = (slug) => {
        navigate(`/post/${slug}`);
    };

    return (
        <div className="lg:mx-4">
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
});


export default PawStories