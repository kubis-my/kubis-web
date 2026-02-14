'use client';

import {
    AUDIT_LOG_PAGINATION_SIZE,
    BRANCH_PAGINATION_SIZE,
    COMPANY_EMPLOYEE_PAGINATION_SIZE,
    ROUTE,
} from '@/root/libs/constants';
import { useDashboard01 } from '@/shadcn/dashboards/dashboard-01';
import { gql, TypedDocumentNode } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import {
    BranchPaginationInput,
    Company,
    CompanyEmployeePaginationInput,
} from '@repo/commons/types/account-service-schema.type';
import {
    AuditLogPaginationInput,
    PaginatedAuditLog,
} from '@repo/commons/types/audit-service-schema.type';
import { hasGraphQLError } from '@repo/commons/utils/graphql';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

type ExtendedCompany = Company & {
    auditLogs?: PaginatedAuditLog;
};

interface GetCompanyDetailResponse {
    getCompanyDetail: ExtendedCompany;
}

interface GetCompanyDetailVariables {
    companyPublicId: string;
    branchPaginationInput: BranchPaginationInput;
    companyEmployeePaginationInput: CompanyEmployeePaginationInput;
    auditLogPaginationInput: AuditLogPaginationInput;
}

export const GET_COMPANY_DETAIL: TypedDocumentNode<
    GetCompanyDetailResponse,
    GetCompanyDetailVariables
> = gql`
    query GetCompanyDetail(
        $companyPublicId: String!
        $branchPaginationInput: BranchPaginationInput!
        $companyEmployeePaginationInput: CompanyEmployeePaginationInput!
        $auditLogPaginationInput: AuditLogPaginationInput!
    ) {
        getCompanyDetail(companyPublicId: $companyPublicId) {
            publicId
            name
            registrationNo
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
            branches(pagination: $branchPaginationInput) {
                data {
                    publicId
                    name
                    code
                    email
                    isActive
                    branchPhysicalAddresses {
                        city
                        state
                        country
                        phoneCode
                        phoneNumber
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
            companyEmployees(pagination: $companyEmployeePaginationInput) {
                data {
                    publicId
                    internalId
                    phoneCode
                    phoneNumber
                    user {
                        publicId
                        firstName
                        lastName
                        nickname
                        credential {
                            email
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
            auditLogs(pagination: $auditLogPaginationInput) {
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
                            companyEmployee(companyPublicId: $companyPublicId) {
                                internalId
                            }
                        }
                        branch {
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
            }
        }
    }
`;

export type CompanyDetailContext = {
    company?: ExtendedCompany;
    isFetchingCompany: boolean;
};

const CompanyDetailContext = createContext<CompanyDetailContext | undefined>(undefined);

export default function CompanyDetailContainer({
    children,
    id,
}: Readonly<{ children: React.ReactNode; id: string }>) {
    const router = useRouter();
    const { updateBreadcrumbList } = useDashboard01();
    const {
        data,
        error,
        loading: isFetchingCompany,
    } = useQuery(GET_COMPANY_DETAIL, {
        variables: {
            companyPublicId: id,
            branchPaginationInput: {
                take: BRANCH_PAGINATION_SIZE,
            },
            companyEmployeePaginationInput: {
                take: COMPANY_EMPLOYEE_PAGINATION_SIZE,
            },
            auditLogPaginationInput: {
                take: AUDIT_LOG_PAGINATION_SIZE,
            },
        },
    });

    const [company, setCompany] = useState<ExtendedCompany | undefined>(undefined);

    useEffect(() => {
        setCompany(data?.getCompanyDetail);

        if (data?.getCompanyDetail) {
            updateBreadcrumbList([
                {
                    name: 'Company',
                    url: ROUTE.MY_ACCOUNT.COMPANY,
                },
                {
                    name: data.getCompanyDetail.name,
                },
            ]);

            return () => {
                updateBreadcrumbList([]);
            };
        }
    }, [data]);

    useEffect(() => {
        if (hasGraphQLError(error)) {
            const gqlError = error.errors?.[0] || error.graphQLErrors?.[0];

            if (gqlError) {
                const err = gqlError.extensions?.originalError as Record<string, any> | undefined;

                const id = err?.id;

                if (id === 'COMPANY_NOT_FOUND') {
                    toast.error('Company not found', {
                        position: 'top-center',
                    });
                    router.replace(ROUTE.MY_ACCOUNT.COMPANY);
                    return;
                }

                toast.error(err?.message || gqlError.message || 'Something went wrong', {
                    position: 'top-center',
                });
            }
        }
    }, [error, router]);

    const contextValue = useMemo(
        () => ({
            company,
            isFetchingCompany: error ? true : isFetchingCompany,
        }),
        [company, isFetchingCompany],
    );

    return (
        <CompanyDetailContext.Provider value={contextValue}>
            {children}
        </CompanyDetailContext.Provider>
    );
}

export function useCompanyDetail() {
    const context = useContext(CompanyDetailContext);
    if (context === undefined) {
        throw new Error('useCompanyDetail must be used within an CompanyDetailProvider');
    }
    return context;
}
