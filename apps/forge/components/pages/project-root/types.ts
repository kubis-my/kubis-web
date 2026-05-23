export type ProjectStatus =
    | 'Pending Review'
    | 'Discovery'
    | 'MVP Build'
    | 'Validation'
    | 'Production'
    | 'On Hold'
    | 'Cancelled';

export type SubscriptionPlan = 'Maintenance' | 'Starter' | 'Growth' | 'Scale';

export type MilestoneStatus = 'Upcoming' | 'In Progress' | 'Done' | 'Cancelled';

export type Project = {
    id: string;
    name: string;
    clientName: string;
    status: ProjectStatus;
    startDate: string;
    plan?: SubscriptionPlan;
    unreadCount: number;
};
