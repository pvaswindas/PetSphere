import { useState, useEffect, useCallback } from 'react';
import { CommentHeader } from './CommentHeader';
import { CommentList } from './CommentList';
import { CommentInput } from './CommentInput';
import axiosInstance from '../../../axios/axiosinstance';

export function CommentArea({ onClose, postId }) {
    const [newComment, setNewComment] = useState('');
    const [replyingTo, setReplyingTo] = useState(null);
    const [comments, setComments] = useState([]);

    const fetchComments = useCallback(async () => {
        if (!postId) {
            console.error("Post ID is undefined or invalid");
            return;
        }

        try {
            const response = await axiosInstance.get(`posts/comments/post/${postId}`);
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

            await axiosInstance.post('posts/comments/create/', payload);

            await fetchComments();

            setNewComment('');
            setReplyingTo(null);
        } catch (error) {
            console.error('Error submitting comment:', error);
        }
    };

    const handleReply = (commentId) => {
        setReplyingTo(commentId);
    };

    return (
        <div className="w-full flex flex-col bg-white rounded-e-lg">
            <CommentHeader onClose={onClose} />
            <CommentList comments={comments} onReply={handleReply} />
            <CommentInput
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onSubmit={handleSubmitComment}
                replyingTo={replyingTo}
            />
        </div>
    );
}
