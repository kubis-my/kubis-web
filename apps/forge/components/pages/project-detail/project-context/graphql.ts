import { gql, TypedDocumentNode } from '@apollo/client';
import type { UpsertProjectContextEnvironmentInput } from '@repo/commons/types/forge-service-schema.type';

interface UpsertContextEnvironmentResponse {
    upsertProjectContextEnvironmentForForge: { publicId: string };
}

interface UpsertContextEnvironmentVariables {
    input: UpsertProjectContextEnvironmentInput;
}

export const UPSERT_CONTEXT_ENVIRONMENT: TypedDocumentNode<
    UpsertContextEnvironmentResponse,
    UpsertContextEnvironmentVariables
> = gql`
    mutation UpsertProjectContextEnvironmentForForge($input: UpsertProjectContextEnvironmentInput!) {
        upsertProjectContextEnvironmentForForge(input: $input) {
            publicId
        }
    }
`;

interface RevealSecretResponse {
    revealProjectContextEnvironmentSecretForForge: string;
}

interface RevealSecretVariables {
    projectPublicId: string;
    entryId: string;
}

export const REVEAL_CONTEXT_ENVIRONMENT_SECRET: TypedDocumentNode<
    RevealSecretResponse,
    RevealSecretVariables
> = gql`
    query RevealProjectContextEnvironmentSecretForForge($projectPublicId: String!, $entryId: String!) {
        revealProjectContextEnvironmentSecretForForge(projectPublicId: $projectPublicId, entryId: $entryId)
    }
`;
