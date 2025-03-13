import React, { useState, useCallback } from "react"
import Cropper from "react-easy-crop"
import { ImageCropper } from "../../../utils/ImageCropper"
import axiosInstance from "../../../axios/axiosinstance"
import { useNavigate } from "react-router-dom"
import AlertSnackbar from "../../Snackbar/AlertSnackbar"
import { convertToBase64 } from "../../../utils/convertToBase64"

const AddPetStoryCard = () => {
    const [content, setContent] = useState("")
    const [images, setImages] = useState([])
    const [cropData, setCropData] = useState(null)
    const [originalFileType, setOriginalFileType] = useState(null)
    const [isCropping, setIsCropping] = useState(false)
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false)
    const [cropSettings, setCropSettings] = useState({
        image: null,
        crop: { x: 0, y: 0 },
        zoom: 1,
        aspect: 1,
    })
    const navigate = useNavigate()

    const handleContentChange = (e) => setContent(e.target.value)

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const validFormats = ["image/jpeg", "image/png"];
            if (!validFormats.includes(file.type)) {
                setSnackbarMessage("Please select an image in JPEG or PNG format");
                setSnackbarOpen(true);
                return;
            }
            const imageUrl = URL.createObjectURL(file);
            setCropSettings((prev) => ({ ...prev, image: imageUrl }));
            setOriginalFileType(file.type);
            setIsCropping(true);
        }
    };


    const handleCropComplete = useCallback(async (croppedArea, croppedAreaPixels) => {
        const croppedImage = await ImageCropper(cropSettings.image, croppedAreaPixels)
        setCropData(croppedImage)
    }, [cropSettings.image])

    const handleSaveCroppedImage = () => {
        if (cropData) {
            const fileExtension = originalFileType.split("/")[1]
            const fileName = `${Date.now()}.${fileExtension}`

            const file = new File([cropData], fileName, { type: originalFileType })
            setImages((prevImages) => [...prevImages, file])
            setCropSettings({ image: null, crop: { x: 0, y: 0 }, zoom: 1, aspect: 1 })
            setCropData(null)
            setIsCropping(false)
        }
    }

    const handleCancelCrop = () => {
        setCropSettings({ image: null, crop: { x: 0, y: 0 }, zoom: 1, aspect: 1 })
        setCropData(null)
        setIsCropping(false)
    }

    const handleRemoveImage = (index) => {
        setImages(images.filter((_, i) => i !== index))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        const formData = new FormData()
        formData.append("content", content)

        images.forEach((image, index) => {
            formData.append("images", image)
        })
        
        setIsLoading(true)
        try {
            await axiosInstance.post("posts/", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            })
            
            setContent("")
            setImages([])
            navigate('/feed')
        } catch (error) {
            setSnackbarMessage("There was a problem processing your images. Please try different files.")
            setSnackbarOpen(true)
            return
        } finally {
            setIsLoading(false)
        }
    }

    const renderSelectedImages = () => {
        return images.length > 0 && (
            <div className="mt-4">
                <AlertSnackbar
                    open={snackbarOpen}
                    message={snackbarMessage}
                    alert_type="error"
                    onClose={() => setSnackbarOpen(false)}
                />
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
        )
    }

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

                <div className="flex items-center space-x-2">
                    {/* Image Upload */}
                    <div className="space-y-6 w-full">
                        <h3 className="text-xl font-bold text-gray-800">Upload Pet Images</h3>

                        {!isCropping ? (
                            <div className="flex flex-col items-center justify-center w-full p-6 border-2 border-dashed rounded-lg border-gray-300 bg-gray-50 hover:bg-gray-100 transition duration-200">
                                <input
                                    name="upload-pet-image"
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageChange}
                                    id="upload-pet-image"
                                    className="hidden"
                                />
                                <label
                                    htmlFor="upload-pet-image"
                                    className="flex flex-col items-center justify-center cursor-pointer"
                                >
                                    <svg
                                        className="w-10 h-10 text-blue-500"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M12 4v16m8-8H4"
                                        ></path>
                                    </svg>
                                    <p className="text-sm text-gray-600 mt-2">
                                        <span className="text-blue-600 font-medium hover:underline">
                                            Click to upload
                                        </span>
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">Supported formats: JPG, PNG</p>
                                </label>
                            </div>
                        ) : (
                            <div className="relative w-full h-80">
                                <Cropper
                                    image={cropSettings.image}
                                    crop={cropSettings.crop}
                                    zoom={cropSettings.zoom}
                                    aspect={cropSettings.aspect}
                                    onCropChange={(crop) => setCropSettings((prev) => ({ ...prev, crop }))}
                                    onZoomChange={(zoom) => setCropSettings((prev) => ({ ...prev, zoom }))}
                                    onCropComplete={handleCropComplete}
                                />
                                <div className="absolute bottom-4 left-4 space-x-4">
                                    <button
                                        type="button"
                                        onClick={handleCancelCrop}
                                        className="bg-gray-500 text-white py-2 px-4 rounded-md"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleSaveCroppedImage}
                                        className="bg-blue-500 text-white py-2 px-4 rounded-md"
                                    >
                                        Save Crop
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {renderSelectedImages()}
                        </div>
                    </div>
                </div>

                <div>
                    <button
                        type="submit"
                        disabled={images.length < 1 || isLoading}
                        className="w-full flex items-center justify-center py-2 bg-og-gradient text-white rounded-lg hover:bg-og-gradient-dark transition"
                    >
                        {isLoading ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            "Post Your Story"
                        )}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default AddPetStoryCard