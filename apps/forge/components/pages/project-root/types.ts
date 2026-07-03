export type ProjectStatus =
    | 'Pending Review'
    | 'Discovery'
    | 'MVP Build'
    | 'Validation'
    | 'Production'
    | 'On Hold'
    | 'Cancelled';

export type MilestoneStatus = 'Upcoming' | 'In Progress' | 'Done' | 'Cancelled';
