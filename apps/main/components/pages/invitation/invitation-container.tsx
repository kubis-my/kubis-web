"use client";

import { INVITATION_PAGINATION_SIZE } from "@/root/libs/constants";
import { useDashboard01 } from "@/shadcn/dashboards/dashboard-01";
import { gql, TypedDocumentNode } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { CredentialInvitationPaginationInput, PaginatedCredentialInvitation } from "@repo/commons/types/account-service-schema.type";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

interface GetCredentialInvitationResponse {
    getCredentialInvitations: PaginatedCredentialInvitation;
}

interface GetCredentialInvitationVariables {
    pagination: CredentialInvitationPaginationInput;
}

const GET_CREDENTIAL_INVITATION: TypedDocumentNode<GetCredentialInvitationResponse, GetCredentialInvitationVariables> = gql`
    query GetCredentialInvitations($pagination: CredentialInvitationPaginationInput!) {
        getCredentialInvitations(pagination: $pagination) {
            data{
                publicId
                status
                position
                companyEmployee{
                    user{
                        publicId
                    }
                    company{
                        name
                    }
                }
                branch {
                    name
                    code
                }
                createdBy {
                    publicId
                    firstName
                    credential{
                        email
                    }
                }
                createdAt
                expiredAt
            }
            pageInfo {
                endCursor
                hasNextPage
                total
                currentPage
                totalPages
            }
            overview {
                pendingCount
                acceptedCount
                rejectedCount
                expiredCount
            }
        }
    }
`

export type InvitationContextType = {
    paginatedInvitation?: PaginatedCredentialInvitation;
    isLoading: boolean;
    acceptInvitation: (id: string) => void;
    declineInvitation: (id: string) => void;
};

const InvitationContext = createContext<InvitationContextType | undefined>(undefined);

export default function InvitationContainer({ children }: Readonly<{ children: React.ReactNode }>) {
    const { updateBreadcrumbList } = useDashboard01();

    const [paginatedInvitation, setPaginatedInvitation] = useState<PaginatedCredentialInvitation>();

    const { data, loading } = useQuery(GET_CREDENTIAL_INVITATION, {
        variables: {
            pagination: {
                take: INVITATION_PAGINATION_SIZE
            }
        }
    });

    useEffect(() => {
        setPaginatedInvitation(data?.getCredentialInvitations);
    }, [data]);

    useEffect(() => {
        updateBreadcrumbList([{ name: "Invitations" }]);
        return () => {
            updateBreadcrumbList([]);
        };
    }, [updateBreadcrumbList]);

    // TODO: Replace with GraphQL mutations when backend implements accept/decline invitation endpoints
    const acceptInvitation = useCallback((id: string) => {
        toast.success("Invitation accepted", { position: "top-center" });
    }, []);

    const declineInvitation = useCallback((id: string) => {
        toast.success("Invitation declined", { position: "top-center" });
    }, []);

    const contextValue = useMemo(
        () => ({
            paginatedInvitation,
            isLoading: loading,
            acceptInvitation,
            declineInvitation,
        }),
        [paginatedInvitation, loading, acceptInvitation, declineInvitation],
    );

    return (
        <InvitationContext.Provider value={contextValue}>
            {children}
        </InvitationContext.Provider>
    );
}

export function useInvitation() {
    const context = useContext(InvitationContext);
    if (context === undefined) {
        throw new Error("useInvitation must be used within an InvitationContainer");
    }
    return context;
}
