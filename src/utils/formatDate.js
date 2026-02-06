export function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffMS = now - date;
    const diffMins = Math.floor(diffMS / (1000 * 60));
    const diffHours = Math.floor(diffMS / (1000 * 60 * 60));

    if (diffMins >= 0 && diffMins < 2) return `방금 전`;
    if (diffMins >= 2 && diffMins < 60) return `${diffMins}분 전`;
    if (diffHours >= 0 && diffHours < 12) return `${diffHours}시간 전`;

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHour = String(hours % 12 || 12).padStart(2, '0');

    return `${year}.${month}.${day} ${formattedHour}:${minutes} (${ampm})`;
}
