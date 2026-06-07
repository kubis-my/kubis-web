export const truncateWord = (value: string, start = 12, end = 6) => {
    if (!value) return '-';
    if (value.length <= start + end) return value;

    return `${value.slice(0, start)}...${value.slice(-end)}`;
};
