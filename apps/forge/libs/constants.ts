export const ROUTE = {
    FORGE: {
        HOME: (companyIndex = 0) => `/c/${companyIndex}`,
        PROJECTS: (companyIndex = 0) => `/c/${companyIndex}/projects`,
        PROJECT_NEW: (companyIndex = 0) => `/c/${companyIndex}/projects/new`,
        PROJECT_DETAIL: (companyIndex = 0, projectId: string) =>
            `/c/${companyIndex}/projects/${projectId}`,
    },
};
