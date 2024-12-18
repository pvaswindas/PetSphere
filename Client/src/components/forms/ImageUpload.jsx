import React, { useState, useEffect } from "react"
import { useDropzone } from "react-dropzone"
import AlertSnackbar from "../Snackbar/AlertSnackbar"

const ImageUpload = ({ onChange, image, reset }) => {
    const [uploadedFile, setUploadedFile] = useState(null)
    const [snackbarMessage, setSnackbarMessage] = useState("")
    const [snackbarOpen, setSnackbarOpen] = useState(false)

    useEffect(() => {
        if (image === null) {
            setUploadedFile(null)
        }
    }, [image])

    const resetUpload = () => {
        setUploadedFile(null);
    };

    useEffect(() => {
        if (reset) reset(resetUpload);
    }, [reset]);

    const onDrop = (acceptedFiles, fileRejections) => {
        if (fileRejections.length > 0) {
            setSnackbarMessage("Invalid file type. Please upload an image.")
            setSnackbarOpen(true)
            return
        }

        const file = acceptedFiles[0]
        if (file) {
            setSnackbarMessage("")
            setUploadedFile(Object.assign(file, { preview: URL.createObjectURL(file) }))
            onChange(file)
        }
    }

    const { getRootProps, getInputProps } = useDropzone({
        accept: { "image/*": [] },
        multiple: false,
        onDrop,
    })

    useEffect(() => {
        return () => {
            if (uploadedFile?.preview) {
                URL.revokeObjectURL(uploadedFile.preview)
            }
        }
    }, [uploadedFile])

    return (
        <div className="flex flex-col space-y-2 my-3">
            <AlertSnackbar
                open={snackbarOpen}
                message={snackbarMessage}
                alert_type="error"
                onClose={() => setSnackbarOpen(false)}
            />
            <div
                {...getRootProps()}
                className="border-2 border-dashed border-gray-300 rounded-lg px-4 lg:py-4 flex flex-col items-center 
                            justify-center cursor-pointer bg-softSkyBlue hover:bg-blue-50 focus:outline-none"
            >
                <input {...getInputProps()} id="pet-image" /> {/* Add id here */}
                {!uploadedFile ? (
                    <p className="text-darkDenimBlue text-opacity-40 text-sm my-6">
                        Drag & drop an image here, or{" "}
                        <span className="text-denimBlue underline">click to upload</span>
                    </p>
                ) : (
                    <div>
                        <img
                            src={uploadedFile.preview}
                            alt="Uploaded Preview"
                            className="w-12 h-12 object-cover rounded-lg"
                        />
                        <p className="text-xs text-gray-500 mt-1 truncate">{uploadedFile.name}</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ImageUpload
