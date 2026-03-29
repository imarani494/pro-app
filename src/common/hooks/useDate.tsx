export const useDate = (date: Date | string) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  // Check if date is valid
  if (isNaN(dateObj?.getTime())) {
    console.warn('Invalid date:', date);
    return typeof date === 'string' ? date : 'Invalid Date';
  }

  return dateObj.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export function formatTime(timeString: string) {
  const date = new Date(timeString?.replace(' ', 'T')); // ensure valid Date format

  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12;
  hours = hours ? hours : 12; // 0 → 12

  return `${hours}:${minutes} ${ampm}`;
}
