"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { DataTable } from "@repo/shadcn-ui/components/data-table";
import { useYourDevice } from "./your-device-container";
import { createDeviceColumns } from "./components/device-column";
import { DeviceSkeletonRow } from "./components/device-skeleton-row";
import { CredentialDevicePaginationInput, PaginatedCredentialDevice } from "@repo/commons/types/auth-service-schema.type";
import { gql, TypedDocumentNode } from "@apollo/client";
import { useLazyQuery } from "@apollo/client/react";
import { createInitialPaginatedData } from "@repo/commons/utils/pagination-helpers";
import { CREDENTIAL_DEVICE_PAGINATION_SIZE } from "@/root/libs/constants";
import { Skeleton } from "@/shadcn/components/skeleton";

interface GetCredentialDevicesResponse {
    getCredentialDevices: PaginatedCredentialDevice;
}

interface GetCredentialDeviceVariables {
    pagination: CredentialDevicePaginationInput;
}

const GET_CREDENTIAL_DEVICES: TypedDocumentNode<GetCredentialDevicesResponse, GetCredentialDeviceVariables> = gql`
    query GetCredentialDevices($pagination: CredentialDevicePaginationInput!) {
        getCredentialDevices(pagination: $pagination) {
            data{
                publicId
                os
                browser
                deviceType
                deviceLabel
                ipAddress
                city
                country
                lastSeenAt
                status
                createdAt
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

export default function DeviceTable() {
    const ctx = useYourDevice();
    const [getCredentialDevices, { data, loading }] = useLazyQuery(GET_CREDENTIAL_DEVICES);

    const [pageSize, setPageSize] = useState(CREDENTIAL_DEVICE_PAGINATION_SIZE);
    const [paginatedCredentialDevice, setPaginatedCredentialDevice] = useState<Omit<PaginatedCredentialDevice, "overview">>(createInitialPaginatedData());
    const [cursorHistory, setCursorHistory] = useState<(number | null | undefined)[]>([null]);

    const columns = useMemo(() => createDeviceColumns(ctx.signOutDevice), [ctx.signOutDevice]);

    const goToNextPage = useCallback(() => {
        if (paginatedCredentialDevice.pageInfo.hasNextPage && paginatedCredentialDevice.pageInfo.endCursor !== null) {
            setCursorHistory(prev => [...prev, paginatedCredentialDevice.pageInfo.endCursor]);
            getCredentialDevices({
                variables: {
                    pagination: {
                        cursor: paginatedCredentialDevice.pageInfo.endCursor,
                        take: pageSize,
                    }
                }
            });
        }
    }, [paginatedCredentialDevice, pageSize, getCredentialDevices]);

    const goToPreviousPage = useCallback(() => {
        if (cursorHistory.length > 1) {
            const newHistory = [...cursorHistory];
            newHistory.pop();
            const previousCursor = newHistory[newHistory.length - 1];
            setCursorHistory(newHistory);
            getCredentialDevices({
                variables: {
                    pagination: {
                        cursor: previousCursor,
                        take: pageSize,
                    }
                }
            });
        }
    }, [cursorHistory, pageSize, getCredentialDevices]);

    useEffect(() => {
        setPaginatedCredentialDevice(data?.getCredentialDevices ?? ctx.paginatedCredentialDevice ?? createInitialPaginatedData())
    }, [ctx.paginatedCredentialDevice, data?.getCredentialDevices])

    if (ctx.isFetchingCredentialDevice) return <Skeleton className="min-h-screen flex-1 rounded-xl md:min-h-min" />

    return (
        <div className="flex flex-col gap-4">
            <DataTable
                columns={columns}
                data={paginatedCredentialDevice.data}
                pageInfo={paginatedCredentialDevice.pageInfo}
                isLoading={loading}
                pageSize={pageSize}
                onPageSizeChange={setPageSize}
                cursorHistory={cursorHistory}
                onNextPage={goToNextPage}
                onPreviousPage={goToPreviousPage}
                emptyMessage="No devices found."
                getRowId={(row) => row.publicId.toString()}
                renderSkeletonRow={() => <DeviceSkeletonRow />}
                flexColumnId="location"
            />
        </div>
    );
}
