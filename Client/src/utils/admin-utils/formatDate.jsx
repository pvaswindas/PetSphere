export const formatDate = (dateString) => {
    const date = new Date(dateString)

    // Format the date
    const day = date.getDate()
    const month = date.toLocaleString('en-GB', { month: 'short' })
    const year = date.getFullYear()

    return `${month}, ${day} ${year}`
}

export const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);

    // Format the date
    const day = date.getDate();
    const month = date.toLocaleString('en-GB', { month: 'short' });
    const year = date.getFullYear();

    // Format the time
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const formattedHours = hours % 12 || 12;
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedMinutes = minutes.toString().padStart(2, '0');

    return `${month}, ${day} ${year} at ${formattedHours}:${formattedMinutes} ${ampm}`;
};


export const formatDMY = (isoString) => {
    const dateObj = new Date(isoString);
    
    const day = dateObj.getUTCDate();
    const month = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(dateObj);
    const year = dateObj.getUTCFullYear();
    
    return { day, month, year };
};


function formatTimeString(years, months, days) {
    let parts = [];

    if (years > 0) {
        parts.push(`${years} Year${years > 1 ? 's' : ''}`);
    }
    if (months > 0) {
        parts.push(`${months} Month${months > 1 ? 's' : ''}`);
    }
    if (days > 0) {
        parts.push(`${days} Day${days > 1 ? 's' : ''}`);
    }

    return parts.join(', ');
}


export const timeElapsed = (isoString) => {
    const pastDate = new Date(isoString);
    const currentDate = new Date();
    
    let years = currentDate.getUTCFullYear() - pastDate.getUTCFullYear();
    let months = currentDate.getUTCMonth() - pastDate.getUTCMonth();
    let days = currentDate.getUTCDate() - pastDate.getUTCDate();
    
    if (days < 0) {
        months--;
        days += new Date(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), 0).getUTCDate();
    }
    
    if (months < 0) {
        years--;
        months += 12;
    }

    const timeString = formatTimeString(years, months, days)

    return timeString;
};