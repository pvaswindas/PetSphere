import React, { useState, useCallback, useEffect } from "react"
import Cropper from "react-easy-crop"
import { ImageCropper } from "../../../utils/ImageCropper"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import AlertSnackbar from "../../Snackbar/AlertSnackbar"
import { retrieveAvailablePetTypes } from "../../../utils/retrieveAvailablePets"
import { retrieveAvailablePetBreeds } from "../../../utils/retrieveAvailablePetBreeds"
import axiosInstance from "../../../axios/axiosinstance"


const AddPetListingCard = () => {
    const dispatch = useDispatch()
    const [images, setImages] = useState([])
    const [cropData, setCropData] = useState(null)
    const [originalFileType, setOriginalFileType] = useState(null)
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const petTypes = useSelector((state) => state.pets.petTypes)
    const [petBreeds, setPetBreeds] = useState([])
    const [cropSettings, setCropSettings] = useState({
        image: null,
        crop: { x: 0, y: 0 },
        zoom: 1,
        aspect: 1,
    })
    const [petDetails, setPetDetails] = useState({
        type: "",
        breed: "",
        gender: "",
        age: "",
        name: "",
        description: "",
        saleOrAdoption: "Selling",
        price: "",
    })
    const [isCropping, setIsCropping] = useState(false)
    const navigate = useNavigate()

    const handleChange = async (value, field) => {
        if (field === "age" || field === "price") {
            value = value === "" ? null : parseFloat(value)
        }
        if (field === "type") {
            setPetDetails((prevDetails) => ({
                ...prevDetails,
                breed: "",
            }));
            const breeds = await retrieveAvailablePetBreeds(dispatch, value, petBreeds);
            setPetBreeds(breeds)
        }
        setPetDetails((prev) => ({
        ...prev,
        [field]: value,
        }));
    };

    useEffect(() => {
        retrieveAvailablePetTypes(dispatch);
    }, [dispatch])

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

    const handlePaste = (e) => {
        e.preventDefault();
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
    
        try {
            const formData = new FormData();
            const petListing = {
                post_type: petDetails.saleOrAdoption,
                pet_name: petDetails.name,
                pet_type: petDetails.type,
                breed: petDetails.breed,
                gender: petDetails.gender,
                description: petDetails.description,
                age: parseInt(petDetails.age),
                price: petDetails.saleOrAdoption === "Selling" ? parseFloat(petDetails.price) : 0
            };
            
            Object.entries(petListing).forEach(([key, value]) => {
                formData.append(key, value)
            })
            images.forEach((image) => {
                formData.append('images', image);
            });
            const response = await axiosInstance.post("posts/listingdatastore/", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            })
            if (response.status === 201) {
                handleSuccess(response.data.encrypted_redis_key);
            }
        } catch (error) {
            setSnackbarMessage("Failed to create pet listing");
            setSnackbarOpen(true);
        }
    }    
    
    const validateForm = () => {
        if (petDetails.type === "" || petDetails.breed === "" || 
            petDetails.gender === "" || petDetails.name === "" || 
            petDetails.age === "" || petDetails.description === "" || 
            (petDetails.saleOrAdoption === "Selling" && petDetails.price === "") || 
            images.length === 0) {
            setSnackbarMessage("Please fill all the fields")
            setSnackbarOpen(true)
            return false
        }
        
        if (!Number.isInteger(parseFloat(petDetails.age)) || isNaN(petDetails.age) || petDetails.age < 0 || petDetails.age > 200) {
            setSnackbarMessage("Age must be between 0 and 200")
            setSnackbarOpen(true)
            return false
        }

        if (petDetails.saleOrAdoption === "Selling") {
            if (petDetails.price < 1000 || petDetails.price > 500000) {
                setSnackbarMessage("Price must be between 1,000 and 5,00,000")
                setSnackbarOpen(true)
                return false
            }
        }

        return true
    }
    
    const handleSuccess = (key) => {
        localStorage.setItem('petListingKey', key)
        setImages([])
        setPetDetails({
            type: "", breed: "", gender: "", age: "",
            description: "", saleOrAdoption: "adoption", price: "",
        })
        navigate('/mapexplore')
    }

    const renderSelectedImages = () => {
        return images.length > 0 && (
            <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-600">Selected Images</h3>
                <div className="grid grid-cols-3 gap-4 mt-2">
                    {images.map((image, index) => (
                        <div key={index} className="relative group">
                            <img
                                src={URL.createObjectURL(image)}
                                alt={`selected-img-${index}`}
                                className="w-full h-full object-cover rounded-md border border-gray-300"
                                style={{ aspectRatio: '1' }}
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
        <div className="p-6 bg-white rounded-lg shadow-lg mx-auto w-full">
            <AlertSnackbar
                open={snackbarOpen}
                message={snackbarMessage}
                alert_type="error"
                onClose={() => setSnackbarOpen(false)}
            />
            <h1 className="text-2xl font-semibold text-gray-800 mb-6">Add Pet Listing</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Pet Details */}
                <div>
                    <label htmlFor="pet-type" className="block text-sm font-medium text-gray-600">Pet Type</label>
                    <select
                        id="pet-type"
                        name="type"
                        value={petDetails.type}
                        onChange={(e) => handleChange(e.target.value, 'type')}
                        className="w-full px-4 py-2 mt-1 border bg-white text-gray-500 border-gray-300 rounded-lg focus:outline-none"
                    >
                        <option value="">Select Pet Type</option>
                        {petTypes?.map((type, index) => (
                            <option key={index} value={type.name}>{type.name}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="pet-breed" className="block text-sm font-medium text-gray-600">Pet Breed</label>
                    <select
                        id="pet-breed"
                        name="breed"
                        value={petDetails.breed}
                        onChange={(e) => handleChange(e.target.value, 'breed')}
                        className="w-full px-4 py-2 mt-1 border bg-white text-gray-500 border-gray-300 rounded-lg focus:outline-none"
                    >
                        <option value="">Select Pet Breed</option>
                        {petBreeds?.map((breeds, index) => (
                            <option key={index} value={breeds.name}>{breeds.name}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="pet-name" className="block text-sm font-medium text-gray-600">Pet Name</label>
                    <input
                        id="pet-name"
                        type="text"
                        name="pet_name"
                        autoComplete="off"
                        value={petDetails.name}
                        onChange={(e) => handleChange(e.target.value, 'name')}
                        maxLength={25}
                        rows="4"
                        placeholder="Name of the pet"
                        className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none"
                    />
                </div>

                <div>
                    <label htmlFor="pet-description" className="block text-sm font-medium text-gray-600">Description</label>
                    <textarea
                        id="pet-description"
                        name="description"
                        value={petDetails.description}
                        onChange={(e) => handleChange(e.target.value, 'description')}
                        maxLength={50}
                        rows="4"
                        placeholder="Write a short description about the pet"
                        className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none"
                    />
                </div>

                <div className="flex space-x-4">
                    <div className="w-1/2">
                        <label htmlFor="pet-gender" className="block text-sm font-medium text-gray-600">Gender</label>
                        <select
                            id="pet-gender"
                            name="gender"
                            value={petDetails.gender}
                            onChange={(e) => handleChange(e.target.value, 'gender')}
                            className="w-full px-4 py-2 mt-1 border text-gray-500 bg-white border-gray-300 rounded-lg focus:outline-none"
                        >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                    </div>

                    <div className="w-1/2">
                        <label htmlFor="pet-age" className="block text-sm font-medium text-gray-600">Age</label>
                        <input
                            id="pet-age"
                            name="age"
                            type="number"
                            value={petDetails.age}
                            onPaste={handlePaste}
                            autoComplete="off"
                            onChange={(e) => handleChange(e.target.value, 'age')}
                            className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none appearance-none"
                            placeholder="Age in years"
                            min="0"
                            step="1"
                        />
                    </div>

                </div>

                <div>
                    <label htmlFor="sale-or-adoption" className="block text-sm font-medium text-gray-600">Sale/Adoption</label>
                    <div className="flex space-x-4">
                        <label>
                            <input
                                type="radio"
                                name="saleOrAdoption"
                                value="Selling"
                                checked={petDetails.saleOrAdoption === "Selling"}
                                onChange={(e) => handleChange(e.target.value, 'saleOrAdoption')}
                                className="mr-2"
                            />
                            Selling
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="saleOrAdoption"
                                value="Adoption"
                                checked={petDetails.saleOrAdoption === "Adoption"}
                                onChange={(e) => handleChange(e.target.value, 'saleOrAdoption')}
                                className="mr-2"
                            />
                            Adoption
                        </label>
                    </div>
                </div>

                {petDetails.saleOrAdoption === "Selling" && (
                    <div>
                        <label htmlFor="pet-price" className="block text-sm font-medium text-gray-600">Price</label>
                        <input
                            id="pet-price"
                            name="price"
                            type="number"
                            value={petDetails.price}
                            onPaste={handlePaste}
                            autoComplete="off"
                            onChange={(e) => handleChange(e.target.value, 'price')}
                            className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none"
                            placeholder="Price for sale"
                        />
                    </div>
                )}

                {/* Image Upload */}
                <div className="space-y-6">
                    <h3 className="text-xl font-bold text-gray-800">Upload Pet Images</h3>

                    {!isCropping ? (
                        <div className="flex flex-col items-center justify-center w-full p-6 border-2 border-dashed rounded-lg border-gray-300 bg-gray-50 hover:bg-gray-100 transition duration-200">
                            <input
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

                {/* Submit Button */}
                <div className="mt-6">
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 rounded-lg font-semibold transition hover:bg-blue-600"
                    >
                        Next
                    </button>
                </div>
            </form>
        </div>
    )
}

export default AddPetListingCard
