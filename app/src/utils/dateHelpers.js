/**
 * Check if a date string is in the past (before today in PST timezone)
 * @param {string} dateStr - Date string in format 'YYYY-MM-DD'
 * @returns {boolean} - True if the date is before today, false otherwise
 */
export const isPastDate = (dateStr) => {
    // Get today's date in PST
    const today = new Date();
    const pstDate = new Date(today.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }));
    // Reset time to midnight for comparison
    pstDate.setHours(0, 0, 0, 0);
    
    // Parse the date string
    const [year, month, day] = dateStr.split('-');
    const checkDate = new Date(year, month - 1, day);
    
    return checkDate < pstDate;
};
