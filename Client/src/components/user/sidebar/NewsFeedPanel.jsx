import React from "react";
import textIcon from "../../../assets/icon/updates-sidebar/vaccination-calendar-icon.svg"

function NewsFeedPanel() {
    const dummyData = "Ensure your pet’s vaccinations are up to date, especially core ones like rabies and distemper for dogs and panleukopenia for cats."
    return (
        <div className="news-panel flex flex-col gap-2 my-5 overflow-hidden">
            <h2 className="text-sm font-medium text-blackOpacity85">Updates</h2>
            <hr className="border border-lightTextGreyOpacity30" />

            <div className="flex flex-col gap-7 h-[350px] py-2 px-1 overflow-y-auto">
                <div className="flex flex-row items-start gap-2">
                    <img src={textIcon} alt="test" className="w-9 h-9 mt-5 rounded-full object-cover" />
                    <div className="flex flex-col gap-1">
                        <h3 className="text-sm font-medium text-blackOpacity85">Title</h3>
                        <p className="text-xs text-blackOpacity70">{dummyData}</p>
                    </div>
                </div>

                <div className="flex flex-row items-start gap-2">
                    <img src={textIcon} alt="test" className="w-9 h-9 mt-5 rounded-full object-cover" />
                    <div className="flex flex-col gap-1">
                        <h3 className="text-sm font-medium text-blackOpacity85">Title</h3>
                        <p className="text-xs text-blackOpacity70">{dummyData}</p>
                    </div>
                </div>

                <div className="flex flex-row items-start gap-2">
                    <img src={textIcon} alt="test" className="w-9 h-9 mt-5 rounded-full object-cover" />
                    <div className="flex flex-col gap-1">
                        <h3 className="text-sm font-medium text-blackOpacity85">Title</h3>
                        <p className="text-xs text-blackOpacity70">{dummyData}</p>
                    </div>
                </div>

                <div className="flex flex-row items-start gap-2">
                    <img src={textIcon} alt="test" className="w-9 h-9 mt-5 rounded-full object-cover" />
                    <div className="flex flex-col gap-1">
                        <h3 className="text-sm font-medium text-blackOpacity85">Title</h3>
                        <p className="text-xs text-blackOpacity70">{dummyData}</p>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default NewsFeedPanel