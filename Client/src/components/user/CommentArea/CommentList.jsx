import { useState } from "react";

export function CommentList({ comments, onReply }) {
    const [visibleChildren, setVisibleChildren] = useState({});

    console.log(comments)

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

    const renderComments = (comments) => {
        return comments.map((comment) => (
            <div key={comment.id} className="bg-gray-50 rounded-lg p-3">
                <div className="flex justify-between items-start mb-1">
                    <span className="font-medium text-sm">{comment.username || `User ${comment.user}`}</span>
                    <span className="text-xs text-gray-500">{formatDate(comment.created_at)}</span>
                </div>
                <p className="text-sm text-gray-700">{comment.content}</p>

                <button
                    onClick={() => onReply(comment.id)}
                    className="text-blue-500 text-xs mt-1"
                >
                    Reply
                </button>

                {comment.replies && comment.replies.length > 0 && (
                    <div className="ml-4 mt-2">
                        {comment.replies
                            .slice(0, visibleChildren[comment.id] ? comment.replies.length : 1)
                            .map((reply) => (
                                <div key={reply.id} className="bg-gray-100 p-2 rounded-lg mt-2">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="font-medium text-sm">{reply.username || `User ${reply.user}`}</span>
                                        <span className="text-xs text-gray-500">{formatDate(reply.created_at)}</span>

                                    </div>
                                    <p className="text-sm text-gray-700">{reply.content}</p>
                                </div>
                            ))}

                        {comment.replies.length > 1 && (
                            <button
                                onClick={() => toggleVisibility(comment.id)}
                                className="text-blue-500 text-sm mt-2"
                            >
                                {visibleChildren[comment.id] ? "Hide" : "Show more"}
                            </button>
                        )}
                    </div>
                )}
            </div>
        ));
    };

    const toggleVisibility = (parentId) => {
        setVisibleChildren((prevState) => ({
            ...prevState,
            [parentId]: !prevState[parentId],
        }));
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
