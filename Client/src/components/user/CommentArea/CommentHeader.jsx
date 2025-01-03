import { X } from 'lucide-react';

export function CommentHeader({ onClose }) {
    return (
        <div className="flex items-center justify-between p-4 border-b">
            <h3 className="font-semibold text-lg">Comments</h3>
            <button
                onClick={onClose}
                className="hover:bg-gray-100 rounded-full p-2"
            >
                <X className="h-5 w-5" />
            </button>
        </div>
    );
}
