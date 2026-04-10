export function scrollToSection(e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) {
    e.preventDefault();
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
}
