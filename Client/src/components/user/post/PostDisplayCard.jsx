import React, { memo, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { deletePawstory, fetchPawstory, updatePawstory } from "../../../redux/thunks/PostThunk";
import Swal from "sweetalert2";
import axiosInstance from "../../../axios/axiosinstance";
import AlertSnackbar from "../../Snackbar/AlertSnackbar";
import { fetchLikedUsers } from "../../../redux/thunks/FetchLikedUsers";
import { CommentArea } from "../CommentArea/CommentArea";
import { Send, Heart, MessageSquareText } from "lucide-react";
import OptionsModal from "../../common/OptionsModal";
import Shimmer from "../../Shimmer/Shimmer";
import { ContentArea } from "./ContentArea";
import { PostHeader } from "./PostHeader";
import EditContentArea from "./EditContentArea";

const   PostDisplayCard = memo(() => {
    const { slug } = useParams();
    const dispatch = useDispatch();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setDeleteIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState("");
    const [isLiked, setIsLiked] = useState(false)
    const [likedPeople, setLikedPeople] = useState([])
    const [showComment, setShowComment] = useState(false)


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
            return
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

    // const handlePostSave = async () => {
    //     try {
    //         await axiosInstance.post(`posts/savepost/${post_id}/`)
    //         fetchSavedUsers()
    //     } catch (error) {
    //         setSnackbarMessage("Unable to save post.")
    //         setSnackbarAlertType("error")
    //         setSnackbarOpen(true)
    //     }
    // }

    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.href)
        setSnackbarMessage("Link copied to clipboard.")
        setSnackbarAlertType("success")
        setSnackbarOpen(true)
    }

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



    if ((!post || !post.images || post.images.length === 0)  && !isLoading) {
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

                <PostHeader post={post} toggleModal={toggleModal} />

                <ContentArea post={post} />

                {!showComment ? (
                    // Right Section: Content
                    <div className="flex-grow w-full flex flex-col justify-between">
                        {/* User Info */}
                        <div className="m-0 p-0">

                            <PostHeader post={post} toggleModal={toggleModal} isScreenLarger={true} />

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
                                    <h2>{post.content}</h2>
                                    {/* {isPostEdited && (
                                        <p className="text-xs text-gray-500">
                                            Edited on{" "}
                                            {new Date(post.updated_at).toLocaleDateString("en-GB", {
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
                                        onClick={handleCopyLink}
                                    >
                                        <Send size={19} className="text-gray-500" />
                                    </button>
                                </div>
                                {likedPeople?.length > 0 && (
                                    <p className="ms-2 text-sm text-blackOpacity70">
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
                            <h2 className="px-5 lg:hidden">{post.content}</h2>
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
