import React from "react";
import textIcon from "../../../assets/icon/updates-sidebar/vaccination-calendar-icon.svg";

function NewsFeedPanel() {
    const updates = [
        {
            title: "Vaccination Reminder",
            description: "Ensure your pet’s vaccinations are up to date, especially core ones like rabies and distemper for dogs and panleukopenia for cats."
        },
        {
            title: "New Adoption Center",
            description: "A new pet adoption center has opened in your area! Visit today to find your perfect furry friend."
        },
        {
            title: "Grooming Tips",
            description: "Regular grooming helps keep your pet healthy and happy. Brush your pet’s fur daily to prevent matting and skin issues."
        }
    ];

    return (
        <div className="news-panel flex flex-col gap-2 my-5 overflow-hidden">
            <h2 className="text-sm font-medium text-blackOpacity85">Updates</h2>
            <hr className="border border-lightTextGreyOpacity30" />

            <div className="flex flex-col gap-7 h-[350px] py-2 px-1 overflow-y-auto">
                {updates.map((update, index) => (
                    <div key={index} className="flex flex-row items-start gap-2">
                        <img src={textIcon} alt="icon" className="w-9 h-9 mt-5 rounded-full object-cover" />
                        <div className="flex flex-col gap-1">
                            <h3 className="text-sm font-medium text-blackOpacity85">{update.title}</h3>
                            <p className="text-xs text-blackOpacity70">{update.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default NewsFeedPanel;
