import React, { useState } from "react";
import Calendar from "react-calendar";      
import "react-calendar/dist/Calendar.css";

const CalendarViewCard = () => {
    const [date, setDate] = useState(new Date());

    const onChange = (newDate) => setDate(newDate);

    return (
        <div className="bg-deepOceanBlue shadow-lg flex items-center justify-center rounded-3xl h-[362px] my-8 w-full">
            <div className="relative w-full h-full p-4">
                <Calendar
                    onChange={onChange}
                    value={date}
                    prevLabel="<"
                    nextLabel=">"
                    className="calendar-container text-white bg-deepOceanBlue border-0"
                    locale="en-US"
                />
            </div>
        </div>
    );
};

export default CalendarViewCard;
