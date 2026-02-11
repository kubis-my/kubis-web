"use client";

import { useCallback, useMemo, useState } from "react";
import { DataTable } from "@repo/shadcn-ui/components/data-table";
import { Skeleton } from "@/shadcn/components/skeleton";
import { INVITATION_PAGINATION_SIZE } from "@/root/libs/constants";
import { useInvitation } from "./invitation-container";
import { createInvitationColumns } from "./components/invitation-column";
import { InvitationSkeletonRow } from "./components/invitation-skeleton-row";

export default function InvitationTable() {
    const { paginatedInvitation, isLoading, acceptInvitation, declineInvitation, goToPage } = useInvitation();

    const [pageSize, setPageSize] = useState(INVITATION_PAGINATION_SIZE);
    const [cursorHistory, setCursorHistory] = useState<(number | null | undefined)[]>([null]);

    const columns = useMemo(
        () => createInvitationColumns(acceptInvitation, declineInvitation),
        [acceptInvitation, declineInvitation],
    );

    const goToNextPage = useCallback(() => {
        if (paginatedInvitation.pageInfo.hasNextPage) {
            const nextPage = cursorHistory.length + 1;
            setCursorHistory((prev) => [...prev, paginatedInvitation.pageInfo.endCursor]);
            goToPage(nextPage);
        }
    }, [paginatedInvitation.pageInfo, cursorHistory.length, goToPage]);

    const goToPreviousPage = useCallback(() => {
        if (cursorHistory.length > 1) {
            const newHistory = [...cursorHistory];
            newHistory.pop();
            setCursorHistory(newHistory);
            goToPage(newHistory.length);
        }
    }, [cursorHistory, goToPage]);

    if (isLoading) return <Skeleton className="min-h-screen flex-1 rounded-xl md:min-h-min" />;

    return (
        <div className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold">Received Invitations</h2>
            <DataTable
                columns={columns}
                data={paginatedInvitation.data}
                pageInfo={paginatedInvitation.pageInfo}
                isLoading={false}
                pageSize={pageSize}
                onPageSizeChange={setPageSize}
                cursorHistory={cursorHistory}
                onNextPage={goToNextPage}
                onPreviousPage={goToPreviousPage}
                emptyMessage="No invitations found."
                getRowId={(row) => row.publicId}
                renderSkeletonRow={() => <InvitationSkeletonRow />}
                flexColumnId="companyName"
            />
        </div>
    );
}
