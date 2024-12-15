/* eslint-disable @typescript-eslint/no-explicit-any */
const FormatDate = (dateString : any) => {
    if(!dateString) return
    const options: Intl.DateTimeFormatOptions = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true, // Use 12-hour format
      };
    const formattedDate = new Intl.DateTimeFormat('ar-US', options).format(new Date(dateString));
    return formattedDate;
  };
export default FormatDate