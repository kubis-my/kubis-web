"use client";

import { gql, TypedDocumentNode } from "@apollo/client";
import { useQuery } from "@apollo/client/react";

export type Company = {
    publicId: string
    name: string
    registrationNo: string
    logo?: string
}

export type User = {
    publicId: string
    firstName?: string
    lastName?: string
    nickname?: string
    displayName?: string
    profilePicture?: string
    bod?: string
    gender?: string
    companies?: Company[]
    createdAt: string
    updatedAt: string
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
                logo
            }
        }
    }
`;

export const useAuthUser = (options?: { skip?: boolean }) => {
    return useQuery(GET_AUTH_USER, options);
}