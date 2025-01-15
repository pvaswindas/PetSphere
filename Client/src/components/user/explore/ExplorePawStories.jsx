import React, { useState, useEffect } from 'react'
import Shimmer from '../../Shimmer/Shimmer'
import { useSelector } from 'react-redux';
import { fetchPosts } from '../../../utils/exploreFetch';
import AlertSnackbar from '../../Snackbar/AlertSnackbar';

export function ExplorePawStories() {
    const [loading, setLoading] = useState(true);
    const [posts, setPosts] = useState([]);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    const query = useSelector((state) => state.globalSearch.search);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const data = await fetchPosts(query);
                setPosts(data);
            } catch (error) {
                setSnackbarMessage("Unable to fetch PawStories");
                setSnackbarOpen(true);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [query]);

    const handlePostClick = (slug) => {
        
    };

    return (
        <div className="grid gap-6">
            <AlertSnackbar
                open={snackbarOpen}
                message={snackbarMessage}
                alert_type="error"
                onClose={() => setSnackbarOpen(false)}
            />
            {loading ? (
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
            ) : posts.length === 0 ? (
                <div className="text-center text-gray-500">
                    No PawStories Found
                </div>
            ) : (
                <div className="grid grid-cols-4 gap-0.5">
                    {posts.slice().reverse().map((post, index) => (
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
    );
}

