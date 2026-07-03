import { ProjectStatus } from '@repo/commons/types/forge-service-schema.type';

export const ROUTE = {
    FORGE: {
        HOME: '/projects',
        PROJECT_NEW: '/projects/new',
        PROJECT_DETAIL: (projectId: string) => `/projects/${projectId}`,
        PROJECT_MILESTONES: (projectId: string) => `/projects/${projectId}/milestones`,
        PROJECT_THREADS: (projectId: string) => `/projects/${projectId}/threads`,
        PROJECT_SETTINGS: (projectId: string) => `/projects/${projectId}/settings`,
        PROJECT_CONTEXT: (projectId: string) => `/projects/${projectId}/context`,
        PROJECT_BILLING: (projectId: string) => `/projects/${projectId}/billing`,
    },
};

export const PROJECT_PAGINATION_SIZE = 10;
export const THREAD_PAGINATION_SIZE = 100;
export const INVOICE_PAGINATION_SIZE = 10;

export const STATUS_LABEL: Record<ProjectStatus, string> = {
    PENDING_REVIEW: 'Pending Review',
    DISCOVERY: 'Discovery',
    MVP_BUILD: 'MVP Build',
    VALIDATION: 'Validation',
    PRODUCTION: 'Production',
    ON_HOLD: 'On Hold',
    CANCELLED: 'Cancelled',
};
