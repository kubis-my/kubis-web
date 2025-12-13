"use client";

import { ROUTE } from "@/root/libs/constants";
import { useDashboard01 } from "@/shadcn/dashboards/dashboard-01";
import { gql, TypedDocumentNode } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { BranchPaginationInput, Company, UserAccountPaginationInput } from "@repo/commons/types/account-service-schema.type";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { BRANCH_PAGINATION_SIZE, USER_PAGINATION_SIZE } from "./hooks";

interface GetCompanyDetailResponse {
    getCompanyDetail: Company;
}

interface GetCompanyDetailVariables {
    companyPublicId: string;
    branchPaginationInput: BranchPaginationInput
    userAccountPaginationInput: UserAccountPaginationInput
}

export const GET_COMPANY_DETAIL: TypedDocumentNode<GetCompanyDetailResponse, GetCompanyDetailVariables> = gql`
    query GetCompanyDetail($companyPublicId:String!,$branchPaginationInput:BranchPaginationInput!,$userAccountPaginationInput:UserAccountPaginationInput!){
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
                    companyPublicId
                    branchPublicId
                    phoneCode
                    phoneNumber
                    position
                    code
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
            }
        }
    }
`

export type CompanyDetailContext = {
    company?: Company
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
                take: USER_PAGINATION_SIZE
            }
        }
    })

    const [company, setCompany] = useState<Company | undefined>(undefined);

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
