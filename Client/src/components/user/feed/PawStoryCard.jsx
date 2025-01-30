import React from 'react'
import { MoreVertical, BookmarkCheck, Bookmark, MessageSquareText, Heart } from 'lucide-react'
import testimage from "../../../assets/profile-testing/bao-menglong-usTb7ZMa6QI-unsplash.jpg"
import testimage1 from "../../../assets/profile-testing/macaw-giovanna-gomes-5s_n82D4yAo-unsplash.jpg"

function PawStoryCard() {
    return (
        <div className='flex flex-col lg:p-4 bg-white lg:rounded-2xl h-[29rem] shadow-lg gap-4'>
            <div className='px-1 lg:px-0 flex items-center justify-between'>
                <div className='flex justify-between items-center gap-2'>
                    <div className='w-11 h-11 rounded-full overflow-hidden'>
                        <img src={testimage} alt="" className='w-full h-full object-cover' />
                    </div>
                    <div>
                        <h2 className='text-md font-medium'>Alex Freeman</h2>
                        <p className='text-[0.7rem]'>01 Nov at 1:45 PM</p>
                    </div>
                </div>
                <MoreVertical size={20} />
            </div>

            <div className='px-1 lg:px-0'>
                <p className='text-sm'>Paw Story</p>
            </div>

            <div className='lg:rounded-lg overflow-hidden lg:w-full lg:h-60 aspect-square lg:aspect-auto'>
                <img src={testimage1} alt=""  className='w-full h-full object-cover'/>
            </div>
            <hr className='hidden lg:flex my-2' />
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

export default PawStoryCard