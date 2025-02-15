import React from 'react';
import { Send, ImagePlus, X } from 'lucide-react';

const MessageInput = (
    { message, setMessage, onSend, selectedFiles, setSelectedFiles,setSnackbarMessage, setSnackbarOpen }
) => {

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        const allowedTypes = ["image/jpeg", "image/png", "image/gif", "video/mp4", "video/webm", "video/ogg"];
        const maxSize = {
            image: 15 * 1024 * 1024, // 15MB
            video: 150 * 1024 * 1024  // 150MB
        };
    
        const newFiles = [];
    
        for (const file of files) {
            if (!allowedTypes.includes(file.type)) {
                setSnackbarMessage("Invalid file type. Only images and videos are allowed.");
                setSnackbarOpen(true);
                continue;
            }
    
            const fileType = file.type.startsWith("video") ? "video" : "image";
            
            // File size validation
            if (file.size > maxSize[fileType]) {
                setSnackbarMessage(`File too large. Max size: ${fileType === "image" ? "15MB" : "150MB"}.`);
                setSnackbarOpen(true);
                continue;
            }
    
            newFiles.push({ file, url: URL.createObjectURL(file), type: fileType });
        }
    
        setSelectedFiles((prevFiles) => [...prevFiles, ...newFiles]);
    };    

    const removeFile = (index) => {
        setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };

    const handleSend = async (e) => {
        e.preventDefault();
        
        if (!message.trim() && selectedFiles.length === 0) return;

        const fileData = selectedFiles.length > 0 ? await toBase64(selectedFiles[0].file) : null;
        onSend && onSend({ text: message.trim(), file: fileData });

        if (selectedFiles.length > 1) {
            const filePromises = selectedFiles.slice(1).map(async (file) => {
                const fileData = await toBase64(file.file);
                return { text: "", file: fileData };
            });

            const messages = await Promise.all(filePromises);
            messages.forEach((msg) => onSend && onSend(msg));
        }

        setMessage("");
        setSelectedFiles([]);
    };
    
    const toBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result.split(",")[1]);
            reader.onerror = (error) => reject(error);
        });
    };     

    return (
        <form onSubmit={handleSend} className="p-4 bg-white backdrop-blur-md border-t-2 border-gray-50 lg:rounded-br-lg">
            {selectedFiles.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-2">
                    {selectedFiles.map((file, index) => (
                        <div key={index} className="relative w-fit p-2 bg-gray-100 rounded-lg">
                            {file.type === "image" ? (
                                <img src={file.url} alt="Selected" className="w-20 h-20 rounded-md object-cover" />
                            ) : (
                                <video src={file.url} controls className="w-20 h-20 rounded-md object-cover" />
                            )}
                            <button
                                type="button"
                                className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                                onClick={() => removeFile(index)}
                            >
                                <X size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Message Input and Buttons */}
            <div className="flex items-center w-full gap-2">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 p-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all"
                />

                {/* File Upload */}
                <input type="file" accept="image/*,video/*" multiple hidden id="fileInput" onChange={handleFileChange} />
                <label
                    htmlFor="fileInput"
                    className="w-10 h-10 flex justify-center items-center rounded-full bg-gradient-to-r from-teal-500 to-purple-400 text-white cursor-pointer hover:shadow-lg hover:opacity-90 transition-all"
                >
                    <ImagePlus size={20} />
                </label>

                {/* Send Button */}
                <button
                    type="submit"
                    className="w-10 h-10 flex justify-center items-center rounded-full bg-gradient-to-r from-teal-500 to-purple-400 text-white cursor-pointer hover:shadow-lg hover:opacity-90 transition-all"
                >
                    <Send size={20} />
                </button>
            </div>
        </form>
    );
};

export default MessageInput;
