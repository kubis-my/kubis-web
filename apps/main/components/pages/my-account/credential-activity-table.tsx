"use client";

import { AUDIT_LOG_PAGINATION_SIZE } from "@/root/libs/constants";
import { useLazyQuery } from "@apollo/client/react";
import { PaginatedAuditLog } from "@repo/commons/types/audit-service-schema.type";
import { useCallback, useEffect, useState } from "react";
import { GET_AUDIT_LOGS, useMyAccount } from "./my-account-container";
import { ActivityColumn } from "./components/activity-column";
import { ActivitySkeletonRow } from "./components/activity-skeleton-row";
import { DataTable } from "@repo/shadcn-ui/components/data-table";
import { Skeleton } from "@/shadcn/components/skeleton";

const initialPaginationData = {
    data: [],
    pageInfo: {
        endCursor: null,
        hasNextPage: false,
        total: 0,
        currentPage: 1,
        totalPages: 1
    },
    overview: {
        totalAction: 0,
        totalWeekAction: 0,
        lastActivity: null
    }
}

export default function CredentialActivityTable() {
    const ctx = useMyAccount()
    const [getAuditLogs, { data, loading }] = useLazyQuery(GET_AUDIT_LOGS);

    const [pageSize, setPageSize] = useState(AUDIT_LOG_PAGINATION_SIZE);
    const [paginatedAuditLog, setPaginatedAuditLog] = useState<PaginatedAuditLog>(initialPaginationData);
    const [cursorHistory, setCursorHistory] = useState<(number | null | undefined)[]>([null]);

    const goToNextPage = useCallback(() => {
        if (paginatedAuditLog.pageInfo.hasNextPage && paginatedAuditLog.pageInfo.endCursor !== null) {
            setCursorHistory(prev => [...prev, paginatedAuditLog.pageInfo.endCursor]);
            getAuditLogs({
                variables: {
                    pagination: {
                        cursor: paginatedAuditLog.pageInfo.endCursor,
                        take: pageSize,
                        credentialId: ctx.credentialPublicId
                    }
                }
            });
        }
    }, [paginatedAuditLog, pageSize, getAuditLogs, ctx.auditLog]);

    const goToPreviousPage = useCallback(() => {
        if (cursorHistory.length > 1) {
            const newHistory = [...cursorHistory];
            newHistory.pop();
            const previousCursor = newHistory[newHistory.length - 1];
            setCursorHistory(newHistory);
            getAuditLogs({
                variables: {
                    pagination: {
                        cursor: previousCursor,
                        take: pageSize,
                        credentialId: ctx.credentialPublicId
                    }
                }
            });
        }
    }, [cursorHistory, pageSize, getAuditLogs, ctx.auditLog]);

    useEffect(() => {
        setPaginatedAuditLog(data?.getAuditLogs ?? ctx.auditLog ?? initialPaginationData)
    }, [ctx.auditLog, data?.getAuditLogs])

    if (ctx.isFetchingAuditLog) return <Skeleton className="min-h-screen flex-1 rounded-xl md:min-h-min" />

    return (
        <DataTable
            columns={ActivityColumn}
            data={paginatedAuditLog.data}
            pageInfo={paginatedAuditLog.pageInfo}
            isLoading={loading}
            pageSize={pageSize}
            onPageSizeChange={setPageSize}
            cursorHistory={cursorHistory}
            onNextPage={goToNextPage}
            onPreviousPage={goToPreviousPage}
            emptyMessage="No activity logs found."
            getRowId={(row) => row.publicId.toString()}
            renderSkeletonRow={() => <ActivitySkeletonRow />}
            flexColumnId="description"
        />
    );
}
