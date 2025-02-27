import React, { useEffect, useRef, useState } from "react";
import ImageUpload from "../../forms/ImageUpload";

const EditModal = ({ isOpen, onClose, onSave, announcement }) => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [image, setImage] = useState(null);

    const imageUploadRef = useRef(image);

    useEffect(() => {
        if (announcement) {
            setTitle(announcement.title || "");
            setContent(announcement.content || "");
            setImage(announcement.icon || null);
        }
    }, [announcement]);

    const handleSave = () => {
        onSave({ title, content, icon: image });
        onClose();
    };

    const handleImageChange = (file) => {
        if (file) {
            setImage(file);
        }
    };    

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-lg font-semibold mb-4 text-midnightNavy">Edit Announcement</h2>

                <div className="flex flex-col gap-3">
                    <label className="text-sm font-medium text-deepOceanBlue">Title</label>
                    <input 
                        type="text"
                        className="p-2 border rounded w-full text-midnightBlue"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        maxLength={25}
                    />

                    <label className="text-sm font-medium text-deepOceanBlue">Content</label>
                    <textarea
                        className="p-2 border rounded w-full text-midnightBlue resize-none h-24"
                        value={content}
                        maxLength={100}
                        onChange={(e) => setContent(e.target.value)}
                    />

                    <label className="text-sm font-medium text-deepOceanBlue">Icon</label>
                    {image && 
                        <ImageUpload onChange={handleImageChange} image={image} reset={(resetFn) => (imageUploadRef.current = resetFn)} />
                    }
                </div>

                <div className="flex justify-end gap-2 mt-4">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-deepOceanBlue rounded">Cancel</button>
                    <button onClick={handleSave} className="px-4 py-2 bg-deepOceanBlue text-white rounded">Save</button>
                </div>
            </div>
        </div>
    );
};

export default EditModal;
