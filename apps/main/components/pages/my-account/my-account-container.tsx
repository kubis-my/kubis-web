"use client";

import { AUDIT_LOG_PAGINATION_SIZE, COMPANY_PAGINATION_SIZE, CREDENTIAL_DEVICE_PAGINATION_SIZE } from "@/root/libs/constants";
import { useDashboard01 } from "@/shadcn/dashboards/dashboard-01";
import { useAuth } from "@/shadcn/providers/auth-provider";
import { gql, TypedDocumentNode } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { CompaniesOverview, CompanyPaginationInput, PaginatedCompany } from "@repo/commons/types/account-service-schema.type";
import { AuditLogPaginationInput, PaginatedAuditLog } from "@repo/commons/types/audit-service-schema.type";
import { CredentialDeviceOverview, CredentialDevicePaginationInput, PaginatedCredentialDevice } from "@repo/commons/types/auth-service-schema.type";
import { createContext, useContext, useEffect, useMemo } from "react";

interface GetAuditLogsResponse {
    getAuditLogs: PaginatedAuditLog;
}

interface GetAuditLogsVariables {
    pagination: AuditLogPaginationInput;
}

export const GET_AUDIT_LOGS: TypedDocumentNode<GetAuditLogsResponse, GetAuditLogsVariables> = gql`
    query GetAuditLogs($pagination: AuditLogPaginationInput! ) {
        getAuditLogs(pagination: $pagination) {
            data {
                publicId
                emittedAt
                type
                description
                auditLogAuthor {
                    publicId
                    company{
                        publicId
                        name
                    }
                    branch{
                        name
                        code
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
            overview {
                totalAction
                totalWeekAction
                lastActivity
            }
        }
    }
`

interface GetUserCompaniesResponse {
    getUserCompanies: PaginatedCompany;
}

interface GetUserCompaniesVariables {
    pagination: CompanyPaginationInput;
}

const GET_USER_COMPANY_OVERVIEW: TypedDocumentNode<GetUserCompaniesResponse, GetUserCompaniesVariables> = gql`
    query GetUserCompanies($pagination: CompanyPaginationInput!) {
        getUserCompanies(pagination: $pagination) {
            overview {
                activeCompanies
                totalCompanies
                deactivatedCompanies
                companiesDeactivatedThisMonth
                retentionRate
                deactivationRate
                totalBranches
                newBranchesThisQuarter
                branchGrowthRate
                totalStaff
                newStaffThisQuarter
                staffGrowthRate
                averageStaffPerBranch
                newBranchesThisMonth
            }
        }
    }
`

interface GetCredentialDevicesResponse {
    getCredentialDevices: PaginatedCredentialDevice;
}

interface GetCredentialDeviceVariables {
    pagination: CredentialDevicePaginationInput;
}

const GET_CREDENTIAL_DEVICE_OVERVIEW: TypedDocumentNode<GetCredentialDevicesResponse, GetCredentialDeviceVariables> = gql`
    query GetCredentialDevices($pagination: CredentialDevicePaginationInput!) {
        getCredentialDevices(pagination: $pagination) {
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

export type CompanyDetailContext = {
    auditLog?: PaginatedAuditLog
    isLoading: boolean
    credentialPublicId: string
    companyOverviewCard?: CompaniesOverview
    deviceOverviewCard?: CredentialDeviceOverview
}

const MyAccountContext = createContext<CompanyDetailContext | undefined>(undefined);

export default function MyAccountContainer({ children }: Readonly<{ children: React.ReactNode; }>) {
    const auth = useAuth();
    const { updateBreadcrumbList } = useDashboard01();

    const auditLogResult = useQuery(GET_AUDIT_LOGS, {
        variables: {
            pagination: {
                take: AUDIT_LOG_PAGINATION_SIZE,
                credentialId: auth.authUser?.credential.publicId ?? "-1"
            }
        }
    });

    const companyOverview = useQuery(GET_USER_COMPANY_OVERVIEW, {
        variables: {
            pagination: {
                take: COMPANY_PAGINATION_SIZE
            }
        }
    });

    const credentialDeviceOverview = useQuery(GET_CREDENTIAL_DEVICE_OVERVIEW, {
        variables: {
            pagination: {
                take: CREDENTIAL_DEVICE_PAGINATION_SIZE
            }
        }
    });

    useEffect(() => {
        updateBreadcrumbList([
            {
                name: "Dashboard"
            }
        ]);

        return () => {
            updateBreadcrumbList([]);
        }
    }, [updateBreadcrumbList]);

    const contextValue = useMemo(() => ({
        auditLog: auditLogResult.data?.getAuditLogs,
        isLoading: auditLogResult.loading || companyOverview.loading || credentialDeviceOverview.loading,
        credentialPublicId: auth.authUser?.credential.publicId ?? "-1",
        companyOverviewCard: companyOverview.data?.getUserCompanies?.overview,
        deviceOverviewCard: credentialDeviceOverview.data?.getCredentialDevices?.overview,
    }), [auditLogResult, companyOverview, credentialDeviceOverview, auth]);

    return (
        <MyAccountContext.Provider value={contextValue}>
            {children}
        </MyAccountContext.Provider>
    )
}

export function useMyAccount() {
    const context = useContext(MyAccountContext);

    if (context === undefined) {
        throw new Error('useMyAccount must be used within an MyAccountProvider');
    }

    return context;
}
