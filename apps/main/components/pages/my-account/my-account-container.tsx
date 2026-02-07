"use client";

import { AUDIT_LOG_PAGINATION_SIZE, COMPANY_PAGINATION_SIZE } from "@/root/libs/constants";
import { useDashboard01 } from "@/shadcn/dashboards/dashboard-01";
import { useAuth } from "@/shadcn/providers/auth-provider";
import { gql, TypedDocumentNode } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { CompaniesOverview, CompanyPaginationInput, PaginatedCompany } from "@repo/commons/types/account-service-schema.type";
import { AuditLogPaginationInput, PaginatedAuditLog } from "@repo/commons/types/audit-service-schema.type";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

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

type DeviceOverviewCard = {
    totalDevices: number;
    lastActiveDevice: string;
    lastActiveTime: string;
    allDevicesVerified: boolean
}

export type CompanyDetailContext = {
    auditLog?: PaginatedAuditLog
    isFetchingAuditLog: boolean
    credentialPublicId: string
    companyOverviewCard?: CompaniesOverview
    deviceOverviewCard: DeviceOverviewCard
}

const MyAccountContext = createContext<CompanyDetailContext | undefined>(undefined);

export default function MyAccountContainer({ children }: Readonly<{ children: React.ReactNode; }>) {
    const auth = useAuth();
    const { updateBreadcrumbList } = useDashboard01();

    const [auditLog, setAuditLog] = useState<PaginatedAuditLog | undefined>(undefined)
    const [companyOverviewCard, setCompanyOverviewCard] = useState<CompaniesOverview | undefined>()
    const [deviceOverviewCard, setDeviceOverviewCard] = useState<DeviceOverviewCard>({
        totalDevices: 3,
        lastActiveDevice: "MacBook Pro",
        lastActiveTime: "Active now",
        allDevicesVerified: true,
    })

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

    useEffect(() => {
        setAuditLog(auditLogResult.data?.getAuditLogs)
    }, [auditLogResult.data])

    useEffect(() => {
        if (companyOverview.data?.getUserCompanies?.overview) {
            setCompanyOverviewCard(companyOverview.data?.getUserCompanies?.overview)
        } else {
            setCompanyOverviewCard(undefined)
        }
    }, [companyOverview.data])

    const contextValue = useMemo(() => ({
        auditLog,
        isFetchingAuditLog: auditLogResult.loading,
        credentialPublicId: auth.authUser?.credential.publicId ?? "-1",
        companyOverviewCard,
        deviceOverviewCard,
    }), [auditLog, auditLogResult.loading, auth]);

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
