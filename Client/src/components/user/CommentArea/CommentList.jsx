import { useState } from "react";

export function CommentList({ comments, onReply, onDelete }) {
    const [visibleChildren, setVisibleChildren] = useState({});

    function formatDate(dateString) {
        const date = new Date(dateString);

        const options = {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
        };

        const time = new Intl.DateTimeFormat('en-US', options).format(date);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();

        return `${time.replace(':', '.')} ${month}/${day}/${year}`;
    }

    const toggleVisibility = (parentId) => {
        setVisibleChildren((prevState) => ({
            ...prevState,
            [parentId]: !prevState[parentId],
        }));
    };

    const renderReplies = (replies, parentId) => {
        return (
            <div className="ml-4 mt-2">
                {replies
                    .slice(0, visibleChildren[parentId] ? replies.length : 1)
                    .map((reply) => (
                        <div key={reply.id} className="bg-gray-100 p-2 rounded-lg mt-2">
                            <div className="flex justify-between items-start mb-1">
                                <span className="font-medium text-sm">{reply.username || `User ${reply.user}`}</span>
                                <span className="text-xs text-gray-500">{formatDate(reply.created_at)}</span>
                            </div>
                            <p className="text-sm text-gray-700">{reply.content}</p>
                            <div className="flex items-center gap-2 mt-2">
                                <button
                                    onClick={() => onReply(reply.id, reply.username)}
                                    className="text-blue-500 text-xs"
                                >
                                    Reply
                                </button>
                                <button
                                    onClick={() => onDelete(reply.id)}
                                    className="text-red-500 text-xs flex items-center gap-1 mt-1"
                                >
                                    Delete
                                </button>
                            </div>

                            {reply.replies && reply.replies.length > 0 && renderReplies(reply.replies, reply.id)}
                        </div>
                    ))}

                {replies.length > 1 && (
                    <button
                        onClick={() => toggleVisibility(parentId)}
                        className="text-blue-500 text-sm mt-2"
                    >
                        {visibleChildren[parentId] ? "Hide" : "Show more"}
                    </button>
                )}
            </div>
        );
    };

    const renderComments = (comments) => {
        return comments.map((comment) => (
            <div key={comment.id} className="bg-gray-50 rounded-lg p-3">
                <div className="flex justify-between items-start mb-1">
                    <span className="font-medium text-sm">{comment.username || `User ${comment.user}`}</span>
                    <span className="text-xs text-gray-500">{formatDate(comment.created_at)}</span>
                </div>
                <p className="text-sm text-gray-700">{comment.content}</p>

                <div className="flex items-center gap-2 mt-2">
                    <button
                        onClick={() => onReply(comment.id, comment.username)}
                        className="text-blue-500 text-xs"
                    >
                        Reply
                    </button>
                    <button
                        onClick={() => onDelete(comment.id)}
                        className="text-red-500 text-xs flex items-center gap-1"
                    >
                        Delete
                    </button>
                </div>

                {comment.replies && comment.replies.length > 0 && renderReplies(comment.replies, comment.id)}
            </div>
        ));
    };

    return (
        <div className="flex-grow p-4 overflow-y-auto max-h-[400px] scrollbar-thin scrollbar-thumb-zinc-100 scrollbar-track-transparent">
            {comments.length === 0 ? (
                <p className="text-center text-gray-500">No comments yet. Be the first to comment!</p>
            ) : (
                <div className="space-y-4">{renderComments(comments)}</div>
            )}
        </div>
    );
}
