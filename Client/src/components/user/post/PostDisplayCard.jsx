import React, { memo, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import commentIcon from "../../../assets/icon/post/comment-icon.svg";
import likeIcon from "../../../assets/icon/post/like-icon.svg";
import likedIcon from "../../../assets/icon/post/liked-icon.svg";
import dotMenuIcon from "../../../assets/icon/post/dot-menu-icon.svg";
import { deletePawstory, fetchPawstory, updatePawstory } from "../../../redux/thunks/PostThunk";
import Swal from "sweetalert2";
import axiosInstance from "../../../axios/axiosinstance";
import AlertSnackbar from "../../Snackbar/AlertSnackbar";
import { fetchLikedUsers } from "../../../redux/thunks/FetchLikedUsers";
import { CommentArea } from "../CommentArea/CommentArea";
import { fetchPostSavedUsers } from "../../../redux/thunks/FetchPostSavedUsers";
import { Bookmark, BookmarkCheck, Heart, MessageSquareText } from "lucide-react";
import OptionsModal from "../../common/OptionsModal";
import Shimmer from "../../Shimmer/Shimmer";

const   PostDisplayCard = memo(() => {
    const { slug } = useParams();
    const dispatch = useDispatch();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setDeleteIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState("");
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [isLiked, setIsLiked] = useState(false)
    const [likedPeople, setLikedPeople] = useState([])
    const [showComment, setShowComment] = useState(false)

    const [isSaved, setIsSaved] = useState(false)


    const [snackbarMessage, setSnackbarMessage] = useState("")
    const [snackbarOpen, setSnackbarOpen] = useState(false)
    const [snackbarAlertType, setSnackbarAlertType] = useState("error")

    const [isLoading, setIsLoading] = useState(true)

    const post = useSelector((state) => state.posts?.currentPawstory || null);
    const profile = useSelector((state) => state.profile?.profile_data || null);
    const navigate = useNavigate();
    const post_id = post?.id || null
    const createdAt = new Date(post?.created_at)
    const updatedAt = new Date(post?.updated_at)

    createdAt.setSeconds(0, 0)
    updatedAt.setSeconds(0, 0)
    const isPostEdited = createdAt.getTime() !== updatedAt.getTime()

    const fetchSavedUsers = useCallback(async () => {
        setIsLoading(true)
        try {
            const response = await dispatch(fetchPostSavedUsers(post_id)).unwrap()
            setIsSaved(response.is_saved_by_user);
        } catch (error) {
            
        } finally {
            setIsLoading(false)
        }
    }, [dispatch, post_id])

    const fetchData = useCallback((slug) => {
        setIsLoading(true)
        try {
            dispatch(fetchPawstory(slug))
        } catch (error) {
            setSnackbarMessage("Unable to fetch post")
            setSnackbarAlertType("error")
            setSnackbarOpen(true)
        } finally {
            setIsLoading(false)
        }
    }, [dispatch])

    useEffect(() => {
        if (post_id) {
            fetchSavedUsers()
        }
    }, [post_id, fetchSavedUsers])

    useEffect(() => {
        if (slug) {
            fetchData(slug);
        }
    }, [slug, fetchData]);

    
    useEffect(() => {
        if (post) {
            setEditedContent(post.content);
        }
    }, [post]);

    const isUserLike = useCallback(async (callback) => {
        try {
            const response = await dispatch(fetchLikedUsers(post_id)).unwrap();
            setLikedPeople(response.liked_users);
            setIsLiked(response.is_liked_by_user);
    
            if (callback && typeof callback === 'function') {
                callback(response);
            }
        } catch (error) {
            console.error("Error fetching liked users:", error);
        }
    }, [dispatch, post_id]);

    useEffect(() => {
        if (post_id) {
            isUserLike();
        }
    }, [post_id, dispatch, setLikedPeople, isUserLike]);

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
        console.log(field, value);
        dispatch(updatePawstory({
            slug: post.slug,
            data: {[field]: value}
        }));
    }

    const handleContentSave = () => {
        if (post?.content !== editedContent) {
            dispatch(updatePawstory({
                slug: post.slug,
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
        setEditedContent(post.content);
        setIsEditing(false);
    };

    const handleDeletePost = async () => {
        try {
            await dispatch(deletePawstory(slug)).unwrap();
            navigate(`/profile/${profile.user.usename}`);
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Failed to update Post",
                position: "top",
                toast: true,
                timer: 3000,
                showConfirmButton: false,
                customClass: {
                    popup: "swal-popup",
                },
            });
        }
    };

    const nextImage = () => {
        if (currentImageIndex < post.images.length - 1) {
            setCurrentImageIndex(currentImageIndex + 1);
        }
    };

    const prevImage = () => {
        if (currentImageIndex > 0) {
            setCurrentImageIndex(currentImageIndex - 1);
        }
    };

    const handleLike = async () => {
        const post_id = post.id
        try {
            const likePostResponse = await axiosInstance.post('socials/likepost/', { post_id })
            if (likePostResponse.status === 201) {
                setIsLiked(true)
            } else if (likePostResponse.status === 200) {
                setIsLiked(false)
            } else {
                setSnackbarMessage("Something went wrong. Try again.")
                setSnackbarAlertType("error")
                setSnackbarOpen(true)
            }
            fetchData(slug)
            isUserLike()
        } catch (error) {
            setSnackbarMessage("Something went wrong. Try again.")
            setSnackbarAlertType("error")
            setSnackbarOpen(true)
        }
    }

    const handleCommentAreaClose = () => {
        setShowComment(false)
        fetchData(slug)
    }

    const handlePostSave = async () => {
        try {
            await axiosInstance.post(`posts/savepost/${post_id}/`)
            fetchSavedUsers()
        } catch (error) {
            setSnackbarMessage("Unable to save post.")
            setSnackbarAlertType("error")
            setSnackbarOpen(true)
        }
    }

    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.href)
        setSnackbarMessage("Link copied to clipboard.")
        setSnackbarAlertType("success")
        setSnackbarOpen(true)
    }

    if (isLoading) {
        return (
            <div className="flex flex-col lg:flex-row gap-4 p-4">
                <div className="flex-shrink-0 w-full lg:w-1/2 relative">
                    <Shimmer className="w-full h-full lg:rounded-s-lg" />
                </div>
                <div className="flex-grow w-full flex flex-col justify-between my-2">
                    <div className="flex items-center justify-between my-2 mx-4">
                        <Shimmer className="h-10 w-10 rounded-full" />
                        <div className="flex flex-col">
                            <Shimmer className="h-4 w-32 mb-2" />
                            <Shimmer className="h-4 w-24" />
                        </div>
                        <Shimmer className="h-5 w-5" />
                    </div>
                    <Shimmer className="w-full h-12 mb-4" />
                    <div className="flex justify-between items-center">
                        <Shimmer className="w-1/2 h-6" />
                    </div>
                </div>
            </div>
        );
    }


    if (!post || !post.images || post.images.length === 0) {
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
                {/* Left Section: Image */}
                <div className="flex-shrink-0 w-full lg:w-1/2 relative">
                    {/* Display current image */}
                    <img
                        src={post.images[currentImageIndex].image}
                        alt={post.content}
                        className="w-full h-full lg:rounded-s-lg object-cover"
                    />

                    {/* Navigation buttons */}
                    {currentImageIndex > 0 && (
                        <button
                            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white p-3 rounded-full"
                            onClick={prevImage}
                            aria-label="Previous Image"
                        >
                            <svg
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                className="w-3 h-3"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M15 19l-7-7 7-7"
                                />
                            </svg>
                        </button>
                    )}
                    {currentImageIndex < post.images.length - 1 && (
                        <button
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white p-3 rounded-full"
                            onClick={nextImage}
                            aria-label="Next Image"
                        >
                            <svg
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                className="w-3 h-3"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M9 5l7 7-7 7"
                                />
                            </svg>
                        </button>
                    )}
                </div>

                {!showComment ? (
                    // Right Section: Content
                    <div className="flex-grow w-full flex flex-col justify-between my-2">
                        {/* User Info */}
                        <div>
                            <div className="flex items-center justify-between my-2 mx-4">
                                {/* Left Section: Profile and Date */}
                                <div className="flex items-center">
                                    <img
                                        src={post.user_profile.profile_picture || ""}
                                        alt={post.user_profile.user.username || "User"}
                                        className="w-10 h-10 rounded-full object-cover mr-3"
                                    />
                                    <div className="flex flex-col">
                                        <p className="text-lg text-gray-800 font-semibold">
                                            {post.user_profile.user.username || "Anonymous"}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {post.created_at
                                                ? new Date(post.created_at).toLocaleDateString("en-GB", {
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric",
                                                })
                                                : ""}
                                        </p>
                                    </div>
                                </div>

                                {/* Right Section: Dot Menu */}
                                <button
                                    className="flex items-center"
                                    aria-label="Dot-Menu"
                                    onClick={toggleModal}
                                >
                                    <img src={dotMenuIcon} alt="Dot-Menu" className="w-5" />
                                </button>
                            </div>

                            <hr className="mt-2" />
                            {/* Post Content */}
                            {isEditing ? (
                                <div className="relative m-4">
                                    {/* Done and Cancel Links */}
                                    <div className="flex justify-between items-center mb-2">
                                        <span
                                            onClick={handleCancel}
                                            className="text-gray-500 hover:text-gray-700 cursor-pointer text-sm"
                                        >
                                            Cancel
                                        </span>
                                        <span
                                            onClick={handleContentSave}
                                            className="text-gray-500 hover:text-gray-700 cursor-pointer text-sm"
                                        >
                                            Done
                                        </span>
                                    </div>

                                    {/* Editable Input Field */}
                                    <input
                                        id="post-content"
                                        name="content"
                                        type="text"
                                        value={editedContent}
                                        onChange={(e) => setEditedContent(e.target.value)}
                                        maxLength={100}
                                        className="w-full h-12 rounded-lg p-2 text-lg focus:outline-none"
                                        placeholder="Edit your post content..."
                                    />
                                </div>
                            ) : (
                                <div className="flex justify-between m-4 items-center">
                                    <h2 className="text-lg">{post.content}</h2>
                                    {isPostEdited && (
                                        <p className="text-xs text-gray-500">
                                            Edited on{" "}
                                            {new Date(post.updated_at).toLocaleDateString("en-GB", {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric",
                                            })}
                                        </p>
                                    )}
                                </div>                                
                            )}
                        </div>

                        {/* Action Icons */}
                        <div>
                            <hr />
                            <div className="flex flex-col gap-0 m-4">
                                <div className="flex items-center text-gray-600">
                                    <button
                                        className="flex items-center p-2 hover:bg-gray-200 rounded-full"
                                        aria-label="Like"
                                        onClick={handleLike}
                                    >
                                        {isLiked ? (
                                            <Heart size={19} fill='red' stroke='red' />
                                        )
                                        : (
                                            <Heart size={19} className="text-gray-500" />
                                        )}
                                    </button>
                                        {post?.like_count > 0 && !post?.hide_likes && (
                                            <p className="pe-4">{ post?.like_count }</p>
                                        )}
                                    {!post?.turn_off_comments && (
                                        <>
                                            <button
                                                className="flex items-center p-2 hover:bg-gray-200 rounded-full"
                                                aria-label="Comment"
                                                onClick={() => setShowComment(true)}
                                            >
                                                <MessageSquareText size={19} className="text-gray-500" />
                                            </button>
                                            {post?.comment_count > 0 && !post?.hide_comments && (
                                                <p className="pe-4">{post?.comment_count}</p>
                                            )   }
                                        </>
                                    )}
                                    <button
                                        className="flex items-center p-2 hover:bg-gray-200 rounded-full"
                                        aria-label="Save"
                                        onClick={handlePostSave}
                                    >
                                        {
                                            isSaved ? (
                                                <BookmarkCheck size={19} className="text-gray-500" />
                                            ) : (
                                                <Bookmark size={19} className="text-gray-500" />
                                            )
                                        }
                                    </button>
                                </div>
                                {likedPeople?.length > 0 && (
                                    <p className="ms-2 text-blackOpacity85">
                                        Liked by{" "}
                                        {likedPeople[0] === profile?.user?.username ? "you" : likedPeople[0]}
                                        {likedPeople?.length > 1 && (
                                            <>
                                                {post?.hide_likes 
                                                    ? ` and other${likedPeople.length - 1 > 1 ? 's' : ''}` 
                                                    : ` and ${likedPeople.length - 1} other${likedPeople.length - 1 > 1 ? 's' : ''}`}
                                            </>
                                        )}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <CommentArea onClose={handleCommentAreaClose} postId={post.id} post={post} />
                )}

            </div>

            {/* Reusable Modal */}
            <OptionsModal isOpen={isModalOpen} onClose={toggleModal}>
                {post?.user_profile.user.id === profile.user.id ? 
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
                                onClick={() => handlePostSettingsToggle('hide_likes', !post?.hide_likes)}
                            >
                                {post?.hide_likes ? 'Show Like Count' : 'Hide Like Count'}
                            </li>
                            <hr />
                            {!post?.turn_off_comments && (
                                <>
                                    <li
                                        className="hover:bg-gray-100 p-3 rounded cursor-pointer"
                                        onClick={() => handlePostSettingsToggle('hide_comments', !post?.hide_comments)}
                                    >
                                        {post?.hide_comments ? 'Show Comment Count' : 'Hide Comment Count'}
                                    </li>
                                </>
                            )}
                            <hr />
                            <li
                                className="hover:bg-gray-100 p-3 rounded cursor-pointer"
                                onClick={() => handlePostSettingsToggle('turn_off_comments', !post?.turn_off_comments)}
                            >
                                {post?.turn_off_comments ? 'Turn On Commenting' : 'Turn Off Commenting'}
                            </li>
                            <hr />
                            <li
                                className="hover:bg-gray-100 p-3 rounded cursor-pointer"
                                onClick={handleCopyLink}
                            >
                                Copy Link
                            </li>
                            <hr />
                        </ul>
                    ) : (
                        <ul className="text-center text-gray-700">
                            <li
                                className="hover:bg-gray-100 p-3 rounded cursor-pointer"
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
                        <p className="text-sm text-gray-500 py-2">Are you sure you want to delete this post?</p>
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

export default PostDisplayCard;
