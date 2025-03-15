import userAvatar from "../../../assets/icon/user-avatar.svg"
import dotMenuIcon from "../../../assets/icon/post/dot-menu-icon.svg";

export const PostHeader = ({ post, toggleModal, isScreenLarger=false }) => {
    return (
        <div className={`flex items-center justify-between my-2 mx-4 ${isScreenLarger ? 'hidden lg:flex' : 'flex lg:hidden'}`}>
            {/* Left Section: Profile and Date */}
            <div className="flex items-center">
                <img
                    src={post.user_profile.profile_picture || userAvatar}
                    alt={post.user_profile.user.username || "User"}
                    className="w-10 h-10 rounded-full object-cover mr-3"
                />
                <div className="flex flex-col">
                    <p className="text-gray-800 font-semibold">
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
    )
}