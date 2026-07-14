import { gql, TypedDocumentNode } from '@apollo/client';
import type {
    Attachment,
    PresignAttachmentUploadInput,
    PresignedAttachmentUpload,
} from '@repo/commons/types/forge-service-schema.type';

interface PresignAttachmentUploadResponse {
    presignAttachmentUploadForForge: PresignedAttachmentUpload;
}

interface PresignAttachmentUploadVariables {
    input: PresignAttachmentUploadInput;
}

export const PRESIGN_ATTACHMENT_UPLOAD: TypedDocumentNode<
    PresignAttachmentUploadResponse,
    PresignAttachmentUploadVariables
> = gql`
    mutation PresignAttachmentUploadForForge($input: PresignAttachmentUploadInput!) {
        presignAttachmentUploadForForge(input: $input) {
            publicId
            uploadUrl
            expiresInSeconds
        }
    }
`;

interface CompleteAttachmentUploadResponse {
    completeAttachmentUploadForForge: boolean;
}

interface CompleteAttachmentUploadVariables {
    publicId: string;
}

export const COMPLETE_ATTACHMENT_UPLOAD: TypedDocumentNode<
    CompleteAttachmentUploadResponse,
    CompleteAttachmentUploadVariables
> = gql`
    mutation CompleteAttachmentUploadForForge($publicId: String!) {
        completeAttachmentUploadForForge(publicId: $publicId)
    }
`;

interface AttachmentStatusResponse {
    attachmentForForge: Pick<Attachment, 'publicId' | 'status'>;
}

interface AttachmentStatusVariables {
    publicId: string;
}

export const ATTACHMENT_STATUS: TypedDocumentNode<
    AttachmentStatusResponse,
    AttachmentStatusVariables
> = gql`
    query AttachmentForForge($publicId: String!) {
        attachmentForForge(publicId: $publicId) {
            publicId
            status
        }
    }
`;
