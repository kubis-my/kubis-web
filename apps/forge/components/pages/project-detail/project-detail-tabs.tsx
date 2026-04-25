'use client';

import { useProjectDetail, type ProjectTab } from './project-detail-container';
import { cn } from '@repo/shadcn-ui/lib/utils';

const TABS: { id: ProjectTab; label: string }[] = [
    { id: 'brief', label: 'Brief' },
    { id: 'milestones', label: 'Milestones' },
    { id: 'discussion', label: 'Threads' },
    { id: 'todos', label: 'Todos' },
    { id: 'billing', label: 'Billing' },
];

export default function ProjectDetailTabs() {
    const { activeTab, setActiveTab } = useProjectDetail();

    return (
        <div className="border-b px-4">
            <nav className="-mb-px flex">
                {TABS.map((tab) => (
                    <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                            'border-b-2 px-4 py-2.5 text-sm font-medium transition-colors',
                            activeTab === tab.id
                                ? 'border-foreground text-foreground'
                                : 'border-transparent text-muted-foreground hover:text-foreground',
                        )}
                    >
                        {tab.label}
                    </button>
                ))}
            </nav>
        </div>
    );
}
