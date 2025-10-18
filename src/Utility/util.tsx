// get Current time

export const getCurrentTime = () => {
    const date = new Date();
    const hour = date.getHours();
    const minutes = date.getMinutes();

    const hour12 = hour % 12 || 12 //midnight: 0 becomes 12
    const minutesPadded = minutes.toString().padStart(2, '0'); // will make 1:5 to 1:05

    if ( hour >= 12) {
        return `${hour12}:${minutesPadded} PM`
    } else {
        return `${hour12}:${minutesPadded} AM`
    }
}