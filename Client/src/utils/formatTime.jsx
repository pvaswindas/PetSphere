export const formatTime = (timeString, trimmedVersion=false) => {
    if (!timeString) return '';

    const date = new Date(timeString);
    const now = new Date();

    const isToday =
        date.getDate() === now.getDate() &&
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear();

    const isThisYear = date.getFullYear() === now.getFullYear()

    // Format hours and minutes
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const formattedHours = hours % 12 || 12;
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedMinutes = minutes.toString().padStart(2, '0');

    if (isToday) {
        return `${formattedHours}:${formattedMinutes} ${ampm}`;
    } else {
        const options = isThisYear
            ? { month: 'short', day: '2-digit' }
            : { month: 'short', day: '2-digit', year: 'numeric' };
        const formattedDate = date.toLocaleDateString('en-US', options).replace(',', '');
        if (trimmedVersion) {
            return `${formattedDate}`
        } else {
            return `${formattedDate} at ${formattedHours}:${formattedMinutes} ${ampm}`;
        }
    }
};


export const formatDateTime = (timeString) => {
    if (!timeString) return '';

    // Extract parts using regex
    const match = timeString.match(/([A-Za-z]+), (\d{2}) (\d{4}) at (\d{2}):(\d{2}) (AM|PM)/);
    if (!match) return 'Invalid Date';

    const [, month, day, year, hours, minutes, ampm] = match;

    // Convert month to numerical index
    const months = {
        Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
        Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
    };

    // Convert to 24-hour format
    let hour = parseInt(hours, 10);
    if (ampm === 'PM' && hour !== 12) hour += 12;
    if (ampm === 'AM' && hour === 12) hour = 0;

    // Create Date object
    const date = new Date(year, months[month], day, hour, minutes);
    const now = new Date();

    // Format time
    const formattedHours = (date.getHours() % 12) || 12;
    const formattedMinutes = date.getMinutes().toString().padStart(2, '0');
    const formattedAmpm = date.getHours() >= 12 ? 'PM' : 'AM';

    const isToday =
        date.getDate() === now.getDate() &&
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear();

    return isToday
        ? `${formattedHours}:${formattedMinutes} ${formattedAmpm}`
        : `${month} ${day} ${year} at ${formattedHours}:${formattedMinutes} ${formattedAmpm}`;
};


export const formatNumber = (num) => {
    if (num < 1000) return num.toString();
    if (num < 1_000_000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + "K";
    if (num < 1_000_000_000) return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + "M";
    return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + "B";
};