import React, { useState } from "react";
import Calendar from "react-calendar";      
import "react-calendar/dist/Calendar.css";

const CalendarViewCard = () => {
    const [date, setDate] = useState(new Date());

    const onChange = (newDate) => setDate(newDate);

    return (
        <div className="bg-deepOceanBlue shadow-lg p-6 flex items-center justify-center rounded-3xl h-[335px] w-full">
            <div className="relative w-full h-full">
                <Calendar
                    onChange={onChange}
                    value={date}
                    prevLabel="<"
                    nextLabel=">"
                    calendarClassName="bg-deepOceanBlue text-white hover:text-white"
                    className="calendar-container text-white bg-deepOceanBlue border-0 hover:text-white"
                    locale="en-US"
                    tileClassName={({ date, view }) =>
                        "transition duration-200 rounded-md hover:bg-midnightBlue text-white hover:text-white"
                    }                    
                />
            </div>
        </div>
    );
};

export default CalendarViewCard;
