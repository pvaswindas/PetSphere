import React from 'react'
import { MoreVertical, BookmarkCheck, Bookmark, MessageSquareText, Heart } from 'lucide-react'
import userAvatar from "../../../assets/profile-testing/bao-menglong-usTb7ZMa6QI-unsplash.jpg"
import { formatTime } from '../../../utils/formatTime';

function PawStoryCard({ story = [] }) {
    console.log("STORY : ", story);
    return (
        <div className='relative bg-white lg:rounded-2xl h-[29rem] shadow-lg overflow-hidden'>
            <img
                src={story?.images[0].image}
                alt=""
                className='w-full h-full object-cover lg:rounded-2xl'
            />
            <div className='absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/30 to-transparent'>
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
                            <h2 className='text-md text-white font-medium'>
                                {story?.user_profile.user.username}
                            </h2>
                            <p className='text-[0.7rem] text-white/80'>
                                {story && formatTime(story.created_at)}
                            </p>
                        </div>
                    </div>
                    <MoreVertical size={20} color='white' />
                </div>
            </div>
            <div className='absolute bottom-3 right-3'>
                <div className='flex flex-col gap-4'>
                    <button className='flex justify-center items-center w-10 h-10 hover:bg-white/50 text-black/60 hover:text-black/80 bg-gradient-to-br from-white/60 to-transparent rounded-full'>
                        <Heart size={17} />
                    </button>
                    <button className='flex justify-center items-center w-10 h-10 hover:bg-white/50 text-black/60 hover:text-black/80 bg-gradient-to-br from-white/60 to-transparent rounded-full'>
                        <MessageSquareText size={17} />
                    </button>
                    <button className='flex justify-center items-center w-10 h-10 hover:bg-white/50 text-black/60 hover:text-black/80 bg-gradient-to-br from-white/60 to-transparent rounded-full'>
                        <Bookmark size={17} />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default PawStoryCard