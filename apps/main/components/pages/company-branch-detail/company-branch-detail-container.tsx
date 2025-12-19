"use client";

import { BRANCH_EVENT_PAGINATION_SIZE, USER_ACCOUNT_PAGINATION_SIZE } from "@/root/libs/constants";
import { useDashboard01 } from "@/shadcn/dashboards/dashboard-01";
import { gql, TypedDocumentNode } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { Branch, BranchEventPaginationInput, UserAccountPaginationInput } from "@repo/commons/types/account-service-schema.type";
import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

interface GetBranchDetailResponse {
    getBranchDetail: Branch;
}

interface GetBranchDetailVariables {
    companyPublicId: string;
    branchPublicId: string;
    userAccountPaginationInput: UserAccountPaginationInput
    branchEventPaginationInput: BranchEventPaginationInput
}

export const GET_COMPANY_DETAIL: TypedDocumentNode<GetBranchDetailResponse, GetBranchDetailVariables> = gql`
    query GetBranchDetail($branchPublicId:String!,$companyPublicId:String!,$userAccountPaginationInput:UserAccountPaginationInput!,$branchEventPaginationInput:BranchEventPaginationInput!){
        getBranchDetail(branchPublicId:$branchPublicId){ 
            publicId
            name
            code
            email
            phoneCode
            phoneNumber
            isActive
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
                    code
                    status
                    joinedAt
                    phoneCode
                    phoneNumber
                    position
                    companyPublicId
                    branchPublicId
                    user {
                        publicId
                        firstName
                        lastName
                        nickname
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
                    StartDate
                    EndDate
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
        }
    }
`

export type CompanyBranchDetailContext = {
    branch?: Branch
    loading: boolean
}

const CompanyBranchDetailContext = createContext<CompanyBranchDetailContext | undefined>(undefined);

export default function CompanyBranchDetailContainer({ children, companyId, branchId }: Readonly<{ children: React.ReactNode, companyId: string, branchId: string }>) {
    const pathName = usePathname();

    const { updateBreadcrumbList } = useDashboard01();
    const { data, loading } = useQuery(GET_COMPANY_DETAIL, {
        variables: {
            companyPublicId: companyId,
            branchPublicId: branchId,
            userAccountPaginationInput: {
                take: USER_ACCOUNT_PAGINATION_SIZE
            },
            branchEventPaginationInput: {
                take: BRANCH_EVENT_PAGINATION_SIZE
            }
        }
    })

    const [branch, setBranch] = useState<Branch | undefined>(undefined);

    useEffect(() => {
        setBranch(data?.getBranchDetail);

        if (data?.getBranchDetail) {
            // ['my-account', 'company', '1', 'branch', '101']
            const companyURL = pathName.split(new RegExp(/\//g))
                .filter(Boolean)
                .splice(0, 3)
                .join("/");

            updateBreadcrumbList([
                {
                    name: data?.getBranchDetail.company.name,
                    url: "/" + companyURL
                },
                {
                    name: data?.getBranchDetail.code
                },
            ]);
        }
    }, [data])

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
