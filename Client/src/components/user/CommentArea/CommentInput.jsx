import { Send, Smile, X } from 'lucide-react';
import { useState } from 'react';
import EmojiPicker from 'emoji-picker-react';

export function CommentInput({ value, onChange, onSubmit, replyingTo, replyUsername, onCancelReply }) {
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const handleEmojiClick = (emojiObject) => {
        onChange({ target: { value: value + emojiObject.emoji } });
        setShowEmojiPicker(false);
    };

    const handleClearInput = () => {
        onChange({ target: { value: '' } });
    };

    return (
        <div className="p-4 border-t bg-white relative">
            {replyingTo && (
                <div className="flex items-center justify-between mb-2 text-xs text-gray-500">
                    <p>Replying to @{replyUsername}</p>
                    <button
                        onClick={onCancelReply}
                        className="text-red-500 hover:underline"
                    >
                        Cancel
                    </button>
                </div>
            )}
            <div className="flex gap-2 items-center relative">
                {/* Textarea for input */}
                <textarea
                    value={value}
                    onChange={onChange}
                    placeholder="Write a comment..."
                    className="max-h-[50px] lg:min-h-[80px] resize-none p-2 border rounded-lg w-full focus:outline-none"
                />
                {/* Clear Input Button */}
                {value.trim() && (
                    <button
                        type="button"
                        onClick={handleClearInput}
                        className="absolute right-[47px] top-[10px] bg-gray-200 p-1 rounded-full"
                    >
                        <X className="h-3 w-3 text-gray-500" />
                    </button>
                )}
                {/* Emoji Picker Button */}
                <button
                    type="button"
                    className="self-end p-2 bg-gray-200 rounded-lg"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                >
                    <Smile className="h-4 w-4 text-gray-500" />
                </button>
                {/* Submit Button */}
                <button
                    onClick={onSubmit}
                    className="self-end p-2 bg-og-gradient text-white rounded-lg disabled:bg-gray-300"
                    disabled={!value.trim()}
                >
                    <Send className="h-4 w-4" />
                </button>
            </div>
            {/* Emoji Picker */}
            {showEmojiPicker && (
                <div className="absolute bottom-5 left-4 z-10">
                    <EmojiPicker
                        onEmojiClick={handleEmojiClick}
                        theme="light"
                    />
                </div>
            )}
        </div>
    );
}
