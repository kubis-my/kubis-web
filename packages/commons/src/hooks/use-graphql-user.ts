"use client";

import { gql, TypedDocumentNode } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client/react";
import { CompleteProfileInput, User } from "../types/account-service-schema.type";


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