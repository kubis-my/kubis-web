import NewProjectContainer from '@/root/components/pages/new-project/new-project-container';
import NewProjectForm from '@/root/components/pages/new-project/new-project-form';

export default function page() {
    return (
        <NewProjectContainer>
            <div className="flex flex-1 flex-col p-4 md:p-8">
                <NewProjectForm />
            </div>
        </NewProjectContainer>
    );
}
