import React, { useEffect, useRef, useState } from "react"
import FlexiCard from "../FlexiCard"
import Button from "../../forms/Button"
import TextFieldInput from "../../forms/TextInput"
import ImageUpload from "../../forms/ImageUpload"
import axiosInstance from "../../../axios/axiosinstance"
import AlertSnackbar from "../../Snackbar/AlertSnackbar"
import { useDispatch, useSelector } from "react-redux"
import { retrieveAvailablePetTypes } from "../../../utils/retrieveAvailablePets"
import PetList from "../PetList"
import { retrieveAvailablePetBreeds } from "../../../utils/retrieveAvailablePetBreeds"

const PetCatalogContent = () => {
    const [currentSection, setCurrentSection] = useState("pet-types")
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [image, setImage] = useState(null)
    const [selectedPetType, setSelectedPetType] = useState("");
    const [isLoading, setIsLoading] = useState(false)
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [isPetAdded, setIsPetAdded] = useState(false)
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [alertType, setAlertType] = useState("")
    const dispatch = useDispatch()

    const petTypes = useSelector((state) => state.pets.petTypes)
    const petBreeds = useSelector((state) => state.pets.petBreeds)

    const toggleSection = () => {
        setCurrentSection((prev) => (prev === "pet-types" ? "pet-breeds" : "pet-types"))
        setTitle("")
        setImage("")
        setContent("")
        setSelectedPetType("")
    }

    const handleChange = (value, field) => {
        if (field === "title") setTitle(value)
        else setContent(value)
    }

    const handlePetChange = (value) => {
        setSelectedPetType(value)
    }

    const handleImageChange = (file) => {
        setImage(file)
    }

    const imageUploadRef = useRef(null);

    const resetImageUpload = () => {
        if (imageUploadRef.current) {
            imageUploadRef.current();
        }
    };

    const handleSubmit = async () => {
        if (!title || !content || !image) {
            setSnackbarMessage("Please fill in all fields before submitting.")
            setAlertType("error")
            setSnackbarOpen(true)
            return
        }

        const formData = new FormData()
        formData.append("name", title)
        formData.append("description", content)
        formData.append("icon", image)

        setIsLoading(true)
        try {
            await axiosInstance.post(
                "pet/type/",
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            )
            setIsPetAdded(true)
            setSnackbarMessage("Pet added successfully!")
            setAlertType("success")
            setSnackbarOpen(true)

            setTitle("")
            setContent("")
            setImage(null)
            resetImageUpload();
        } catch (error) {
            setSnackbarMessage("Failed to add pet. Please try again.")
            setAlertType("error")
            setSnackbarOpen(true)
        } finally {
            setIsLoading(false)
        }
    }


    const handleBreedSubmit = async () => {
        if (!title || !content || !selectedPetType) {
            setSnackbarMessage("Please fill in all fields before submitting.")
            setAlertType("error")
            setSnackbarOpen(true)
            return
        }

        const formData = new FormData()
        formData.append("name", title)
        formData.append("description", content)
        formData.append("pet_type", selectedPetType)

        setIsLoading(true)
        try {
            await axiosInstance.post(
                "pet/breed/",
                formData
            )
            setIsPetAdded(true)
            setSnackbarMessage("Pet Breed added successfully!")
            setAlertType("success")
            setSnackbarOpen(true)

            setTitle("")
            setContent("")
            setSelectedPetType("")
        } catch (error) {
            setSnackbarMessage("Failed to add pet breed. Please try again.")
            setAlertType("error")
            setSnackbarOpen(true)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        const fetchPetTypes = async () => {
            await retrieveAvailablePetTypes(dispatch)
        }

        const fetchPetBreeds = async () => {
            await retrieveAvailablePetBreeds(dispatch)
        }

        fetchPetTypes()
        fetchPetBreeds()
    }, [dispatch, isPetAdded])

    const handleEdit = () => {

    }

    const handleDelete = () => {
        
    }

    return (
        <div>
            <AlertSnackbar
                open={snackbarOpen}
                message={snackbarMessage}
                alert_type={alertType}
                onClose={() => setSnackbarOpen(false)}
            />
            {/* Content Section */}
            <div className="flex justify-between">
                <div className="flex flex-col justify-between my-4">
                    <h1 className="text-xl lg:text-2xl font-medium text-midnightBlue">Manage Pets</h1>
                    <p className="text-xs mb-2 text-midnightBlue opacity-50">
                        Organize pet types and breeds for accurate listings and easy navigation.
                    </p>
                </div>
                <div className="flex items-center">
                    <Button
                        type="button"
                        text={`${currentSection === "pet-types" ? "Breeds" : "Types"}`}
                        textColor="text-white"
                        rounded="rounded-full"
                        paddingx="px-5 lg:px-10"
                        paddingy="py-0 lg:py-2"
                        isLoading={false}
                        isLoadingBackground="bg-pastelBlue"
                        className=""
                        loadingText="Loading..."
                        backgroundColor="bg-deepOceanBlue"
                        hoverBackgroundColor="hover:bg-deep-ocean-blue-gradient-end"
                        onClick={toggleSection}
                    />
                </div>
            </div>

            {/* Conditional Rendering for FlexiCards */}
            {currentSection === "pet-types" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FlexiCard
                        title={"Add New Pet Type"}
                        description={"Create a new pet type to categorize animals for better organization."}
                    >
                        <TextFieldInput 
                            label='Pet Type'
                            id='pet-type'
                            name='pet-type'
                            placeholder='Enter the pet type here'
                            borderRadius='rounded-lg'
                            labelColor='text-darkDenimBlue'
                            borderColor='focus:ring-denimBlue'
                            mainBackground='bg-softSkyBlue'
                            focusBorderColor='focus:ring-denimBlue'
                            textColor="text-darkDenimBlue placeholder-darkDenimBlue text-opacity-40 placeholder-opacity-40"
                            value={title}
                            margin="my-3"
                            onChange={(value) => handleChange(value, "title")}
                        />

                        <div className="flex flex-col space-y-2 my-3">
                            <label 
                                htmlFor="pet-description" 
                                className="text-sm font-medium text-darkDenimBlue"
                            >
                                Description
                            </label>
                            <textarea
                                id="pet-description"
                                name="pet-description"
                                placeholder="Enter a brief description of the pet type"
                                value={content}
                                onChange={(e) => handleChange(e.target.value, "content")}
                                rows={5}
                                maxLength={100}
                                className="px-4 py-2 h-20 w-full rounded-lg text-darkDenimBlue placeholder-darkDenimBlue text-opacity-40 placeholder-opacity-40
                                        bg-softSkyBlue focus:outline-none focus:ring-1 focus:ring-denimBlue resize-none"
                            />
                        </div>

                        <div className="flex flex-col space-y-2 my-3">
                            <label 
                                htmlFor="pet-image" 
                                className="text-sm font-medium text-darkDenimBlue"
                            >
                                Upload Image
                            </label>
                            <ImageUpload 
                                onChange={handleImageChange} 
                                image={image} 
                                reset={(resetFn) => (imageUploadRef.current = resetFn)} 
                            />
                        </div>

                        <Button
                            type="button"
                            text={isLoading ? "Adding..." : "Add Pet"}
                            textColor="text-white"
                            rounded="rounded-lg"
                            paddingx="px-5 lg:px-10"
                            paddingy="py-2"
                            isLoading={isLoading}
                            isLoadingBackground="bg-pastelBlue"
                            className="w-full"
                            loadingText="Adding..."
                            backgroundColor="bg-denimBlue"
                            hoverBackgroundColor="hover:bg-darkDenimBlue"
                            onClick={handleSubmit}
                        />
                    </FlexiCard>

                    <PetList 
                        title={"Manage Pet Types"}
                        description={"View and manage pet types"}
                        data={petTypes}
                        handleEdit={handleEdit}
                        handleDelete={handleDelete}
                        type={"pet type"}
                    />

                </div>
            )}

            {currentSection === "pet-breeds" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FlexiCard
                        title={"Add New Pet Breed"}
                        description={"Create a new breed under a pet type for detailed categorization."}
                    >
                        {/* Pet Type Selection */}
                        <div className="flex flex-col space-y-2 my-3">
                            <label 
                                htmlFor="pet-type" 
                                className="text-sm font-medium text-darkDenimBlue"
                            >
                                Pet Type
                            </label>
                            <select
                                id="pet-type"
                                name="pet-type"
                                value={selectedPetType}
                                onChange={(e) => handlePetChange(e.target.value, "petType")}
                                className="px-4 py-2 h-10 w-full rounded-lg text-darkDenimBlue bg-softSkyBlue placeholder-darkDenimBlue 
                                        text-opacity-40 placeholder-opacity-40 focus:outline-none focus:ring-1 focus:ring-denimBlue"
                            >
                                <option value="" disabled>Select a pet type</option>
                                {petTypes.map((type) => (
                                    <option key={type.id} value={type.id}>
                                        {type.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Pet Breed Input */}
                        <TextFieldInput 
                            label="Pet Breed"
                            id="pet-breed"
                            name="pet-breed"
                            placeholder="Enter the pet breed here"
                            borderRadius="rounded-lg"
                            labelColor="text-darkDenimBlue"
                            borderColor="focus:ring-denimBlue"
                            mainBackground="bg-softSkyBlue"
                            focusBorderColor="focus:ring-denimBlue"
                            textColor="text-darkDenimBlue placeholder-darkDenimBlue text-opacity-40 placeholder-opacity-40"
                            value={title}
                            margin="my-3"
                            onChange={(value) => handleChange(value, "title")}
                        />

                        {/* Breed Description */}
                        <div className="flex flex-col space-y-2 mt-3 mb-6">
                            <label 
                                htmlFor="breed-description" 
                                className="text-sm font-medium text-darkDenimBlue"
                            >
                                Description
                            </label>
                            <textarea
                                id="breed-description"
                                name="breed-description"
                                placeholder="Enter a brief description of the pet breed"
                                value={content}
                                onChange={(e) => handleChange(e.target.value, "content")}
                                rows={5}
                                maxLength={100}
                                className="px-4 py-2 h-20 w-full rounded-lg text-darkDenimBlue placeholder-darkDenimBlue text-opacity-40 placeholder-opacity-40
                                        bg-softSkyBlue focus:outline-none focus:ring-1 focus:ring-denimBlue resize-none"
                            />
                        </div>

                        {/* Add Breed Button */}
                        <Button
                            type="button"
                            text={isLoading ? "Adding..." : "Add Breed"}
                            textColor="text-white"
                            rounded="rounded-lg"
                            paddingx="px-5 lg:px-10"
                            paddingy="py-2"
                            isLoading={isLoading}
                            isLoadingBackground="bg-pastelBlue"
                            className="w-full"
                            loadingText="Adding..."
                            backgroundColor="bg-denimBlue"
                            hoverBackgroundColor="hover:bg-darkDenimBlue"
                            onClick={handleBreedSubmit}
                        />
                    </FlexiCard>

                    {/* Manage Pet Breeds */}
                    <PetList 
                        title={"Manage Pet Breeds"}
                        description={"View and manage pet breeds under each type"}
                        data={petBreeds}
                        handleEdit={handleEdit}
                        handleDelete={handleDelete}
                        type={"pet breed"}
                    />
                </div>
            )}

        </div>
    )
}

export default PetCatalogContent
