import React, { useEffect, useState } from 'react'
import { MoreVertical, Send, MessageSquareText, Heart } from 'lucide-react'
import userAvatar from "../../../assets/icon/user-avatar.svg"
import { formatTime } from '../../../utils/formatTime';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../axios/axiosinstance';
import AlertSnackbar from '../../Snackbar/AlertSnackbar';
import { motion } from "framer-motion";

function PawStoryCard({ story = [], setStory, setStoryId, setShowComment }) {

    const navigate = useNavigate()

    const [snackbarMessage, setSnackbarMessage] = useState("")
    const [snackbarOpen, setSnackbarOpen] = useState(false)
    const [snackbarAlertType, setSnackbarAlertType] = useState("error")

    const [isLiked, setIsLiked] = useState(false)

    const handleOpenCommentBox = () => {
        setStoryId(story.id)
        setStory(story)
        setShowComment(true)
    }

    useEffect(() => {
        setIsLiked(story.liked)
    }, [story])

    const handleLike = async () => {
        const post_id = story.id
        try {
            const likePostResponse = await axiosInstance.post('socials/likepost/', { post_id })
            if (likePostResponse.status === 201) {
                setIsLiked(true)
            } else if (likePostResponse.status === 200) {
                setIsLiked(false)
            } else {
                setSnackbarMessage("Something went wrong. Try again.")
                setSnackbarAlertType("error")
                setSnackbarOpen(true)
            }
            setIsLiked(!isLiked)
        } catch (error) {
            setSnackbarMessage("Something went wrong. Try again.")
            setSnackbarAlertType("error")
            setSnackbarOpen(true)
        }
    }

    const handleCopyLink = () => {
        const postUrl = `${window.location.origin}/post/${story?.slug}`;
        navigator.clipboard.writeText(postUrl)
        .then(() => {
            setSnackbarMessage("Post link copied to clipboard!");
            setSnackbarAlertType("success");
            setSnackbarOpen(true);
        })
        .catch(() => {
            setSnackbarMessage("Failed to copy the link. Try again.");
            setSnackbarAlertType("error");
            setSnackbarOpen(true);
        });
    }

    return (
        <div className='relative bg-white rounded-2xl h-[29rem] shadow-lg overflow-hidden'>
            <AlertSnackbar
                open={snackbarOpen}
                message={snackbarMessage}
                alert_type={snackbarAlertType}
                onClose={() => setSnackbarOpen(false)}
            />
            <img
                src={story?.images[0].image}
                alt={story?.content ? story?.content : "pawstory"}
                onClick={() => navigate(`/post/${story?.slug}`)}
                className='w-full h-full object-cover rounded-2xl transition-all cursor-pointer duration-500 ease-in-out'
            />
            
            {/* Gradient Overlay */}
            <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b rounded-t-2xl from-black/10 to-transparent transition-all duration-500 ease-in-out hover:from-black/0 hover:bg-black/5">
                <div className='px-1 flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                        <div className='relative'>
                            <img 
                                src={story?.user_profile.profile_picture || userAvatar}
                                alt="User Avatar" 
                                className='w-11 h-11 rounded-full object-cover ring-2 ring-teal-400' 
                            />
                        </div>
                        <div>
                            <h2
                                className='text-md text-white font-semibold drop-shadow-md cursor-pointer'
                                onClick={() => navigate(`/profile/${story?.user_profile.user.username}`)}
                            >
                                {story?.user_profile.user.username}
                            </h2>
                            <p className='text-[0.7rem] text-white/80 drop-shadow-md'>
                                {story && formatTime(story.created_at)}
                            </p>
                        </div>
                    </div>
                    <MoreVertical size={20} color='white' className='drop-shadow-md' />
                </div>
            </div>

            {/* Floating Action Buttons */}
            <div className='absolute bottom-3 right-3'>
                <div className='flex flex-col gap-4'>
                    <button
                        className='flex justify-center items-center w-10 h-10 hover:bg-black/20 text-white/60
                        hover:text-white bg-gradient-to-br from-black/40 to-transparent rounded-full'
                        onClick={handleLike}
                    >
                        <motion.div
                            animate={{ scale: isLiked ? [1, 1.4, 1] : [1, 0.8, 1] }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                        >
                            {isLiked ? (
                                <Heart size={19} fill='#ff6347' stroke='#ff6347' />
                            ) : (
                                <Heart size={17} />
                            )}
                        </motion.div>
                    </button>
                    <button
                        className='flex justify-center items-center w-10 h-10 hover:bg-black/20 text-white/60 hover:text-white 
                        bg-gradient-to-br from-black/40 to-transparent rounded-full'
                        onClick={() => handleOpenCommentBox()}
                    >
                        <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                        >
                            <MessageSquareText size={17} />
                        </motion.div>
                    </button>
                    <button
                        className='flex justify-center items-center w-10 h-10 hover:bg-black/20 text-white/60
                        hover:text-white bg-gradient-to-br from-black/40 to-transparent rounded-full'
                        onClick={() => handleCopyLink()}
                    >
                        <Send size={17} />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default PawStoryCard;
