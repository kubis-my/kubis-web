'use client';

import { useAuth } from '@/shadcn/providers/auth-provider';
import { gql, TypedDocumentNode } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { Credential } from '@repo/commons/types/auth-service-schema.type';
import { createContext, useContext, useMemo } from 'react';

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
`;

export type ProfileContextType = {
    credential?: Credential;
    isFetchingCredential: boolean;
};

export const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export default function ProfileContainer({ children }: Readonly<{ children: React.ReactNode }>) {
    const auth = useAuth();

    const { data, loading: isFetchingCredential } = useQuery(GET_CREDENTIAL, {
        variables: {
            publicId: auth.authUser?.credential?.publicId ?? '-1',
        },
    });

    const contextValue = useMemo(
        () => ({
            credential: data?.getCredential,
            isFetchingCredential,
        }),
        [data, isFetchingCredential],
    );

    return <ProfileContext.Provider value={contextValue}>{children}</ProfileContext.Provider>;
}

export function useProfile() {
    const context = useContext(ProfileContext);
    if (context === undefined) {
        throw new Error('useProfile must be used within a ProfileContainer');
    }
    return context;
}
