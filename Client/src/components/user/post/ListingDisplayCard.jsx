import React, { memo, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { deletePetListing, fetchPetListing, updatePetListing } from "../../../redux/thunks/PetListingThunk";
import AlertSnackbar from "../../Snackbar/AlertSnackbar";
import { Send } from "lucide-react";
import OptionsModal from "../../common/OptionsModal";
import Shimmer from "../../Shimmer/Shimmer";
import { ContentArea } from "./ContentArea";
import { PostHeader } from "./PostHeader";
import EditContentArea from "./EditContentArea";
import ReportContent from "../report/ReportContent";

const   ListingDisplayCard = memo(() => {
    const { slug } = useParams();
    const dispatch = useDispatch();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setDeleteIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState("");
    const [showReport, setShowReport] = useState(false);
    


    const [snackbarMessage, setSnackbarMessage] = useState("")
    const [snackbarOpen, setSnackbarOpen] = useState(false)
    const [snackbarAlertType, setSnackbarAlertType] = useState("error")

    const [isLoading, setIsLoading] = useState(true)

    const listing = useSelector((state) => state.petListings?.petListing || null);
    const profile = useSelector((state) => state.profile?.profile_data || null);
    const navigate = useNavigate();
    const createdAt = new Date(listing?.created_at)
    const updatedAt = new Date(listing?.updated_at)

    console.log("LISTING : ", listing)
    console.log("PROFILE :", profile)

    createdAt.setSeconds(0, 0)
    updatedAt.setSeconds(0, 0)
    // const isPostEdited = createdAt.getTime() !== updatedAt.getTime()

    const fetchData = useCallback((slug) => {
        setIsLoading(true)
        try {
            dispatch(fetchPetListing(slug))
        } catch (error) {
            setSnackbarMessage("Unable to fetch listing")
            setSnackbarAlertType("error")
            setSnackbarOpen(true)
        } finally {
            setIsLoading(false)
        }
    }, [dispatch])

    useEffect(() => {
        if (slug) {
            fetchData(slug);
        }
    }, [slug, fetchData]);

    
    useEffect(() => {
        if (listing) {
            setEditedContent(listing.description);
        }
    }, [listing]);


    const toggleModal = () => setIsModalOpen((prev) => !prev);
    const toggleDeleteModal = () => setDeleteIsModalOpen((prev) => !(prev));

    const handleBothToggle = () => {
        toggleModal();
        toggleDeleteModal();
    };

    const handleEditClick = () => {
        setIsEditing(true);
        toggleModal();
    };

    const handlePostSettingsToggle = (field, value) => {
        dispatch(updatePetListing({
            slug: listing.slug,
            data: {[field]: value}
        }));
    }

    const handleContentSave = () => {
        if (listing?.description !== editedContent) {
            dispatch(updatePetListing({
                slug: listing.slug,
                data: {content: editedContent}
            }));
            setEditedContent(" ");
            setIsEditing(false);
            setSnackbarMessage("Post has been saved.")
            setSnackbarAlertType("success")
            setSnackbarOpen(true)
        }
    };

    const handleCancel = () => {
        setEditedContent(listing.description);
        setIsEditing(false);
    };

    const handleDeletePost = async () => {
        try {
            await dispatch(deletePetListing(slug)).unwrap();
            navigate(`/profile/${profile.user.usename}`);
        } catch (error) {
            setSnackbarMessage("Something went wrong. Try again.")
            setSnackbarAlertType("error")
            setSnackbarOpen(true)
        }
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.href)
        setSnackbarMessage("Link copied to clipboard.")
        setSnackbarAlertType("success")
        setSnackbarOpen(true)
    }

    const handleReportClose = (type, message) => {
        setShowReport(false);
    };

    const handleReportClick = () => {
        setShowReport(true);
        toggleModal();
    };

    if (isLoading) {
        return (
            <div className="bg-white lg:shadow-lg w-full rounded-lg flex flex-col lg:flex-row">
                {/* Left side - Image shimmer */}
                <div className="w-full lg:w-1/2 relative min-h-[600px]">
                    <Shimmer className="w-full h-full min-h-[300px] lg:rounded-l-lg" />
                </div>
                
                {/* Right side - Content shimmer */}
                <div className="flex-grow w-full lg:w-1/2 flex flex-col justify-between p-4">
                    {/* User header shimmer */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                            <Shimmer className="h-10 w-10 rounded-full" />
                            <div className="flex flex-col ml-3">
                                <Shimmer className="h-4 w-24 mb-2" />
                                <Shimmer className="h-3 w-16" />
                            </div>
                        </div>
                        <Shimmer className="h-6 w-6 rounded-full" />
                    </div>
                    
                    {/* Content shimmer */}
                    <div className="flex-grow">
                        <Shimmer className="w-full h-4 mb-2" />
                        <Shimmer className="w-5/6 h-4 mb-2" />
                        <Shimmer className="w-4/6 h-4 mb-2" />
                        <Shimmer className="w-3/6 h-4" />
                    </div>
                    
                    {/* Action buttons shimmer */}
                    <div className="mt-4 pt-4 border-t">
                        <div className="flex items-center">
                            <Shimmer className="h-8 w-8 rounded-full mr-2" />
                            <Shimmer className="h-4 w-6 mr-4" />
                            <Shimmer className="h-8 w-8 rounded-full mr-2" />
                            <Shimmer className="h-4 w-6 mr-4" />
                            <Shimmer className="h-8 w-8 rounded-full" />
                        </div>
                        <Shimmer className="h-3 w-32 mt-3" />
                    </div>
                </div>
            </div>
        );
    }



    if ((!listing || !listing.images || listing.images.length === 0)  && !isLoading) {
        return (
            <div className="w-full h-64 flex items-center justify-center rounded-lg">
                <p className="text-gray-500">Post not found</p>
            </div>
        );
    }

    return (
        <>
            <div className="bg-white lg:shadow-lg w-full rounded-lg flex flex-col lg:flex-row">
                <AlertSnackbar
                    open={snackbarOpen}
                    message={snackbarMessage}
                    alert_type={snackbarAlertType}
                    onClose={() => setSnackbarOpen(false)}
                />

                <PostHeader post={listing} toggleModal={toggleModal} />

                <ContentArea post={listing} />

                {showReport ? (
                    // Report Content will replace the regular content when showReport is true
                    <ReportContent 
                        isOpen={showReport}
                        onClose={handleReportClose}
                        reportType="listing"
                        targetId={listing?.description ? listing.description : { [listing.user_profile.username]: listing.id }}
                        targetSlug={listing?.slug}
                        customClass="flex-grow w-full"
                    />
                ) : (
                    // Right Section: Content
                    <div className="flex-grow w-full flex flex-col justify-between">
                        {/* User Info */}
                        <div className="m-0 p-0">

                            <PostHeader post={listing} toggleModal={toggleModal} isScreenLarger={true} />

                            <hr className="mt-2 hidden lg:flex" />
                            {/* Post Content */}
                            {isEditing ? (
                                <EditContentArea 
                                    isEditing={isEditing}
                                    editedContent={editedContent}
                                    setEditedContent={setEditedContent}
                                    handleCancel={handleCancel}
                                    handleContentSave={handleContentSave}
                                />
                            ) : (
                                <div className="hidden lg:flex justify-between m-2 items-center">
                                    <h2>{listing.description}</h2>
                                    {/* {isPostEdited && (
                                        <p className="text-xs text-gray-500">
                                            Edited on{" "}
                                            {new Date(listing.updated_at).toLocaleDateString("en-GB", {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric",
                                            })}
                                        </p>
                                    )} */}
                                </div>                         
                            )}
                        </div>

                        {/* Action Icons */}
                        <div>
                            <hr className="hidden lg:flex" />
                            <div className="flex flex-col m-3 lg:m-4">
                                <div className="flex items-center text-gray-600">
                                    <button
                                        className="flex items-center p-2 hover:bg-gray-200 rounded-full"
                                        aria-label="Save"
                                        onClick={handleCopyLink}
                                    >
                                        <Send size={19} className="text-gray-500" />
                                    </button>
                                </div>
                            </div>
                            <h2 className="px-5 lg:hidden">{listing.description}</h2>
                        </div>
                        
                    </div>
                )}

            </div>

            {/* Reusable Modal */}
            <OptionsModal isOpen={isModalOpen} onClose={toggleModal}>
                {listing?.user_profile.id === profile.user.id ? 
                    (
                        <ul className="text-center text-gray-700">
                            <li
                                className="hover:bg-gray-100 p-3 rounded cursor-pointer"
                                onClick={handleBothToggle}
                            >
                                Delete
                            </li>
                            <hr />
                            <li
                                className="hover:bg-gray-100 p-3 rounded cursor-pointer"
                                onClick={handleEditClick}
                            >
                                Edit
                            </li>
                            <hr />
                            <li
                                className="hover:bg-gray-100 p-3 rounded cursor-pointer"
                                onClick={() => handlePostSettingsToggle('hide_likes', !listing?.hide_likes)}
                            >
                                {listing?.hide_likes ? 'Show Like Count' : 'Hide Like Count'}
                            </li>
                            <hr />
                            {!listing?.turn_off_comments && (
                                <>
                                    <li
                                        className="hover:bg-gray-100 p-3 rounded cursor-pointer"
                                        onClick={() => handlePostSettingsToggle('hide_comments', !listing?.hide_comments)}
                                    >
                                        {listing?.hide_comments ? 'Show Comment Count' : 'Hide Comment Count'}
                                    </li>
                                </>
                            )}
                            <hr />
                            <li
                                className="hover:bg-gray-100 p-3 rounded cursor-pointer"
                                onClick={() => handlePostSettingsToggle('turn_off_comments', !listing?.turn_off_comments)}
                            >
                                {listing?.turn_off_comments ? 'Turn On Commenting' : 'Turn Off Commenting'}
                            </li>
                            {/* <hr />
                            <li
                                className="hover:bg-gray-100 p-3 rounded cursor-pointer"
                                onClick={handleCopyLink}
                            >
                                Copy Link
                            </li> */}
                            <hr />
                        </ul>
                    ) : (
                        <ul className="text-center text-gray-700">
                            <li
                                className="hover:bg-gray-100 p-3 rounded cursor-pointer"
                                onClick={handleReportClick}
                            >
                                Report
                            </li>
                        </ul>
                    )
                }

            </OptionsModal>

            <OptionsModal isOpen={isDeleteModalOpen} onClose={handleBothToggle} width="w-72 lg:w-80">
                <ul className="text-center text-gray-700">
                    <div className="py-3 flex flex-col">
                        <p className="text-xl font-medium">Delete Post?</p>
                        <p className="text-sm text-gray-500 py-2">Are you sure you want to delete this listing?</p>
                    </div>
                    <hr />
                    <li
                        className="hover:bg-gray-100 p-3 rounded cursor-pointer"
                        onClick={handleDeletePost}
                    >
                        Delete
                    </li>
                    <hr />
                </ul>
            </OptionsModal>
        </>
    );
});



export default ListingDisplayCard;