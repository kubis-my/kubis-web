export const ROUTE = {
    OPS: {
        HOME: (companyIndex = 0) => `/c/${companyIndex}`,
        CATALOG: (companyIndex = 0) => `/c/${companyIndex}/catalog`,
    },
};

export const PRODUCT_PAGINATION_SIZE = 20;
