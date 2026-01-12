"use client";

import { AUDIT_LOG_PAGINATION_SIZE } from "@/root/libs/constants";
import { createInitialPaginatedData } from "@repo/commons/utils/pagination-helpers";
import { useLazyQuery } from "@apollo/client/react";
import { PaginatedAuditLog } from "@repo/commons/types/audit-service-schema.type";
import { useCallback, useEffect, useState } from "react";
import { GET_AUDIT_LOGS, useMyAccount } from "./my-account-container";
import { ActivityColumn } from "./components/activity-column";
import { ActivitySkeletonRow } from "./components/activity-skeleton-row";
import { DataTable } from "@repo/shadcn-ui/components/data-table";

export default function CredentialActivityTable() {
    const ctx = useMyAccount()
    const [getAuditLogs, { data, loading }] = useLazyQuery(GET_AUDIT_LOGS);

    const [pageSize, setPageSize] = useState(AUDIT_LOG_PAGINATION_SIZE);
    const [paginatedAuditLog, setPaginatedAuditLog] = useState<PaginatedAuditLog>(createInitialPaginatedData());
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
        setPaginatedAuditLog(data?.getAuditLogs ?? ctx.auditLog ?? createInitialPaginatedData())
    }, [ctx.auditLog, data?.getAuditLogs])

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
