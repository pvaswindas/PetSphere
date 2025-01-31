export const formatTime = (timeString) => {
    if (!timeString) return '';

    const date = new Date(timeString);
    const now = new Date();

    const isToday =
        date.getDate() === now.getDate() &&
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear();

    // Format hours and minutes
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const formattedHours = hours % 12 || 12;
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedMinutes = minutes.toString().padStart(2, '0');

    if (isToday) {
        return `${formattedHours}:${formattedMinutes} ${ampm}`;
    } else {
        const options = { month: 'short', day: '2-digit', year: 'numeric' };
        const formattedDate = date.toLocaleDateString('en-US', options).replace(',', '');
        return `${formattedDate} at ${formattedHours}:${formattedMinutes} ${ampm}`;
    }
};
