import ProjectsContainer from '@/root/components/pages/projects/projects-container';
import ProjectsList from '@/root/components/pages/projects/projects-list';

export default function page() {
    return (
        <ProjectsContainer>
            <div className="flex flex-1 flex-col gap-4 p-4">
                <ProjectsList />
            </div>
        </ProjectsContainer>
    );
}
