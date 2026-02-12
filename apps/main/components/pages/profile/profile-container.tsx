"use client";

import { useDashboard01 } from "@/shadcn/dashboards/dashboard-01";
import { useAuth } from "@/shadcn/providers/auth-provider";
import { gql, TypedDocumentNode } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { Credential } from "@repo/commons/types/auth-service-schema.type";
import { createContext, useContext, useEffect, useMemo } from "react";

interface GetCredentialResponse {
    getCredential: Credential;
}

interface GetCredentialVariables {
    publicId: string;
}

const GET_CREDENTIAL: TypedDocumentNode<GetCredentialResponse, GetCredentialVariables> = gql`
    query GetCredential($publicId: ID!) {
        getCredential(publicId: $publicId) {
            publicId
            email
            isEnable2FA
            createdAt
            updatedAt
        }
    }
`

export type ProfileContextType = {
    credential?: Credential;
    isFetchingCredential: boolean;
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export default function ProfileContainer({ children }: Readonly<{ children: React.ReactNode }>) {
    const auth = useAuth();
    const { updateBreadcrumbList } = useDashboard01();

    const { data, loading: isFetchingCredential } = useQuery(GET_CREDENTIAL, {
        variables: {
            publicId: auth.authUser?.credential.publicId ?? "-1"
        }
    });

    useEffect(() => {
        updateBreadcrumbList([
            { name: "Profile" },
        ]);

        return () => {
            updateBreadcrumbList([]);
        };
    }, [updateBreadcrumbList]);

    const contextValue = useMemo(() => ({
        credential: data?.getCredential,
        isFetchingCredential,
    }), [data, isFetchingCredential]);

    return (
        <ProfileContext.Provider value={contextValue}>
            {children}
        </ProfileContext.Provider>
    );
}

export function useProfile() {
    const context = useContext(ProfileContext);
    if (context === undefined) {
        throw new Error("useProfile must be used within a ProfileContainer");
    }
    return context;
}
