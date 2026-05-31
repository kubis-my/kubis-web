export const bySortOrder = (a: { sortOrder: number }, b: { sortOrder: number }) =>
    a.sortOrder - b.sortOrder;

export const createInitialPaginatedData = <T>() => ({
    data: [] as T[],
    pageInfo: {
        endCursor: null,
        hasNextPage: false,
        total: 0,
        currentPage: 1,
        totalPages: 1,
    },
});
