import ProjectsContainer from '@/root/components/pages/project-root/projects-container';
import ProjectsList from '@/root/components/pages/project-root/projects-list';

export default function Page() {
    return (
        <ProjectsContainer>
            <div className="flex flex-1 flex-col gap-4 p-4">
                <ProjectsList />
            </div>
        </ProjectsContainer>
    );
}
