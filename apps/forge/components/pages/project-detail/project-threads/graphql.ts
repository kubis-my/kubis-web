import { gql, TypedDocumentNode } from '@apollo/client';
import type { ThreadMessage } from '@repo/commons/types/forge-service-schema.type';

export const GET_THREAD_MESSAGES: TypedDocumentNode<
    { getThreadMessagesForForge: { data: ThreadMessage[] } },
    { projectPublicId: string; pagination: { take: number } }
> = gql`
    query GetThreadMessagesForForge($projectPublicId: String!, $pagination: ThreadPaginationInput!) {
        getThreadMessagesForForge(projectPublicId: $projectPublicId, pagination: $pagination) {
            data {
                publicId
                senderId
                senderName
                senderInitials
                content
                replyToId
                deletedAt
                createdAt
            }
        }
    }
`;

export const SEND_MESSAGE: TypedDocumentNode<
    { sendThreadMessageForForge: ThreadMessage },
    { input: { projectPublicId: string; content: string; replyToPublicId?: string } }
> = gql`
    mutation SendThreadMessageForForge($input: SendThreadMessageInput!) {
        sendThreadMessageForForge(input: $input) {
            publicId
            senderId
            senderName
            senderInitials
            content
            replyToId
            deletedAt
            createdAt
        }
    }
`;

export const DELETE_MESSAGE: TypedDocumentNode<
    { deleteThreadMessageForForge: { publicId: string; deletedAt: string } },
    { publicId: string }
> = gql`
    mutation DeleteThreadMessageForForge($publicId: String!) {
        deleteThreadMessageForForge(publicId: $publicId) {
            publicId
            deletedAt
        }
    }
`;

export const RESTORE_MESSAGE: TypedDocumentNode<
    { restoreThreadMessageForForge: { publicId: string; content: string; deletedAt: string | null } },
    { publicId: string }
> = gql`
    mutation RestoreThreadMessageForForge($publicId: String!) {
        restoreThreadMessageForForge(publicId: $publicId) {
            publicId
            content
            deletedAt
        }
    }
`;
