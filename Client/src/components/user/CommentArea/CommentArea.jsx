import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CommentHeader } from './CommentHeader';
import { CommentList } from './CommentList';
import { CommentInput } from './CommentInput';
import axiosInstance from '../../../axios/axiosinstance';
import AlertSnackbar from '../../Snackbar/AlertSnackbar';

export function CommentArea({ onClose, postId, post, className="" }) {
    const [newComment, setNewComment] = useState('');
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyUsername, setReplyUsername] = useState('');
    const [comments, setComments] = useState([]);
    const [isMobile, setIsMobile] = useState(false);

    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    // Check if screen is mobile
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024); // 1024px is the lg breakpoint in Tailwind
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        
        return () => {
            window.removeEventListener('resize', checkMobile);
        };
    }, []);

    const fetchComments = useCallback(async () => {
        if (!postId) {
            setSnackbarMessage("Error fetching comments")
            setSnackbarOpen(true)
            return;
        }

        try {
            const response = await axiosInstance.get(`socials/comments/post/${postId}`);
            setComments(response.data);
        } catch (error) {
            return
        }
    }, [postId]);

    useEffect(() => {
        fetchComments();
    }, [postId, fetchComments]);

    const handleSubmitComment = async () => {
        if (!newComment.trim()) return;

        try {
            const payload = {
                content: newComment,
                parent: replyingTo || null,
                post: postId,
            };

            await axiosInstance.post('socials/comments/create/', payload);

            await fetchComments();

            setNewComment('');
            setReplyingTo(null);
            setReplyUsername('');
        } catch (error) {
            return
        }
    };

    const handleReply = (commentId, username) => {
        setReplyingTo(commentId);
        setReplyUsername(username);
    };

    const handleCancelReply = () => {
        setReplyingTo(null);
        setReplyUsername('');
    };

    const handleLikeComment = async (commentId) => {
        try {
            await axiosInstance.post(`socials/comments/like/${commentId}/`);
            await fetchComments()
        } catch (error) {
            setSnackbarMessage("Unable to process your request")
            setSnackbarOpen(true)
        }
    }

    const onDelete = async (comment_id) => {
        try {
            await axiosInstance.delete(`socials/comments/delete/${comment_id}/`);
            await fetchComments();
        } catch (error) {
            return
        }
    }

    const mobileVariants = {
        hidden: { y: "100%", opacity: 0 },
        visible: { 
            y: "0%", 
            opacity: 1,
            transition: { 
                type: "spring", 
                damping: 20,
                stiffness: 250,
                mass: 0.6,
                restDelta: 0.005,
                restSpeed: 0.005,
                velocity: 2
            }
        },
        exit: { 
            y: "100%", 
            opacity: 0,
            transition: { 
                type: "tween",
                duration: 0.25,
                ease: "easeInOut"
            }
        }
    };

    const desktopVariants = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1,
            transition: { duration: 0.2 }
        },
        exit: { 
            opacity: 0,
            transition: { duration: 0.2 }
        }
    };

    return (
        <AnimatePresence mode="wait">
            <motion.div 
                className={`
                    ${isMobile ? 'fixed inset-x-0 bottom-0 z-50 rounded-t-xl shadow-lg' : 'w-full rounded-e-lg'}
                    flex flex-col bg-white
                    ${isMobile ? 'h-[70vh]' : ''}
                    ${className}
                `}
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={isMobile ? mobileVariants : desktopVariants}
                key="comment-area"
            >
                <AlertSnackbar
                    open={snackbarOpen}
                    message={snackbarMessage}
                    alert_type="error"
                    onClose={() => setSnackbarOpen(false)}
                />
                
                {/* Add a slight drag for mobile for intuitive closing */}
                {isMobile && (
                    <div className="w-full flex justify-center pt-2 pb-1">
                        <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
                    </div>
                )}
                
                <CommentHeader onClose={onClose} />
                <div className="flex-grow overflow-y-auto">
                    <CommentList 
                        comments={comments} 
                        onReply={handleReply} 
                        onDelete={onDelete} 
                        onCommentLike={handleLikeComment} 
                    />
                </div>
                <CommentInput
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onSubmit={handleSubmitComment}
                    replyingTo={replyingTo}
                    replyUsername={replyUsername}
                    onCancelReply={handleCancelReply}
                    post={post}
                />
            </motion.div>
        </AnimatePresence>
    );
}