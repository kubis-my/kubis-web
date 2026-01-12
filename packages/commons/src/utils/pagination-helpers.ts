export const createInitialPaginatedData = <T>() => ({
    data: [] as T[],
    pageInfo: {
        endCursor: null,
        hasNextPage: false,
        total: 0,
        currentPage: 1,
        totalPages: 1
    },
});
