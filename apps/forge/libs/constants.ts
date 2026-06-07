export const ROUTE = {
    FORGE: {
        HOME: '/projects',
        PROJECT_NEW: '/projects/new',
        PROJECT_DETAIL: (projectId: string) => `/projects/${projectId}`,
        PROJECT_MILESTONES: (projectId: string) => `/projects/${projectId}/milestones`,
        PROJECT_THREADS: (projectId: string) => `/projects/${projectId}/threads`,
        PROJECT_SETTINGS: (projectId: string) => `/projects/${projectId}/settings`,
        PROJECT_CONTEXT: (projectId: string) => `/projects/${projectId}/context`,
    },
};

export const PROJECT_PAGINATION_SIZE = 50;
export const THREAD_PAGINATION_SIZE = 100;
