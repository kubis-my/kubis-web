"use client";

import { gql, TypedDocumentNode } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client/react";

export type Company = {
    publicId: string
    name: string
    registrationNo: string
    logo?: string
}

export type User = {
    publicId: string
    firstName: string
    lastName: string
    nickname: string
    displayName?: string
    profilePicture?: string
    bod?: string
    gender?: string
    companies?: Company[]
    credential?: Credential
    createdAt: string
    updatedAt: string
}

export type Credential = {
    publicId: string,
    email: string,
    username: string | null
}

export type CompleteProfileInput = {
    firstName: string
    lastName: string
    nickname: string
}

const GET_AUTH_USER: TypedDocumentNode<{ getAuthUser: User }> = gql`
    query GetAuthUser {
        getAuthUser {
            publicId
            firstName
            lastName
            nickname
            displayName
            profilePicture
            bod
            gender
            createdAt
            updatedAt
            companies {
                publicId
                name
                registrationNo
                isUnclassified
                logo
            }
            credential{
                publicId
                email
                username
            }
        }
    }
`;

export const useAuthUser = (options?: { skip?: boolean }) => {
    return useQuery(GET_AUTH_USER, options);
}

const COMPLETE_PROFILE: TypedDocumentNode<{ completeProfile: User }, { input: CompleteProfileInput }> = gql`
    mutation CompleteProfile($input: CompleteProfileInput!) {
        completeProfile(input: $input) {
            publicId
            firstName
            lastName
            nickname
            displayName
            profilePicture
            bod
            gender
            createdAt
            updatedAt
            companies {
                publicId
                name
                registrationNo
                isUnclassified
                logo
            }
        }
    }
`

export const useCompleteProfile = () => {
    return useMutation(COMPLETE_PROFILE);
}