export function getInitials(name?: string | null, fallback = 'U'): string {
    const initials = (name ?? '')
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join('');

    return initials || fallback;
}
