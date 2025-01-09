import { useState, useEffect, useCallback } from 'react';
import { CommentHeader } from './CommentHeader';
import { CommentList } from './CommentList';
import { CommentInput } from './CommentInput';
import axiosInstance from '../../../axios/axiosinstance';

export function CommentArea({ onClose, postId }) {
    const [newComment, setNewComment] = useState('')
    const [replyingTo, setReplyingTo] = useState(null)
    const [replyUsername, setReplyUsername] = useState("")
    const [comments, setComments] = useState([]);

    const fetchComments = useCallback(async () => {
        if (!postId) {
            console.error("Post ID is undefined or invalid");
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
        } catch (error) {
            console.error('Error submitting comment:', error);
        }
    };

    const handleReply = (commentId, username) => {
        setReplyingTo(commentId);
        setReplyUsername(username)
    };

    const onDelete = async (comment_id) => {
        try {
            await axiosInstance.delete(`socials/comments/delete/${comment_id}/`);
            await fetchComments();
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };
    
    return (
        <div className="w-full flex flex-col bg-white rounded-e-lg">
            <CommentHeader onClose={onClose} />
            <CommentList comments={comments} onReply={handleReply} onDelete={onDelete} />
            <CommentInput
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onSubmit={handleSubmitComment}
                replyingTo={replyingTo}
                replyUsername={replyUsername}
            />
        </div>
    );
}
