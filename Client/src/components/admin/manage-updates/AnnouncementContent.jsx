import React, { useEffect, useRef, useState } from "react";
import FlexiCard from "../common/FlexiCard";
import AlertSnackbar from "../../Snackbar/AlertSnackbar";
import { getAnnouncements, postAnnouncement } from "../../../api/announcements";
import Button from "../../forms/Button";
import ImageUpload from "../../forms/ImageUpload";
import TextFieldInput from "../../forms/TextInput";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const AnnouncementContent = () => {
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [alertType, setAlertType] = useState("error")

    const search = useSelector((state) => state.adminSearch.search)

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [image, setImage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const [announcements, setAnnouncements] = useState([]);
    const limitedData = announcements?.slice().slice(0, 5);

    const navigate = useNavigate()

    const imageUploadRef = useRef(null);

    useEffect(() => {
        const fetchUpdates = async () => {
            try {
                const response = await getAnnouncements(null, search !== "" ? search : null);
                setAnnouncements(response.results);
            } catch (error) {
                setSnackbarMessage("Error fetching announcements");
                setAlertType("error")
                setSnackbarOpen(true);
            }
        };
        fetchUpdates();
    }, [search]);

    const handleChange = (value, field) => {
        if (field === "title") setTitle(value);
        else setContent(value);
    };

    const handleImageChange = (file) => {
        if (file && !["image/png", "image/jpeg", "image/jpg"].includes(file.type)) {
            setSnackbarMessage("Only PNG and JPG images are allowed.");
            setAlertType("error");
            setSnackbarOpen(true);
            return;
        }
        setImage(file);
    };    

    const handleSubmit = async () => {
        if (title === "" || content === "") {
            setSnackbarMessage("Adding announcement failed: Please fill in all fields");
            setAlertType("error");
            setSnackbarOpen(true);
            return;
        }
        if (!image) {
            setSnackbarMessage("Please upload an image for the announcement.");
            setAlertType("error");
            setSnackbarOpen(true);
            return;
        }
        setIsLoading(true);
        const formData = new FormData();
        formData.append("title", title);
        formData.append("content", content);
        if (image) formData.append("icon", image);

        try {
            await postAnnouncement(formData)

            setSnackbarMessage("Announcement added successfully");
            setAlertType("success")
            setSnackbarOpen(true);
            setTitle("");
            setContent("");
            setImage(null);
            setIsLoading(false);

            const updatedAnnouncements = await getAnnouncements();
            setAnnouncements(updatedAnnouncements.results);
        } catch (error) {
            setSnackbarMessage("Error adding announcement");
            setAlertType("error")
            setSnackbarOpen(true);
            setIsLoading(false);
        }
    };

    return (
        <div className="pb-10 lg:pb-0">
            <AlertSnackbar
                open={snackbarOpen}
                message={snackbarMessage}
                alert_type={alertType}
                onClose={() => setSnackbarOpen(false)}
            />
            {/* Content Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FlexiCard title={"Add Announcement"} description={"Add new announcement for users to stay engaged and informed."}>
                    <TextFieldInput
                        label="Title"
                        id="title"
                        name="title"
                        placeholder="Enter the title here"
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

                    <div className="flex flex-col space-y-2 my-3">
                        <label htmlFor="content" className="text-sm font-medium text-darkDenimBlue">
                            Content
                        </label>
                        <textarea
                            id="content"
                            name="content"
                            placeholder="Enter the content for the update"
                            value={content}
                            onChange={(e) => handleChange(e.target.value, "content")}
                            rows={5}
                            maxLength={100}
                            className="px-4 py-2 h-20 w-full rounded-lg text-darkDenimBlue placeholder-darkDenimBlue text-opacity-40 placeholder-opacity-40
                                    bg-softSkyBlue focus:outline-none focus:ring-1 focus:ring-denimBlue resize-none"
                        />
                    </div>

                    <div className="flex flex-col space-y-2 my-3">
                        <label htmlFor="pet-image" className="text-sm font-medium text-darkDenimBlue">
                            Upload Icon
                        </label>
                        <ImageUpload onChange={handleImageChange} image={image} reset={(resetFn) => (imageUploadRef.current = resetFn)} />
                    </div>

                    <Button
                        type="button"
                        text={isLoading ? "Adding..." : "Add Announcement"}
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

                <FlexiCard title={"Recent Announcements"} description={"View and manage the latest announcements."}>
                    {announcements?.length === 0 ? (
                        <div className="h-10">
                            <p className="text-center text-sm mt-40 text-darkDenimBlue">No announcements available.</p>
                        </div>
                    ) : (
                        <div className="overflow-y-auto max-h-[400px] lg:max-h-[409px]">
                            <ul className="space-y-6 my-2">
                            {limitedData?.map((item, index) => (
                                <React.Fragment key={item?.id || index}>
                                    <li key={item?.id || `announcement-${index}`} className="flex items-center justify-between">
                                            <div className="flex item?s-center space-x-4">
                                                <img
                                                    src={item?.icon}
                                                    alt={`${item?.title} icon`}
                                                    className="w-10 h-10 rounded-full object-cover border border-gray-300"
                                                />
                                                <div>
                                                    <p className="font-medium text-sm">{item?.title}</p>
                                                    <p className="text-xs text-gray-500 max-w-[325px] break-words">{item?.content}</p>
                                                </div>
                                            </div>
                                        </li>
                                    </React.Fragment>
                                ))}
                            </ul>
                            {announcements?.length > 5 && (
                                <div className="flex item?s-end w-full">
                                    <button
                                        className="py-2 text-darkDenimBlue text-xs font-medium hover:underline focus:outline-none"
                                        onClick={() => navigate('/admin/manage/updates/list-view')}
                                    >
                                        View All
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </FlexiCard>
            </div>
        </div>
    );
};

export default AnnouncementContent;
