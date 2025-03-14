import React, { useCallback, useEffect, useState } from "react";
import PawStoryCard from "./PawStoryCard";
import { AnimatePresence, motion } from "framer-motion";
import Lottie from "lottie-react";
import animation1 from "../../../assets/lottie/Animation - 1739179842981.json";
import { CommentArea } from "../CommentArea/CommentArea";
import AlertSnackbar from "../../Snackbar/AlertSnackbar";
import { fetchPawstory } from "../../../redux/thunks/PostThunk";
import { useDispatch } from "react-redux";

function HomePreview({ pawStories = [] }) {
    const [storyId, setStoryId] = useState(null);
    const [story, setStory] = useState(null);
    
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarAlertType, setSnackbarAlertType] = useState("error");

    const [isLoading, setIsLoading] = useState(false);
    const [showComment, setShowComment] = useState(false);

    const dispatch = useDispatch();

    const fetchData = useCallback((slug) => {
        setIsLoading(true);
        try {
            dispatch(fetchPawstory(slug));
        } catch (error) {
            setSnackbarMessage("Unable to fetch post");
            setSnackbarAlertType("error");
            setSnackbarOpen(true);
        } finally {
            setIsLoading(false);
        }
    }, [dispatch]);

    const handleCommentAreaClose = () => {
        setShowComment(false);
        setStory(null)
        if (story) {
            const slug = story.slug
            fetchData(slug);
        }
    };

    // Prevent scrolling when comment area is open
    useEffect(() => {
        if (showComment) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [showComment]);

    return (
        <div className={`relative overflow-hidden ${!isLoading && showComment ? "md:max-h-[76.9vh] lg:h-full rounded-lg" : ""}`}>
            <AlertSnackbar
                open={snackbarOpen}
                message={snackbarMessage}
                alert_type={snackbarAlertType}
                onClose={() => setSnackbarOpen(false)}
            />
    
            {/* Comment Area */}
            <AnimatePresence>
                {!isLoading && showComment && (
                    <motion.div
                        initial={{ y: "100%", opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: "100%", opacity: 0 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                            className="fixed lg:absolute top-40 lg:top-16 left-1 lg:left-0 right-1 lg:right-0 bg-white lg:shadow-lg z-50
                                        rounded-t-lg flex flex-col h-[calc(93vh-7rem)] lg:h-[calc(90.8vh-10rem)] mx-auto"
                        >
                        <CommentArea
                            onClose={handleCommentAreaClose} 
                            postId={storyId} 
                            post={story} 
                            className="h-full overflow-y-auto rounded-t-2xl lg:rounded-t-xl" 
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Grid System (Blur and Disable Interactions when CommentArea is Open) */}
            <div className={`md:grid md:grid-cols-2 px-2 md:px-0 md:gap-6 space-y-5 md:space-y-0 
                transition-all duration-300 ${!isLoading && showComment ? "blur-sm pointer-events-none" : ""}`}>
                {pawStories.length > 0 ? (
                    pawStories.map((story, index) => (
                        <motion.div 
                            key={story.id || index} 
                            initial={{ opacity: 0, y: 20 }} 
                            animate={{ opacity: 1, y: 0 }} 
                            transition={{ duration: 0.4 }}
                        >
                            <PawStoryCard story={story} setStory={setStory} setStoryId={setStoryId} setShowComment={setShowComment} />
                        </motion.div>
                    ))
                ) : (
                    <motion.div 
                        className="col-span-2 flex flex-col min-h-[34rem] items-center justify-center p-10"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Lottie animationData={animation1} className="w-60 h-60" loop />
                        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mt-5">
                            No stories yet! 🐶 Be the first to share an adorable moment.
                        </h2>
                    </motion.div>
                )}
            </div>
        </div>
    );    
}

export default HomePreview;
