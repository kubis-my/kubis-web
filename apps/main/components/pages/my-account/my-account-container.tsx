"use client";

import { AUDIT_LOG_PAGINATION_SIZE } from "@/root/libs/constants";
import { useDashboard01 } from "@/shadcn/dashboards/dashboard-01";
import { useAuth } from "@/shadcn/providers/auth-provider";
import { gql, TypedDocumentNode } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
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

type ActivityOverviewCard = {
    recentActivityCount: number
    trendPercentage: number
    lastActivityTime: string
    activityThisWeek: number
}

type CompanyOverviewCard = {
    totalCompanies: number;
    activeCompanies: number;
    inactiveCompanies: number;
    recentJoins: number;
    recentJoinTimeframe: string
}

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
    activityOverviewCard: ActivityOverviewCard
    companyOverviewCard: CompanyOverviewCard
    deviceOverviewCard: DeviceOverviewCard
}

const MyAccountContext = createContext<CompanyDetailContext | undefined>(undefined);

export default function MyAccountContainer({ children }: Readonly<{ children: React.ReactNode; }>) {
    const auth = useAuth();
    const { updateBreadcrumbList } = useDashboard01();

    const [auditLog, setAuditLog] = useState<PaginatedAuditLog | undefined>(undefined)
    const [activityOverviewCard, setActivityOverviewCard] = useState<ActivityOverviewCard>({
        recentActivityCount: 12,
        trendPercentage: 23.5,
        lastActivityTime: "2 hours ago",
        activityThisWeek: 12,
    })
    const [companyOverviewCard, setCompanyOverviewCard] = useState<CompanyOverviewCard>({
        totalCompanies: 5,
        activeCompanies: 4,
        inactiveCompanies: 1,
        recentJoins: 1,
        recentJoinTimeframe: "this month",
    })
    const [deviceOverviewCard, setDeviceOverviewCard] = useState<DeviceOverviewCard>({
        totalDevices: 3,
        lastActiveDevice: "MacBook Pro",
        lastActiveTime: "Active now",
        allDevicesVerified: true,
    })

    const { data, loading: isFetchingAuditLog } = useQuery(GET_AUDIT_LOGS, {
        variables: {
            pagination: {
                take: AUDIT_LOG_PAGINATION_SIZE,
                credentialId: auth.authUser?.credential.publicId ?? "-1"
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
        setAuditLog(data?.getAuditLogs)
    }, [data])

    const contextValue = useMemo(() => ({
        auditLog,
        isFetchingAuditLog,
        credentialPublicId: auth.authUser?.credential.publicId ?? "-1",
        activityOverviewCard,
        companyOverviewCard,
        deviceOverviewCard
    }), [auditLog, isFetchingAuditLog, auth]);

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
