import React from 'react'
import { MoreVertical, BookmarkCheck, Bookmark, MessageSquareText, Heart } from 'lucide-react'
import userAvatar from "../../../assets/profile-testing/bao-menglong-usTb7ZMa6QI-unsplash.jpg"
import { formatTime } from '../../../utils/formatTime';

function pwcard({ story = [] }) {
    console.log("STORY : ", story);
    return (
        <div className='flex flex-col lg:p-4 bg-white lg:rounded-2xl h-[34rem] lg:shadow-lg gap-3'>
            <div className='px-1 lg:px-0 flex items-center justify-between'>
                <div className='flex justify-between items-center gap-2'>
                    <div className='relative'>
                        <img 
                            src={
                                story?.user_profile.profile_picture ? story?.user_profile.profile_picture : userAvatar
                            }
                            alt="" 
                            className='w-11 h-11 rounded-full object-cover ring-2 ring-teal-400' 
                        />
                    </div>
                    <div>
                        <h2 className='text-md font-medium'>
                            {story?.user_profile.user.username}
                        </h2>
                        <p className='text-[0.7rem]'>
                            {story && formatTime(story.created_at)}
                        </p>
                    </div>
                </div>
                <MoreVertical size={20} />
            </div>

            <div className='px-1 lg:px-0'>
                <p className='text-sm truncate'>
                    {story?.content}
                </p>
            </div>

            <div className='lg:rounded-lg overflow-hidden aspect-square lg:aspect-auto'>
                <img src={story.images[0].image} alt=""  className='w-full h-full object-cover'/>
            </div>
            <hr className='hidden lg:flex' />
            <div className='flex gap-1'>
                <>
                    <button
                        className="flex items-center hover:bg-gray-200 p-2 rounded-full"
                        aria-label="Like"
                    >
                        <Heart size={18} fill='red' stroke='red'/>
                    </button>
                    <button
                        className="flex items-center hover:bg-gray-200 p-2 rounded-full"
                        aria-label="Comment"
                    >
                        <MessageSquareText size={18}  className='text-gray-600'/>
                    </button>
                    <button
                        className="flex items-center hover:bg-gray-200 p-2 rounded-full"
                        aria-label="Save"
                    >
                        <Bookmark size={18} className="text-gray-600" />
                    </button>
                </>
            </div>
        </div>
    )
}

export default pwcard