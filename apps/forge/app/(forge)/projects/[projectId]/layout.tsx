import DashboardContainer from '@/root/components/container/dashboard-container';
import ProjectDetailContainer from '@/root/components/pages/project-detail/project-detail-container';
import { APP_NAME, navigationUserItemList } from '@/root/libs/dashboard-data';
import { DashboardProvider } from '@/shadcn/dashboards/dashboard-01';

export default function layout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <DashboardProvider
            navigations={[]}
            userCardItems={navigationUserItemList}
            appName={APP_NAME}
        >
            <DashboardContainer>
                <ProjectDetailContainer>{children}</ProjectDetailContainer>
            </DashboardContainer>
        </DashboardProvider>
    );
}
