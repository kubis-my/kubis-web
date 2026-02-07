"use client";

import * as React from "react";
import { TabsContent } from "@/shadcn/components/tabs";
import { useCompanyBranchDetail } from "./company-branch-detail-container";
import { AuditLogPaginationInput, PaginatedAuditLog } from "@repo/commons/types/audit-service-schema.type";
import { AUDIT_LOG_PAGINATION_SIZE } from "@/root/libs/constants";
import { createInitialPaginatedData } from "@repo/commons/utils/pagination-helpers";
import { gql, TypedDocumentNode } from "@apollo/client";
import { useLazyQuery } from "@apollo/client/react";
import { useCallback, useEffect, useState } from "react";
import { ActivityColumn } from "./components/activity-column";
import { ActivitySkeletonRow } from "./components/activity-skeleton-row";
import { DataTable } from "@repo/shadcn-ui/components/data-table";

interface GetAuditLogsResponse {
    getAuditLogs: PaginatedAuditLog;
}

interface GetAuditLogsVariables {
    pagination: AuditLogPaginationInput;
    companyPublicId: string;
}

const GET_AUDIT_LOGS: TypedDocumentNode<GetAuditLogsResponse, GetAuditLogsVariables> = gql`
    query GetAuditLogs(
        $companyPublicId:String!
        $pagination: AuditLogPaginationInput!
        ) {
        getAuditLogs(pagination: $pagination) {
            data {
                publicId
                emittedAt
                type
                description
                auditLogAuthor {
                    publicId
                    credentialId
                    user {
                        publicId
                        firstName
                        lastName
                        nickname
                        companyEmployee(companyPublicId: $companyPublicId){
                            internalId
                        }
                    }
                }
                auditLogResource {
                    publicId
                    type
                }
                auditLogMetaData {
                    before {
                        key
                        type
                        value
                    }
                    after {
                        key
                        type
                        value
                    }
                    additional
                }
            }
            pageInfo {
                endCursor
                hasNextPage
                total
                currentPage
                totalPages
            }
        }
    }
`

export default function ActivityLogsTab() {
    const ctx = useCompanyBranchDetail();
    const [getAuditLogs, { data, loading }] = useLazyQuery(GET_AUDIT_LOGS);

    const [pageSize, setPageSize] = useState(AUDIT_LOG_PAGINATION_SIZE);
    const [paginatedAuditLog, setPaginatedAuditLog] = useState<Omit<PaginatedAuditLog, "overview">>(createInitialPaginatedData());
    const [cursorHistory, setCursorHistory] = useState<(number | null | undefined)[]>([null]);

    const goToNextPage = useCallback(() => {
        if (paginatedAuditLog.pageInfo.hasNextPage && paginatedAuditLog.pageInfo.endCursor !== null) {
            setCursorHistory(prev => [...prev, paginatedAuditLog.pageInfo.endCursor]);
            getAuditLogs({
                variables: {
                    companyPublicId: ctx.branch?.company?.publicId ?? "-1",
                    pagination: {
                        cursor: paginatedAuditLog.pageInfo.endCursor,
                        take: pageSize,
                        branchId: ctx.branch?.publicId,
                    }
                }
            });
        }
    }, [paginatedAuditLog, pageSize, getAuditLogs, ctx.branch]);

    const goToPreviousPage = useCallback(() => {
        if (cursorHistory.length > 1) {
            const newHistory = [...cursorHistory];
            newHistory.pop();
            const previousCursor = newHistory[newHistory.length - 1];
            setCursorHistory(newHistory);
            getAuditLogs({
                variables: {
                    companyPublicId: ctx.branch?.company?.publicId ?? "-1",
                    pagination: {
                        cursor: previousCursor,
                        take: pageSize,
                        branchId: ctx.branch?.publicId,
                    }
                }
            });
        }
    }, [cursorHistory, pageSize, getAuditLogs, ctx.branch]);

    useEffect(() => {
        setPaginatedAuditLog(data?.getAuditLogs ?? ctx.branch?.auditLogs ?? createInitialPaginatedData())
    }, [ctx.branch?.auditLogs, data?.getAuditLogs])

    return (
        <TabsContent value="activity-logs">
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
        </TabsContent>
    );
}
