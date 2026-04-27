import NewProjectContainer from '@/root/components/pages/new-project/new-project-container';
import NewProjectForm from '@/root/components/pages/new-project/new-project-form';
import ConsoleFooter from '@/root/components/console-footer';

export default function page() {
    return (
        <NewProjectContainer>
            <div className="flex min-h-screen flex-col">
                <div className="flex-1 p-4 md:p-8">
                    <NewProjectForm />
                </div>
                <ConsoleFooter />
            </div>
        </NewProjectContainer>
    );
}
