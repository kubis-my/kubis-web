"use client";

import { gql, TypedDocumentNode } from "@apollo/client";
import { useQuery, useLazyQuery } from "@apollo/client/react";
import {
    BranchPaginationInput,
    Company,
    CompanyPaginationInput,
    PaginatedCompany,
    UserAccountPaginationInput
} from "../types/account-service-schema.type";

interface GetUserCompaniesResponse {
    getUserCompanies: PaginatedCompany;
}

interface GetUserCompaniesVariables {
    pagination: CompanyPaginationInput;
}

const GET_USER_COMPANIES: TypedDocumentNode<GetUserCompaniesResponse, GetUserCompaniesVariables> = gql`
    query GetUserCompanies($pagination: CompanyPaginationInput!) {
        getUserCompanies(pagination: $pagination) {
            data {
                publicId
                name
                registrationNo
                isUnclassified
                logo
                isActive
                createdAt
                updatedAt
                totalActiveEmployee
                totalActiveBranch
            }
            pageInfo {
                endCursor
                hasNextPage
                total
                currentPage
                totalPages
            }
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

export const useUserCompanies = (pagination: CompanyPaginationInput) => {
    return useQuery(GET_USER_COMPANIES, {
        variables: { pagination }
    })
}

export const useLazyUserCompanies = () => {
    return useLazyQuery(GET_USER_COMPANIES);
}

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

export const useGetCompanyDetail = (variables: GetCompanyDetailVariables) => {
    return useQuery(GET_COMPANY_DETAIL, {
        variables
    })
}
