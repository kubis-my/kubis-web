import ProjectThreads from '@/root/components/pages/project-detail/project-threads';

export default function page() {
    return (
        <div className="flex h-[calc(100svh-var(--header-height))] min-h-0 shrink-0 flex-col overflow-hidden md:h-[calc(100svh-var(--header-height)-1rem)]">
            <ProjectThreads />
        </div>
    );
}
