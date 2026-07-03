import NewProjectContainer from '@/root/components/pages/new-project/new-project-container';
import NewProjectForm from '@/root/components/pages/new-project/new-project-form';

export default function page() {
    return (
        <NewProjectContainer>
            <div className="flex flex-1 flex-col gap-4 p-4">
                <NewProjectForm />
            </div>
        </NewProjectContainer>
    );
}
