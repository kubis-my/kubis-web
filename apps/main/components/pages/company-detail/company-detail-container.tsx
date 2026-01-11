"use client";

import { AUDIT_LOG_PAGINATION_SIZE, BRANCH_PAGINATION_SIZE, ROUTE, USER_ACCOUNT_PAGINATION_SIZE } from "@/root/libs/constants";
import { useDashboard01 } from "@/shadcn/dashboards/dashboard-01";
import { gql, TypedDocumentNode } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { BranchPaginationInput, Company, UserAccountPaginationInput } from "@repo/commons/types/account-service-schema.type";
import { AuditLogPaginationInput, PaginatedAuditLog } from "@repo/commons/types/audit-service-schema.type";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

type ExtendedCompany = Company & {
    auditLogs?: PaginatedAuditLog
}

interface GetCompanyDetailResponse {
    getCompanyDetail: ExtendedCompany
}

interface GetCompanyDetailVariables {
    companyPublicId: string;
    branchPaginationInput: BranchPaginationInput
    userAccountPaginationInput: UserAccountPaginationInput
    auditLogPaginationInput: AuditLogPaginationInput
}

export const GET_COMPANY_DETAIL: TypedDocumentNode<GetCompanyDetailResponse, GetCompanyDetailVariables> = gql`
    query GetCompanyDetail(
        $companyPublicId:String!,
        $branchPaginationInput:BranchPaginationInput!,
        $userAccountPaginationInput:UserAccountPaginationInput!,
        $auditLogPaginationInput:AuditLogPaginationInput!,
        ){
        getCompanyDetail(companyPublicId:$companyPublicId){
            publicId
            name
            registrationNo
            isUnclassified
            isActive
            logo
            createdAt
            updatedAt
            totalActiveEmployee
            totalActiveBranch
            companyPhysicalAddresses {
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
            companyBillingAddress {
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
            branches(pagination:$branchPaginationInput) {
                data { 
                    publicId
                    name
                    code
                    email
                    phoneCode
                    phoneNumber
                    isActive
                    branchPhysicalAddresses {
                        city
                        state
                        country
                    }
                    branchOperationHours {
                        dayOfWeek
                        openTime
                        closeTime
                        isClosed
                    }
                    totalOfEmployee
                }
                pageInfo {
                    endCursor
                    hasNextPage
                    total
                    currentPage
                    totalPages
                }
            }
            userAccounts (pagination:$userAccountPaginationInput){
                data {
                    publicId
                    status
                    joinedAt
                    branchPublicId
                    companyEmployee{
                        position
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
    }
`

export type CompanyDetailContext = {
    company?: ExtendedCompany
    isFetchingCompany: boolean
}

const CompanyDetailContext = createContext<CompanyDetailContext | undefined>(undefined);

export default function CompanyDetailContainer({ children, id }: Readonly<{ children: React.ReactNode, id: string }>) {
    const { updateBreadcrumbList } = useDashboard01();
    const { data, loading: isFetchingCompany } = useQuery(GET_COMPANY_DETAIL, {
        variables: {
            companyPublicId: id,
            branchPaginationInput: {
                take: BRANCH_PAGINATION_SIZE
            },
            userAccountPaginationInput: {
                take: USER_ACCOUNT_PAGINATION_SIZE
            },
            auditLogPaginationInput: {
                take: AUDIT_LOG_PAGINATION_SIZE
            }
        }
    })

    const [company, setCompany] = useState<ExtendedCompany | undefined>(undefined);

    useEffect(() => {
        setCompany(data?.getCompanyDetail)

        if (data?.getCompanyDetail) {
            updateBreadcrumbList([
                {
                    name: "Company",
                    url: ROUTE.MY_ACCOUNT.COMPANY
                },
                {
                    name: data.getCompanyDetail.name
                },
            ]);

            return () => {
                updateBreadcrumbList([]);
            }
        }
    }, [data])

    const contextValue = useMemo(() => ({
        company,
        isFetchingCompany,
    }), [company, isFetchingCompany]);

    return (
        <CompanyDetailContext.Provider value={contextValue}>
            {children}
        </CompanyDetailContext.Provider>
    )
}


export function useCompanyDetail() {
    const context = useContext(CompanyDetailContext);
    if (context === undefined) {
        throw new Error('useCompanyDetail must be used within an CompanyDetailProvider');
    }
    return context;
}
