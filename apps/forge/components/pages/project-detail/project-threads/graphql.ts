import { gql, TypedDocumentNode } from '@apollo/client';
import type {
    SendThreadMessageInput,
    ThreadMessage,
    ThreadPageInfo,
    ThreadPaginationInput,
} from '@repo/commons/types/forge-service-schema.type';

interface GetThreadMessagesResponse {
    getThreadMessagesForForge: { data: ThreadMessage[]; pageInfo: ThreadPageInfo };
}

interface GetThreadMessagesVariables {
    projectPublicId: string;
    pagination: ThreadPaginationInput;
}

export const GET_THREAD_MESSAGES: TypedDocumentNode<
    GetThreadMessagesResponse,
    GetThreadMessagesVariables
> = gql`
    query GetThreadMessagesForForge(
        $projectPublicId: String!
        $pagination: ThreadPaginationInput!
    ) {
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
            pageInfo {
                endCursor
                hasMore
                total
            }
        }
    }
`;

interface SendMessageResponse {
    sendThreadMessageForForge: ThreadMessage;
}

interface SendMessageVariables {
    input: SendThreadMessageInput;
}

export const SEND_MESSAGE: TypedDocumentNode<SendMessageResponse, SendMessageVariables> = gql`
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

interface DeleteMessageResponse {
    deleteThreadMessageForForge: { publicId: string; deletedAt: string };
}

interface DeleteMessageVariables {
    publicId: string;
}

export const DELETE_MESSAGE: TypedDocumentNode<DeleteMessageResponse, DeleteMessageVariables> = gql`
    mutation DeleteThreadMessageForForge($publicId: String!) {
        deleteThreadMessageForForge(publicId: $publicId) {
            publicId
            deletedAt
        }
    }
`;

interface RestoreMessageResponse {
    restoreThreadMessageForForge: { publicId: string; content: string; deletedAt: string | null };
}

interface RestoreMessageVariables {
    publicId: string;
}

export const RESTORE_MESSAGE: TypedDocumentNode<RestoreMessageResponse, RestoreMessageVariables> =
    gql`
        mutation RestoreThreadMessageForForge($publicId: String!) {
            restoreThreadMessageForForge(publicId: $publicId) {
                publicId
                content
                deletedAt
            }
        }
    `;
