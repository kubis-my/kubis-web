"use client";

import { CREDENTIAL_DEVICE_PAGINATION_SIZE } from "@/root/libs/constants";
import { useDashboard01 } from "@/shadcn/dashboards/dashboard-01";
import { gql, TypedDocumentNode } from "@apollo/client";
import { useApolloClient, useMutation, useQuery } from "@apollo/client/react";
import { CredentialDevice, CredentialDevicePaginationInput, CredentialDeviceStatus, PaginatedCredentialDevice, RevokeAccessInput } from "@repo/commons/types/auth-service-schema.type";
import { hasGraphQLError } from "@repo/commons/utils/graphql";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import DeviceHeaderAction from "./device-header-action";

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

interface SignOutAllOtherDevicesResponse {
    signOutAllOtherDevices: CredentialDevice[];
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

const SIGN_OUT_ALL_OTHER_DEVICES: TypedDocumentNode<SignOutAllOtherDevicesResponse> = gql`
    mutation SignOutAllOtherDevices {
        signOutAllOtherDevices {
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
    const { updateBreadcrumbList, updateHeaderAction } = useDashboard01();

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

    const [revokeAccess] = useMutation(REVOKE_ACCESS);
    const [signOutAllOtherDevicesMutation] = useMutation(SIGN_OUT_ALL_OTHER_DEVICES);

    const signOutDevice = useCallback(async (id: string) => {
        try {
            const { data, error } = await revokeAccess({
                variables: { input: { accessTokenPublicId: id } },
                errorPolicy: "all",
            });

            if (hasGraphQLError(error)) {
                toast.error("Failed to revoke device access", { position: "top-center" });
                return;
            }

            if (data) {
                client.refetchQueries({ include: ["GetCredentialDevices"] });
                toast.success("Device access revoked", { position: "top-center" });
                return;
            }

            toast.error("An unexpected error occurred. Please try again.", { position: "top-center" });
        } catch {
            toast.error("Network error occurred. Please check your connection.", { position: "top-center" });
        }
    }, [revokeAccess, client]);

    const signOutAllOtherDevices = useCallback(async () => {
        try {
            const { data, error } = await signOutAllOtherDevicesMutation({
                errorPolicy: "all",
            });

            if (hasGraphQLError(error)) {
                toast.error("Failed to revoke access from other devices", { position: "top-center" });
                return;
            }

            if (data) {
                const count = data.signOutAllOtherDevices.length;
                client.refetchQueries({ include: ["GetCredentialDevices"] });
                toast.success(`Revoked access from ${count} ${count === 1 ? "device" : "devices"}`, { position: "top-center" });
                return;
            }

            toast.error("An unexpected error occurred. Please try again.", { position: "top-center" });
        } catch {
            toast.error("Network error occurred. Please check your connection.", { position: "top-center" });
        }
    }, [signOutAllOtherDevicesMutation, client]);

    const otherDevicesCount = useMemo(() => {
        return paginatedCredentialDevice?.data.filter(
            (d) => d.status !== CredentialDeviceStatus.CURRENT
        ).length ?? 0;
    }, [paginatedCredentialDevice?.data]);

    useEffect(() => {
        updateBreadcrumbList([
            { name: "Your Devices" },
        ]);
        updateHeaderAction(<DeviceHeaderAction otherDevicesCount={otherDevicesCount} onSignOutAll={signOutAllOtherDevices} />);

        return () => {
            updateBreadcrumbList([]);
            updateHeaderAction(undefined);
        };
    }, [updateBreadcrumbList, updateHeaderAction, otherDevicesCount, signOutAllOtherDevices]);

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
