"use client";

import { INVITATION_PAGINATION_SIZE } from "@/root/libs/constants";
import { useDashboard01 } from "@/shadcn/dashboards/dashboard-01";
import { gql, TypedDocumentNode } from "@apollo/client";
import { useApolloClient, useMutation, useQuery } from "@apollo/client/react";
import { CredentialInvitationPaginationInput, PaginatedCredentialInvitation, UserAccount } from "@repo/commons/types/account-service-schema.type";
import { hasGraphQLError } from "@repo/commons/utils/graphql";
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

interface AcceptInvitationResponse {
    acceptInvitation: UserAccount;
}

interface AcceptInvitationVariables {
    userAccountPublicId: string;
}

interface DeclineInvitationResponse {
    declineInvitation: UserAccount;
}

interface DeclineInvitationVariables {
    userAccountPublicId: string;
}

const ACCEPT_INVITATION: TypedDocumentNode<AcceptInvitationResponse, AcceptInvitationVariables> = gql`
    mutation AcceptInvitation($userAccountPublicId: String!) {
        acceptInvitation(userAccountPublicId: $userAccountPublicId) {
            publicId
            status
            position
            joinedAt
            createdAt
        }
    }
`

const DECLINE_INVITATION: TypedDocumentNode<DeclineInvitationResponse, DeclineInvitationVariables> = gql`
    mutation DeclineInvitation($userAccountPublicId: String!) {
        declineInvitation(userAccountPublicId: $userAccountPublicId) {
            publicId
            status
            position
            createdAt
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

    const client = useApolloClient();

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

    const [acceptInvitationMutation] = useMutation(ACCEPT_INVITATION);
    const [declineInvitationMutation] = useMutation(DECLINE_INVITATION);

    const acceptInvitation = useCallback(async (id: string) => {
        try {
            const { data, error } = await acceptInvitationMutation({
                variables: { userAccountPublicId: id },
                errorPolicy: "all",
            });

            if (hasGraphQLError(error)) {
                toast.error("Failed to accept invitation", { position: "top-center" });
                return;
            }

            if (data) {
                client.refetchQueries({ include: ["GetCredentialInvitations"] });
                toast.success("Invitation accepted", { position: "top-center" });
                return;
            }

            toast.error("An unexpected error occurred. Please try again.", { position: "top-center" });
        } catch {
            toast.error("Network error occurred. Please check your connection.", { position: "top-center" });
        }
    }, [acceptInvitationMutation, client]);

    const declineInvitation = useCallback(async (id: string) => {
        try {
            const { data, error } = await declineInvitationMutation({
                variables: { userAccountPublicId: id },
                errorPolicy: "all",
            });

            if (hasGraphQLError(error)) {
                toast.error("Failed to decline invitation", { position: "top-center" });
                return;
            }

            if (data) {
                client.refetchQueries({ include: ["GetCredentialInvitations"] });
                toast.success("Invitation declined", { position: "top-center" });
                return;
            }

            toast.error("An unexpected error occurred. Please try again.", { position: "top-center" });
        } catch {
            toast.error("Network error occurred. Please check your connection.", { position: "top-center" });
        }
    }, [declineInvitationMutation, client]);

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
