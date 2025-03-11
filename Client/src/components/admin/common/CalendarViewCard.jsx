import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const CalendarViewCard = () => {
    const [date, setDate] = useState(new Date());

    const onChange = (newDate) => setDate(newDate);

    return (
        <div className="bg-deepOceanBlue shadow-lg flex items-center justify-center rounded-3xl h-[335px] w-full">
            <div className="flex justify-center items-center w-full">
                <Calendar
                    onChange={onChange}
                    value={date}
                    prevLabel="<"
                    nextLabel=">"
                    className="text-white bg-transparent border-0 p-4 rounded-lg"
                    locale="en-US"
                    tileClassName="transition duration-200 rounded-md hover:bg-midnightBlue text-white"
                />
            </div>
        </div>
    );
};

export default CalendarViewCard;
