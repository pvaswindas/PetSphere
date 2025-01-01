import { Send } from 'lucide-react';

export function CommentInput({ value, onChange, onSubmit, replyingTo }) {
    return (
        <div className="p-4 border-t bg-gray-50">
            {replyingTo && (
                <p className="text-xs text-gray-500 mb-2">
                    Replying to comment ID: {replyingTo}
                </p>
            )}
            <div className="flex gap-2">
                <textarea
                    value={value}
                    onChange={onChange}
                    placeholder="Write a comment..."
                    className="max-h-[50px] lg:min-h-[80px] resize-none p-2 border rounded-lg w-full focus:outline-none"
                />
                <button
                    onClick={onSubmit}
                    className="self-end p-2 bg-og-gradient text-white rounded-lg disabled:bg-gray-300"
                    disabled={!value.trim()}
                >
                    <Send className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}

