import React from 'react';

const ProfileFeedSelection = ({ selectedOption, onSelectOption }) => {
    const options = ['PawStories', 'PetListings', 'PetPals', 'Friends', 'Badges'];

    return (
        <div className="lg:px-8">
            <div className="flex md:inline-flex text-xs lg:text-sm lg:bg-lightTextGreyOpacity20 lg:rounded-lg overflow-x-auto md:overflow-visible whitespace-nowrap md:whitespace-normal items-center px-2">
                {options.map((option) => (
                    <div
                        key={option}
                        className={`cursor-pointer py-1 px-6 lg:px-4 lg:rounded-md text-center transition-all duration-300 flex-shrink-0 
                        ${selectedOption === option ? 'lg:bg-white border-b-4 border-lightTextGreyOpacity30 lg:border-0 my-1' : ''}`}
                        onClick={() => onSelectOption(option)}
                    >
                        <span
                            className={`block ${
                                selectedOption === option
                                    ? 'text-transparent bg-clip-text bg-og-gradient'
                                    : 'text-blackOpacity85'
                            }`}
                        >
                            {option}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProfileFeedSelection
