import React, { useState, useEffect, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import AlertSnackbar from "../Snackbar/AlertSnackbar"

const ImageUpload = ({ onChange, image, reset }) => {
    const [uploadedFile, setUploadedFile] = useState(null)
    const [snackbarMessage, setSnackbarMessage] = useState("")
    const [snackbarOpen, setSnackbarOpen] = useState(false)

    useEffect(() => {
        // Clean up preview URL when component unmounts
        return () => {
            if (uploadedFile && uploadedFile.preview && typeof uploadedFile.preview === 'string' && uploadedFile.preview.startsWith('blob:')) {
                URL.revokeObjectURL(uploadedFile.preview);
            }
        };
    }, [uploadedFile]);

    const resetUpload = useCallback(() => {
        if (uploadedFile && uploadedFile.preview && typeof uploadedFile.preview === 'string' && uploadedFile.preview.startsWith('blob:')) {
            URL.revokeObjectURL(uploadedFile.preview);
        }
        setUploadedFile(null);
    }, [uploadedFile]);

    useEffect(() => {
        if (reset) reset(resetUpload);
    }, [reset, resetUpload]);

    // Handle image prop changes
    useEffect(() => {
        if (image === null || image === "") {
            resetUpload();
        } else if (image instanceof File) {
            // If it's a File object, create a preview URL
            setUploadedFile(Object.assign(image, { 
                preview: URL.createObjectURL(image) 
            }));
        } else if (typeof image === 'string' && image.length > 0) {
            // If it's a string URL (from existing image)
            setUploadedFile({ 
                preview: image, 
                name: "Existing Image" 
            });
        }
    }, [image, resetUpload]);

    const onDrop = (acceptedFiles, fileRejections) => {
        if (fileRejections.length > 0) {
            setSnackbarMessage("Invalid file type. Please upload an image.");
            setSnackbarOpen(true);
            return;
        }
    
        const file = acceptedFiles[0];
        if (file) {
            // Clean up previous preview URL if it exists
            if (uploadedFile && uploadedFile.preview && typeof uploadedFile.preview === 'string' && uploadedFile.preview.startsWith('blob:')) {
                URL.revokeObjectURL(uploadedFile.preview);
            }
            
            const previewUrl = URL.createObjectURL(file);
            setUploadedFile(Object.assign(file, { preview: previewUrl }));
            onChange(file);
            setSnackbarMessage("");
        }
    };

    const { getRootProps, getInputProps } = useDropzone({
        accept: { "image/*": [] },
        multiple: false,
        onDrop,
    })

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
                <input {...getInputProps()} id="pet-image" name="pet-image" />
                {!uploadedFile ? (
                    <p className="text-darkDenimBlue text-opacity-40 text-sm my-6">
                        Drag & drop an image here, or{" "}
                        <span className="text-denimBlue underline">click to upload</span>
                    </p>
                ) : (
                    <div className="flex flex-col items-center py-2">
                        <img
                            src={uploadedFile.preview}
                            alt="Uploaded Preview"
                            className="w-10 h-10 object-cover rounded-lg"
                        />
                        <p className="text-xs text-gray-500 mt-1 truncate max-w-full">
                            {uploadedFile.name || "Uploaded Image"}
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ImageUpload