"use client";

import { gql, TypedDocumentNode } from "@apollo/client";
import { useQuery, useLazyQuery } from "@apollo/client/react";
import {
    CompanyPaginationInput,
    PaginatedCompany
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
