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
