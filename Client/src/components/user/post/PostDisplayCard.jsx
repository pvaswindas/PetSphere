import React, { memo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import commentIcon from "../../../assets/icon/post/comment-icon.svg";
import saveIcon from "../../../assets/icon/post/post-save-icon.svg";
import likeIcon from "../../../assets/icon/post/like-icon.svg";
import dotMenuIcon from "../../../assets/icon/post/dot-menu-icon.svg";
import { deletePawstory, fetchPawstory, updatePawstory } from "../../../redux/thunks/PostThunk";
import PostOptionsModal from "./PostOptionsModal";
import Swal from "sweetalert2";

const PostDisplayCard = memo(() => {
    const { slug } = useParams();
    const dispatch = useDispatch();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setDeleteIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState("");
    const [currentImageIndex, setCurrentImageIndex] = useState(0); // Track the current image index

    useEffect(() => {
        if (slug) {
            dispatch(fetchPawstory(slug));
        }
    }, [slug, dispatch]);

    const post = useSelector((state) => state.posts?.currentPawstory || null);
    const profile = useSelector((state) => state.profile?.profile_data || null);
    const navigate = useNavigate();

    useEffect(() => {
        if (post) {
            setEditedContent(post.content);
        }
    }, [post]);

    if (!post || !post.images || post.images.length === 0) {
        return (
            <div className="w-full h-64 flex items-center justify-center rounded-lg">
                <p className="text-gray-500">Post not found</p>
            </div>
        );
    }

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

    const handleSave = () => {
        if (post?.content !== editedContent) {
            dispatch(updatePawstory({ slug: post.slug, content: editedContent }));
        }
        setEditedContent(" ");
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditedContent(post.content);
        setIsEditing(false);
    };

    const handleDeletePost = async () => {
        try {
            await dispatch(deletePawstory(slug)).unwrap();
            navigate(-1);
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

    return (
        <>
            <div className="bg-white lg:shadow-lg w-full rounded-lg flex flex-col lg:flex-row">
                {/* Left Section: Image */}
                <div className="flex-shrink-0 w-full lg:w-1/2 relative">
                    {/* Display current image */}
                    <img
                        src={post.images[currentImageIndex].image}
                        alt={post.content}
                        className="w-full h-full rounded-s-lg object-cover"
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

                {/* Right Section: Content */}
                <div className="flex-grow w-full flex flex-col justify-between my-2">
                    {/* User Info */}
                    <div>
                        <div className="flex items-center justify-between my-2 mx-4">
                            {/* Left Section: Profile and Date */}
                            <div className="flex items-center">
                                <img
                                    src={profile.profile_picture || ""}
                                    alt={profile.user.username || "User"}
                                    className="w-10 h-10 rounded-full object-cover mr-3"
                                />
                                <div className="flex flex-col">
                                    <p className="text-lg text-gray-800 font-semibold">
                                        {profile.user.username || "Anonymous"}
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
                                        onClick={handleSave}
                                        className="text-gray-500 hover:text-gray-700 cursor-pointer text-sm"
                                    >
                                        Done
                                    </span>
                                </div>

                                {/* Editable Input Field */}
                                <input
                                    type="text"
                                    value={editedContent}
                                    onChange={(e) => setEditedContent(e.target.value)}
                                    maxLength={100}
                                    className="w-full h-12 rounded-lg p-2 text-lg focus:outline-none"
                                    placeholder="Edit your post content..."
                                />
                            </div>
                        ) : (
                            <h2 className="text-lg m-4">{post.content}</h2>
                        )}
                    </div>

                    {/* Action Icons */}
                    <div>
                        <hr />
                        <div className="flex items-center gap-6 m-4 text-gray-600">
                            <button
                                className="flex items-center gap-1 p-2 bg-gray-100 hover:bg-gray-200 rounded-full"
                                aria-label="Like"
                            >
                                <img src={likeIcon} alt="Like" className="w-5" />
                            </button>
                            <button
                                className="flex items-center gap-1 p-1 bg-gray-100 hover:bg-gray-200 rounded-full"
                                aria-label="Comment"
                            >
                                <img src={commentIcon} alt="Comment" className="w-7" />
                            </button>
                            <button
                                className="flex items-center gap-1 p-1 bg-gray-100 hover:bg-gray-200 rounded-full"
                                aria-label="Save"
                            >
                                <img src={saveIcon} alt="Save" className="w-7" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Reusable Modal */}
            <PostOptionsModal isOpen={isModalOpen} onClose={toggleModal}>
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
                    <li className="hover:bg-gray-100 p-3 rounded cursor-pointer">
                        Turn On Commenting
                    </li>
                    <hr />
                    <li className="hover:bg-gray-100 p-3 rounded cursor-pointer">
                        Hide Like Count
                    </li>
                    <hr />
                    <li
                        className="hover:bg-gray-100 p-3 rounded cursor-pointer"
                        onClick={() => navigator.clipboard.writeText(window.location.href)}
                    >
                        Copy Link
                    </li>
                    <hr />
                </ul>
            </PostOptionsModal>

            <PostOptionsModal isOpen={isDeleteModalOpen} onClose={handleBothToggle} width="w-72 lg:w-80">
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
            </PostOptionsModal>
        </>
    );
});

export default PostDisplayCard;
