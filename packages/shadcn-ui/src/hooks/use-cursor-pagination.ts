"use client";

import { useCallback, useState } from "react"

export interface PageInfo {
    endCursor: number | null
    hasNextPage: boolean
    total: number
    currentPage: number
    totalPages: number
}

export interface UseCursorPaginationOptions {
    initialPageSize: number
    onFetch: (cursor: number | null | undefined, pageSize: number) => void
}

export interface UseCursorPaginationReturn {
    pageSize: number
    setPageSize: (size: number) => void
    cursorHistory: (number | null | undefined)[]
    goToNextPage: (endCursor: number | null) => void
    goToPreviousPage: () => void
    resetPagination: () => void
}

export function useCursorPagination({
    initialPageSize,
    onFetch,
}: UseCursorPaginationOptions): UseCursorPaginationReturn {
    const [pageSize, setPageSize] = useState(initialPageSize)
    const [cursorHistory, setCursorHistory] = useState<(number | null | undefined)[]>([null])

    const goToNextPage = useCallback(
        (endCursor: number | null) => {
            if (endCursor !== null) {
                setCursorHistory((prev) => [...prev, endCursor])
                onFetch(endCursor, pageSize)
            }
        },
        [pageSize, onFetch]
    )

    const goToPreviousPage = useCallback(() => {
        if (cursorHistory.length > 1) {
            const newHistory = [...cursorHistory]
            newHistory.pop()
            const previousCursor = newHistory[newHistory.length - 1]
            setCursorHistory(newHistory)
            onFetch(previousCursor, pageSize)
        }
    }, [cursorHistory, pageSize, onFetch])

    const resetPagination = useCallback(() => {
        setCursorHistory([null])
        onFetch(null, pageSize)
    }, [pageSize, onFetch])

    return {
        pageSize,
        setPageSize,
        cursorHistory,
        goToNextPage,
        goToPreviousPage,
        resetPagination,
    }
}
