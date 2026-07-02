'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useLazyQuery } from '@apollo/client/react';
import { DataTable } from '@repo/shadcn-ui/components/data-table';
import { PaginatedInvoice } from '@repo/commons/types/forge-service-schema.type';
import { INVOICE_PAGINATION_SIZE } from '@/root/libs/constants';
import { useProjectDetail } from '../project-detail-container';
import { GET_INVOICES_FOR_FORGE } from './graphql';
import { createInvoiceColumns } from './columns';
import { InvoiceSkeletonRow } from './invoice-skeleton-row';
import { hasSuperAdminAccess } from '@repo/commons/utils/auth';
import { useAuth } from '@/shadcn/providers/auth-provider';
import { useDashboard01 } from '@/shadcn/dashboards/dashboard-01';
import CreateInvoiceDialog from './create-invoice-dialog';

export default function ProjectBilling() {
    const router = useRouter();
    const { projectId } = useParams<{ projectId: string }>();
    const { authUser } = useAuth();
    const { updateHeaderAction } = useDashboard01();
    const isKubisTeam = useMemo(() => hasSuperAdminAccess(authUser?.companies ?? []), [authUser]);
    const { project, initialInvoices } = useProjectDetail();

    const [getInvoices, { data, loading }] = useLazyQuery(GET_INVOICES_FOR_FORGE);
    const [pageSize, setPageSize] = useState(INVOICE_PAGINATION_SIZE);
    const [paginatedInvoices, setPaginatedInvoices] = useState<PaginatedInvoice>(initialInvoices);
    const [cursorHistory, setCursorHistory] = useState<(number | null | undefined)[]>([null]);

    const goToNextPage = useCallback(() => {
        if (
            paginatedInvoices.pageInfo.hasNextPage &&
            paginatedInvoices.pageInfo.endCursor !== null
        ) {
            setCursorHistory((prev) => [...prev, paginatedInvoices.pageInfo.endCursor]);
            getInvoices({
                variables: {
                    pagination: {
                        cursor: paginatedInvoices.pageInfo.endCursor,
                        take: pageSize,
                        projectPublicId: projectId,
                    },
                },
            });
        }
    }, [paginatedInvoices, pageSize, projectId, getInvoices]);

    const goToPreviousPage = useCallback(() => {
        if (cursorHistory.length > 1) {
            const newHistory = [...cursorHistory];
            newHistory.pop();
            const previousCursor = newHistory[newHistory.length - 1];
            setCursorHistory(newHistory);
            getInvoices({
                variables: {
                    pagination: {
                        cursor: previousCursor,
                        take: pageSize,
                        projectPublicId: projectId,
                    },
                },
            });
        }
    }, [cursorHistory, pageSize, projectId, getInvoices]);

    useEffect(() => {
        setPaginatedInvoices(data?.getInvoicesForForge ?? initialInvoices);
    }, [initialInvoices, data?.getInvoicesForForge]);

    useEffect(() => {
        if (isKubisTeam) {
            updateHeaderAction(
                <CreateInvoiceDialog activePlanId={project.subscription?.plan?.publicId} />,
            );
        }

        return () => {
            updateHeaderAction(undefined);
        };
    }, [isKubisTeam, project.subscription?.plan?.publicId]);

    return (
        <div className="flex w-full flex-col gap-6 py-2">
            <div>
                <h2 className="text-base font-semibold">Billing</h2>
                <p className="text-muted-foreground mt-0.5 text-sm">
                    Payment history for this project.
                </p>
            </div>

            <DataTable
                columns={createInvoiceColumns(projectId)}
                data={paginatedInvoices.data}
                pageInfo={paginatedInvoices.pageInfo}
                isLoading={loading}
                pageSize={pageSize}
                onPageSizeChange={setPageSize}
                cursorHistory={cursorHistory}
                onNextPage={goToNextPage}
                onPreviousPage={goToPreviousPage}
                emptyMessage="No invoices yet."
                getRowId={(row) => row.publicId}
                renderSkeletonRow={() => <InvoiceSkeletonRow />}
                flexColumnId="items"
                pageSizeOptions={[10, 20, 50]}
            />
        </div>
    );
}
