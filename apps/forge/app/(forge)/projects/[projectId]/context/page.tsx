import ProjectContext from '@/root/components/pages/project-detail/project-context';

export default function page() {
    return (
        <div className="flex flex-1 flex-col px-4 pt-2 pb-4 md:px-8 md:pt-4 md:pb-8">
            <ProjectContext />
        </div>
    );
}
