import React from "react"
import editIcon from "../../assets/admin/commonIcons/edit-icon.svg"
import deleteIcon from "../../assets/admin/commonIcons/delete-icon.svg"
import FlexiCard from "./FlexiCard"

const PetList = ({ data, handleEdit, handleDelete, type, title, description }) => {
    const limitedData = data?.slice().reverse().slice(0, 4)

    return (
        <FlexiCard
            title={title}
            description={description}
        >
            {data?.length === 0 ? (
                <p className="text-center text-sm mt-40 text-darkDenimBlue">No {type} available.</p>
            ) : (
                <div className="relative">
                    <ul className="space-y-4 my-4">
                        {limitedData?.map((item, index) => (
                            <React.Fragment key={item.id}>
                                <li className="flex items-center justify-between">
                                    {/* Left side: Image and Name */}
                                    <div className="flex items-center space-x-4">
                                        {type !== 'pet breed' && (
                                            <img 
                                                src={item.icon} 
                                                alt={`${item.name} icon`} 
                                                className="w-10 h-10 rounded-full object-contain border border-gray-300"
                                            />
                                        )}
                                        <div>
                                            <p className="font-medium text-sm">{item.name}</p>
                                            <p className="text-xs text-gray-500 max-w-[222px] break-words">
                                                {item.description}
                                            </p>
                                        </div>
                                    </div>
                                    {/* Right side: Edit and Delete Buttons */}
                                    <div className="flex space-x-2">
                                        <button onClick={() => handleEdit(item.id)}>
                                            <img src={editIcon} alt="edit" className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => handleDelete(item.id)}>
                                            <img src={deleteIcon} alt="delete" className="w-4 h-4" />
                                        </button>
                                    </div>
                                </li>
                                {index !== limitedData.length - 1 && <hr className="my-2 border-gray-300" />}
                            </React.Fragment>
                        ))}
                    </ul>
                    {data?.length > 4 && (
                    <button
                        className="absolute bottom-[-1rem] py-2 lg:py-0 right-4 text-blue-500 text-sm font-medium hover:underline focus:outline-none"
                        onClick={() => console.log("View All clicked")}
                    >
                        View All
                    </button>
                    )}
                </div>
            )}
        </FlexiCard>
    )
}

export default PetList
