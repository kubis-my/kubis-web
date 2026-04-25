import ProjectDetailContainer from '@/root/components/pages/project-detail/project-detail-container';
import ProjectDetailTabs from '@/root/components/pages/project-detail/project-detail-tabs';
import ProjectDetailContent from '@/root/components/pages/project-detail/project-detail-content';

export default function page() {
    return (
        <ProjectDetailContainer>
            <ProjectDetailTabs />
            <ProjectDetailContent />
        </ProjectDetailContainer>
    );
}
