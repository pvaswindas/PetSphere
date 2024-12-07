import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { ImageCropper } from "../../../utils/ImageCropper";
import { ReactComponent as IconSquare } from "../../../assets/icon/aspect-ratio/square.svg";
import { ReactComponent as IconStandard } from "../../../assets/icon/aspect-ratio/standard.svg";
import { ReactComponent as IconPortrait } from "../../../assets/icon/aspect-ratio/portrait.svg";
import axiosInstance from "../../../axios/axiosinstance";

const aspectRatios = [
    { label: "Square", value: 1, Icon: IconSquare },
    { label: "Standard", value: 4 / 3, Icon: IconStandard },
    { label: "Portrait", value: 3 / 2, Icon: IconPortrait },
];

const AddPetStoryCard = () => {
    const [content, setContent] = useState("")
    const [images, setImages] = useState([])
    const [cropData, setCropData] = useState(null)
    const [selectedAspect, setSelectedAspect] = useState(1)
    const [originalFileType, setOriginalFileType] = useState(null)
    const [cropSettings, setCropSettings] = useState({
        image: null,
        crop: { x: 0, y: 0 },
        zoom: 1,
        aspect: 1,
    })

    const handleContentChange = (e) => setContent(e.target.value);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setCropSettings((prev) => ({ ...prev, image: imageUrl }));
            setOriginalFileType(file.type);
        }
    };

    const handleAspectChange = (aspect) => {
        setSelectedAspect(aspect);
        setCropSettings((prev) => ({ ...prev, aspect }));
    };

    const handleCropComplete = useCallback(async (croppedArea, croppedAreaPixels) => {
        const croppedImage = await ImageCropper(cropSettings.image, croppedAreaPixels);
        setCropData(croppedImage);
    }, [cropSettings.image]);
    
    const handleSaveCroppedImage = () => {
        if (cropData) {
            const fileExtension = originalFileType.split("/")[1];
            const fileName = `${Date.now()}.${fileExtension}`;

            const file = new File([cropData], fileName, { type: originalFileType });
            setImages((prevImages) => [...prevImages, file]);
            setCropSettings({ image: null, crop: { x: 0, y: 0 }, zoom: 1, aspect: 1 });
            setCropData(null);
        }
    };

    const handleCancelCrop = () => {
        setCropSettings({ image: null, crop: { x: 0, y: 0 }, zoom: 1, aspect: 1 });
        setCropData(null);
    };

    const handleRemoveImage = (index) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("content", content);

        images.forEach((image, index) => {
            formData.append("images", image, image.name);
        });

        try {
            const response = await axiosInstance.post("posts/", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            console.log("Response:", response);
        } catch (error) {
            console.error("Error uploading data:", error);
        }

        setContent("");
        setImages([]);
    };

    const renderAspectButtons = () => {
        return aspectRatios.map(({ label, value, Icon }) => (
            <button
                key={value}
                type="button"
                onClick={() => handleAspectChange(value)}
                className={`flex flex-col items-center p-2 rounded-lg ${
                    selectedAspect === value
                        ? "bg-blue-100 border-blue-500"
                        : "hover:bg-gray-100 border-gray-300"
                } transition`}
                title={label}
            >
                <Icon
                    className={`w-8 h-8 ${
                        selectedAspect === value ? "text-blue-500" : "text-gray-400"
                    }`}
                />
                <span className="text-xs mt-1">{label}</span>
            </button>
        ));
    };

    const renderSelectedImages = () => {
        return images.length > 0 && (
            <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-600">Selected Images</h3>
                <div className="flex flex-wrap space-x-4 mt-2">
                    {images.map((image, index) => (
                        <div key={index} className="relative group">
                            <img
                                src={URL.createObjectURL(image)}
                                alt={`selected-img-${index}`}
                                className="w-24 h-24 object-cover rounded-md border border-gray-300"
                            />
                            <button
                                type="button"
                                onClick={() => handleRemoveImage(index)}
                                className="absolute top-2 right-2 w-5 h-5 p-1 bg-gray-500 text-white rounded-full flex items-center justify-center opacity-100"
                            >
                                &times;
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-lg mx-auto">
            <h1 className="text-2xl font-semibold text-gray-800 mb-6">Add Pet Story</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="content" className="block text-sm font-medium mt-2 text-gray-600">
                        Post Content
                    </label>
                    <textarea
                        id="content"
                        value={content}
                        onChange={handleContentChange}
                        placeholder="Write your pet story"
                        rows="5"
                        className="w-full px-4 py-5 rounded-lg text-gray-500 focus:outline-none resize-none"
                    />
                </div>
                <hr />

                {renderSelectedImages()}

                {cropSettings.image && (
                    <div>
                        <div className="relative w-full h-64 mb-4">
                            <Cropper
                                image={cropSettings.image}
                                crop={cropSettings.crop}
                                zoom={cropSettings.zoom}
                                aspect={cropSettings.aspect}
                                onCropChange={(crop) =>
                                    setCropSettings((prev) => ({ ...prev, crop }))
                                }
                                onCropComplete={handleCropComplete}
                                onZoomChange={(zoom) =>
                                    setCropSettings((prev) => ({ ...prev, zoom }))
                                }
                            />
                        </div>

                        <div className="flex justify-center text-dimGray space-x-4">
                            {renderAspectButtons()}
                        </div>

                        <div className="flex justify-center space-x-4 mt-4">
                            <button
                                type="button"
                                onClick={handleSaveCroppedImage}
                                className="px-4 py-2 bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-lg hover:bg-gradient-to-l transition"
                            >
                                <span className="font-semibold">Save</span>
                            </button>
                            <button
                                type="button"
                                onClick={handleCancelCrop}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                            >
                                <span className="font-semibold">Cancel</span>
                            </button>
                        </div>
                    </div>
                )}

                <div className="flex items-center space-x-2">
                    <label
                        htmlFor="image-upload"
                        className="cursor-pointer px-4 py-2 bg-gray-300 text-white rounded-lg flex items-center space-x-2 hover:bg-gray-400 transition"
                    >
                        Add Image
                    </label>
                    <input
                        type="file"
                        id="image-upload"
                        onChange={handleImageChange}
                        className="hidden"
                    />
                </div>

                <div>
                    <button
                        type="submit"
                        disabled={images.length < 1}
                        className="w-full py-2 bg-og-gradient text-white rounded-lg hover:bg-og-gradient-dark transition"
                    >
                        Post Your Story
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddPetStoryCard;
