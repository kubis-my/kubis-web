import ConsoleFooter from '@/root/components/console-footer';
import ProjectsContainer from '@/root/components/pages/project-root/projects-container';
import ProjectsList from '@/root/components/pages/project-root/projects-list';

export default function Page() {
    return (
        <ProjectsContainer>
            <div className="flex min-h-screen flex-col">
                <div className="flex-1">
                    <div className="p-4 md:p-6">
                        <div className="mx-auto w-full max-w-7xl">
                            <ProjectsList />
                        </div>
                    </div>
                </div>
                <ConsoleFooter />
            </div>
        </ProjectsContainer>
    );
}
