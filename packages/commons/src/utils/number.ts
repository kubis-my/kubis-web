export const formatCount = (count: number, max = 99): string => {
    return count > max ? `${max}+` : String(count);
};
