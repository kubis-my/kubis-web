"use client";

import { AUDIT_LOG_PAGINATION_SIZE, BRANCH_EVENT_PAGINATION_SIZE, USER_ACCOUNT_PAGINATION_SIZE } from "@/root/libs/constants";
import { useDashboard01 } from "@/shadcn/dashboards/dashboard-01";
import { gql, TypedDocumentNode } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { Branch, BranchEventPaginationInput, UserAccountPaginationInput } from "@repo/commons/types/account-service-schema.type";
import { AuditLogPaginationInput, PaginatedAuditLog } from "@repo/commons/types/audit-service-schema.type";
import { hasGraphQLError } from "@repo/commons/utils/graphql";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";


type ExtendedBranch = Branch & {
    auditLogs?: PaginatedAuditLog
}

interface GetBranchDetailResponse {
    getBranchDetail: ExtendedBranch
}

interface GetBranchDetailVariables {
    companyPublicId: string;
    branchPublicId: string;
    userAccountPaginationInput: UserAccountPaginationInput
    branchEventPaginationInput: BranchEventPaginationInput
    auditLogPaginationInput: AuditLogPaginationInput
}

export const GET_COMPANY_DETAIL: TypedDocumentNode<GetBranchDetailResponse, GetBranchDetailVariables> = gql`
    query GetBranchDetail(
        $branchPublicId:String!,$companyPublicId:String!,
        $userAccountPaginationInput:UserAccountPaginationInput!,
        $branchEventPaginationInput:BranchEventPaginationInput!,
        $auditLogPaginationInput:AuditLogPaginationInput!,
        ){
        getBranchDetail(branchPublicId:$branchPublicId){ 
            publicId
            name
            code
            email
            isActive
            createdAt
            updatedAt
            company {
                publicId
                name
            }
            branchPhysicalAddresses {
                publicId
                street
                city
                state
                postalCode
                country
                phoneCode
                phoneNumber
                createdAt
                updatedAt
            }
            branchBillingAddress {
                publicId
                street
                city
                state
                postalCode
                country
                phoneCode
                phoneNumber
                createdAt
                updatedAt
            }
            branchOperationHours {
                publicId
                dayOfWeek
                openTime
                closeTime
                isClosed
            }
            userAccounts (companyPublicId:$companyPublicId,pagination:$userAccountPaginationInput){
                data {
                    publicId
                    status
                    position
                    joinedAt
                    branchPublicId
                    companyEmployee{
                        phoneCode
                        phoneNumber
                        internalId
                        user {
                            publicId
                            firstName
                            lastName
                            nickname
                        }
                    }
                }
                pageInfo {
                    endCursor
                    hasNextPage
                    total
                    currentPage
                    totalPages
                }
            },
            branchEvents (companyPublicId:$companyPublicId,pagination:$branchEventPaginationInput){
                data {
                    publicId
                    name
                    type
                    description
                    startDate
                    endDate
                    createdAt
                    updatedAt
                }
                pageInfo {
                    endCursor
                    hasNextPage
                    total
                    currentPage
                    totalPages
                }
            }
            auditLogs(pagination:$auditLogPaginationInput){
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
                            companyEmployee(companyPublicId:$companyPublicId){
                                internalId
                            }
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
    }
`

export type CompanyBranchDetailContext = {
    branch?: ExtendedBranch
    loading: boolean
}

const CompanyBranchDetailContext = createContext<CompanyBranchDetailContext | undefined>(undefined);

export default function CompanyBranchDetailContainer({ children, companyId, branchId }: Readonly<{ children: React.ReactNode, companyId: string, branchId: string }>) {
    const pathName = usePathname();
    const router = useRouter();
    // ['my-account', 'company', '1', 'branch', '101']
    const companyURL = pathName.split(new RegExp(/\//g))
        .filter(Boolean)
        .splice(0, 3)
        .join("/");

    const { updateBreadcrumbList } = useDashboard01();
    const { data, loading, error } = useQuery(GET_COMPANY_DETAIL, {
        variables: {
            companyPublicId: companyId,
            branchPublicId: branchId,
            userAccountPaginationInput: {
                take: USER_ACCOUNT_PAGINATION_SIZE,
                branchPublicId: branchId,
            },
            branchEventPaginationInput: {
                take: BRANCH_EVENT_PAGINATION_SIZE
            },
            auditLogPaginationInput: {
                take: AUDIT_LOG_PAGINATION_SIZE
            }
        }
    })

    const [branch, setBranch] = useState<Branch | undefined>(undefined);

    useEffect(() => {
        setBranch(data?.getBranchDetail);

        if (data?.getBranchDetail) {


            updateBreadcrumbList([
                {
                    name: data?.getBranchDetail.company.name,
                    url: "/" + companyURL
                },
                {
                    name: data?.getBranchDetail.code.slice(0, 8)
                },
            ]);

            return () => {
                updateBreadcrumbList([]);
            }
        }
    }, [data])

    useEffect(() => {
        if (hasGraphQLError(error)) {
            const gqlError = error.errors?.[0] || error.graphQLErrors?.[0]

            if (gqlError) {
                const err = gqlError.extensions?.originalError as Record<string, any> | undefined

                const id = err?.id;

                if (id === "BRANCH_NOT_FOUND") {
                    toast.error("Branch not found", {
                        position: "top-center",
                    });
                    router.replace("/" + companyURL);
                    return;
                }

                toast.error(err?.message || gqlError.message || "Something went wrong", {
                    position: "top-center",
                });
            }
        }
    }, [error, router])

    const contextValue = useMemo(() => ({
        branch,
        loading
    }), [branch, loading]);

    return (
        <CompanyBranchDetailContext.Provider value={contextValue}>
            {children}
        </CompanyBranchDetailContext.Provider>
    )
}


export function useCompanyBranchDetail() {
    const context = useContext(CompanyBranchDetailContext);
    if (context === undefined) {
        throw new Error('useCompanyBranchDetail must be used within an CompanyBranchDetailProvider');
    }
    return context;
}
