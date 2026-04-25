'use client';

import { useProjectDetail } from './project-detail-container';
import ProjectBrief from './project-brief';

export default function ProjectDetailContent() {
    const { activeTab } = useProjectDetail();

    return (
        <div className="flex flex-1 flex-col p-4 md:p-8">
            {activeTab === 'brief' && <ProjectBrief />}
            {activeTab !== 'brief' && (
                <p className="text-sm text-muted-foreground">Coming soon.</p>
            )}
        </div>
    );
}
