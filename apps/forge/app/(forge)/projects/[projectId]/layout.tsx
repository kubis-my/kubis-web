import ProjectDetailContainer from '@/root/components/pages/project-detail/project-detail-container';

export default function layout({ children }: Readonly<{ children: React.ReactNode }>) {
    return <ProjectDetailContainer>{children}</ProjectDetailContainer>;
}
