import { OverviewCard } from './overview-card';
import { ProjectDataTable } from './data-table';

export default function ProjectsList() {
    return (
        <>
            <div className="grid auto-rows-min grid-cols-2 gap-4 xl:grid-cols-3">
                <OverviewCard />
            </div>
            <div className="min-h-screen flex-1 rounded-xl md:min-h-min">
                <ProjectDataTable />
            </div>
        </>
    );
}
