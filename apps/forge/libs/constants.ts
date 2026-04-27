export const ROUTE = {
    FORGE: {
        HOME: '/projects',
        PROJECT_NEW: '/projects/new',
        PROJECT_DETAIL: (projectId: string) => `/projects/${projectId}`,
        PROJECT_MILESTONES: (projectId: string) => `/projects/${projectId}/milestones`,
        PROJECT_DISCUSSION: (projectId: string) => `/projects/${projectId}/discussion`,
        PROJECT_TODOS: (projectId: string) => `/projects/${projectId}/todos`,
        PROJECT_BILLING: (projectId: string) => `/projects/${projectId}/billing`,
    },
};
