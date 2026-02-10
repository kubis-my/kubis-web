"use client";

import { CREDENTIAL_DEVICE_PAGINATION_SIZE } from "@/root/libs/constants";
import { useDashboard01 } from "@/shadcn/dashboards/dashboard-01";
import { gql, TypedDocumentNode } from "@apollo/client";
import { useApolloClient, useMutation, useQuery } from "@apollo/client/react";
import { CredentialDevice, CredentialDevicePaginationInput, PaginatedCredentialDevice, RevokeAccessInput } from "@repo/commons/types/auth-service-schema.type";
import { hasGraphQLError } from "@repo/commons/utils/graphql";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

interface GetCredentialDevicesResponse {
    getCredentialDevices: PaginatedCredentialDevice;
}

interface GetCredentialDeviceVariables {
    pagination: CredentialDevicePaginationInput;
}

interface RevokeAccessResponse {
    revokeAccess: CredentialDevice;
}

interface RevokeAccessVariables {
    input: RevokeAccessInput;
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
            overview {
                currentDevice {
                    os
                    browser
                    deviceType
                    deviceLabel
                }
                totalDevices
                activeInLast24h
                deviceTypeCount
                isEnable2FA
            }
        }
    }
`

const REVOKE_ACCESS: TypedDocumentNode<RevokeAccessResponse, RevokeAccessVariables> = gql`
    mutation RevokeAccess($input: RevokeAccessInput!) {
        revokeAccess(input: $input) {
            publicId
            status
        }
    }
`

export type YourDeviceContextType = {
    paginatedCredentialDevice?: PaginatedCredentialDevice;
    isFetchingCredentialDevice: boolean;
    signOutDevice: (id: string) => void;
    signOutAllOtherDevices: () => void;
};

const YourDeviceContext = createContext<YourDeviceContextType | undefined>(undefined);

export default function YourDeviceContainer({ children }: Readonly<{ children: React.ReactNode }>) {
    const { updateBreadcrumbList } = useDashboard01();

    const [paginatedCredentialDevice, setPaginatedCredentialDevice] = useState<PaginatedCredentialDevice | undefined>(undefined);

    const client = useApolloClient();

    const { data, loading: isFetchingCredentialDevice } = useQuery(GET_CREDENTIAL_DEVICES, {
        variables: {
            pagination: {
                take: CREDENTIAL_DEVICE_PAGINATION_SIZE
            }
        }
    });

    useEffect(() => {
        setPaginatedCredentialDevice(data?.getCredentialDevices);
    }, [data]);

    useEffect(() => {
        updateBreadcrumbList([
            { name: "Your Devices" },
        ]);

        return () => {
            updateBreadcrumbList([]);
        };
    }, [updateBreadcrumbList]);

    const [revokeAccess] = useMutation(REVOKE_ACCESS);

    const signOutDevice = useCallback(async (id: string) => {
        try {
            const { data, error } = await revokeAccess({
                variables: { input: { accessTokenPublicId: id } },
                errorPolicy: "all",
            });

            if (hasGraphQLError(error)) {
                toast.error("Failed to sign out from device", { position: "top-center" });
                return;
            }

            if (data) {
                client.refetchQueries({ include: ["GetCredentialDevices"] });
                toast.success("Signed out from device", { position: "top-center" });
                return;
            }

            toast.error("An unexpected error occurred. Please try again.", { position: "top-center" });
        } catch {
            toast.error("Network error occurred. Please check your connection.", { position: "top-center" });
        }
    }, [revokeAccess, client]);

    const signOutAllOtherDevices = useCallback(() => {
        const count = 1
        toast.success(`Signed out from ${count} ${count === 1 ? "device" : "devices"}`);
    }, [paginatedCredentialDevice?.data]);

    const contextValue = useMemo(() => (
        {
            paginatedCredentialDevice,
            isFetchingCredentialDevice,
            signOutDevice,
            signOutAllOtherDevices
        }), [paginatedCredentialDevice, signOutDevice, signOutAllOtherDevices, isFetchingCredentialDevice]);

    return (
        <YourDeviceContext.Provider value={contextValue}>
            {children}
        </YourDeviceContext.Provider>
    );
}

export function useYourDevice() {
    const context = useContext(YourDeviceContext);
    if (context === undefined) {
        throw new Error("useYourDevice must be used within a YourDeviceContainer");
    }
    return context;
}
