import { useState, useEffect, useCallback } from 'react';
import { CommentHeader } from './CommentHeader';
import { CommentList } from './CommentList';
import { CommentInput } from './CommentInput';
import axiosInstance from '../../../axios/axiosinstance';
import AlertSnackbar from '../../Snackbar/AlertSnackbar';

export function CommentArea({ onClose, postId }) {
    const [newComment, setNewComment] = useState('');
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyUsername, setReplyUsername] = useState('');
    const [comments, setComments] = useState([]);

    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarOpen, setSnackbarOpen] = useState(false);

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
            console.error('Error fetching comments:', error);
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
            console.error('Error submitting comment:', error);
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
            console.error('Error deleting comment:', error);
        }
    }

    return (
        <div className="w-full flex flex-col bg-white rounded-e-lg">
            <AlertSnackbar
                open={snackbarOpen}
                message={snackbarMessage}
                alert_type="error"
                onClose={() => setSnackbarOpen(false)}
            />
            <CommentHeader onClose={onClose} />
            <CommentList comments={comments} onReply={handleReply} onDelete={onDelete} onCommentLike={handleLikeComment} />
            <CommentInput
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onSubmit={handleSubmitComment}
                replyingTo={replyingTo}
                replyUsername={replyUsername}
                onCancelReply={handleCancelReply}
            />
        </div>
    );
}
