import React from 'react';
import { PawPrint } from 'lucide-react';

function BlankChatArea() {
    return (
        <div className="flex-1 flex flex-col lg:rounded-e-lg h-full bg-gradient-to-tr items-center lg:shadow-md from-teal-50 to-amber-100">
            {/* Main empty state */}
            <div className="flex-1 flex flex-col items-center justify-center p-8">
                <div className="max-w-md w-full text-center">
                    {/* Decorative Icons */}
                    <div className="relative mb-8">
                        <div className="absolute -left-6 top-2 text-yellow-500 animate-bounce">
                            <PawPrint size={32} />
                        </div>
                        <div className="absolute right-4 top-10 text-orange-500 animate-spin-slow">
                            <PawPrint size={32} />
                        </div>
                        <div className="absolute left-10 bottom-2 text-red-500 animate-wiggle">
                            <PawPrint size={32} />
                        </div>
                    </div>
                    
                    {/* Text Section */}
                    <h2 className="text-3xl font-bold text-[#D97706] mb-4">
                        No Chat Selected
                    </h2>
                    <p className="text-gray-700 mb-6">
                        Please select a conversation from the sidebar to start chatting.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default BlankChatArea;
