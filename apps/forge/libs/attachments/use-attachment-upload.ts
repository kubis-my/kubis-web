'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client/react';
import { toast } from 'sonner';
import { useSocket } from '@/shadcn/providers/socket-provider';
import { AttachmentEvent } from '@repo/commons/constant/web-socket';
import { AttachmentStatus } from '@repo/commons/types/forge-service-schema.type';
import { ATTACHMENT_MAX_SIZE_BYTES, resolveAttachmentCategory } from './constants';
import {
    ATTACHMENT_STATUS,
    COMPLETE_ATTACHMENT_UPLOAD,
    PRESIGN_ATTACHMENT_UPLOAD,
} from './graphql';
import type { PendingAttachment } from './types';
import { isPreviewable } from './utils';

const STATUS_POLL_INTERVAL_MS = 5000;
const STATUS_POLL_MAX_ATTEMPTS = 24;

export function useAttachmentUpload() {
    const [attachments, setAttachments] = useState<PendingAttachment[]>([]);
    const attachmentsRef = useRef(attachments);
    attachmentsRef.current = attachments;

    const { on, off, isConnected } = useSocket();
    const [presignUpload] = useMutation(PRESIGN_ATTACHMENT_UPLOAD);
    const [completeUpload] = useMutation(COMPLETE_ATTACHMENT_UPLOAD);
    const [fetchAttachmentStatus] = useLazyQuery(ATTACHMENT_STATUS, {
        fetchPolicy: 'network-only',
    });
    const pollAttemptsRef = useRef(new Map<string, number>());

    const updateAttachment = useCallback((publicId: string, patch: Partial<PendingAttachment>) => {
        setAttachments((prev) =>
            prev.map((attachment) =>
                attachment.publicId === publicId ? { ...attachment, ...patch } : attachment,
            ),
        );
    }, []);

    const uploadFile = useCallback(
        async (file: File) => {
            const category = resolveAttachmentCategory(file.type);

            if (!category) {
                toast.error(`${file.name}: file type not supported`, { position: 'top-center' });
                return;
            }

            if (file.size > ATTACHMENT_MAX_SIZE_BYTES[category]) {
                toast.error(`${file.name}: file is too large`, { position: 'top-center' });
                return;
            }

            let publicId: string;
            let uploadUrl: string;

            try {
                const { data } = await presignUpload({
                    variables: {
                        input: { filename: file.name, mimeType: file.type, size: file.size },
                    },
                });

                if (!data) throw new Error('Presign failed');

                publicId = data.presignAttachmentUploadForForge.publicId;
                uploadUrl = data.presignAttachmentUploadForForge.uploadUrl;
            } catch {
                toast.error(`Failed to start upload for ${file.name}`, { position: 'top-center' });
                return;
            }

            const previewUrl = isPreviewable(category) ? URL.createObjectURL(file) : undefined;

            setAttachments((prev) => [
                ...prev,
                {
                    publicId,
                    filename: file.name,
                    mimeType: file.type,
                    size: file.size,
                    phase: 'UPLOADING',
                    previewUrl,
                },
            ]);

            try {
                const putResponse = await fetch(uploadUrl, {
                    method: 'PUT',
                    headers: { 'Content-Type': file.type },
                    body: file,
                });

                if (!putResponse.ok) throw new Error('Upload to storage failed');

                updateAttachment(publicId, { phase: 'PROCESSING' });
                await completeUpload({ variables: { publicId } });
            } catch {
                updateAttachment(publicId, { phase: 'FAILED', error: 'Upload failed' });
            }
        },
        [presignUpload, completeUpload, updateAttachment],
    );

    const addFiles = useCallback(
        (files: FileList | File[]) => {
            Array.from(files).forEach((file) => {
                void uploadFile(file);
            });
        },
        [uploadFile],
    );

    const removeAttachment = useCallback((publicId: string) => {
        setAttachments((prev) => {
            const target = prev.find((attachment) => attachment.publicId === publicId);
            if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl);
            return prev.filter((attachment) => attachment.publicId !== publicId);
        });
    }, []);

    const reset = useCallback(() => {
        setAttachments((prev) => {
            prev.forEach((attachment) => {
                if (attachment.previewUrl) URL.revokeObjectURL(attachment.previewUrl);
            });
            return [];
        });
    }, []);

    useEffect(() => {
        if (!isConnected) return;

        const onStatusChanged = (data: unknown) => {
            const { publicId, status } = (data ?? {}) as {
                publicId?: string;
                status?: AttachmentStatus;
            };

            if (!publicId) return;

            if (status === AttachmentStatus.COMPLETED) {
                updateAttachment(publicId, { phase: 'COMPLETED' });
            } else if (status === AttachmentStatus.FAILED) {
                updateAttachment(publicId, { phase: 'FAILED', error: 'Verification failed' });
            }
        };

        on(AttachmentEvent.STATUS_CHANGED, onStatusChanged);
        return () => off(AttachmentEvent.STATUS_CHANGED, onStatusChanged);
    }, [isConnected, on, off, updateAttachment]);

    // Fallback for missed socket events: poll PROCESSING attachments so a dropped
    // STATUS_CHANGED event can't leave an upload stuck and block submission
    useEffect(() => {
        const processingIds = attachments
            .filter((attachment) => attachment.phase === 'PROCESSING')
            .map((attachment) => attachment.publicId);

        if (processingIds.length === 0) return;

        const interval = setInterval(() => {
            processingIds.forEach(async (publicId) => {
                const attempts = (pollAttemptsRef.current.get(publicId) ?? 0) + 1;

                if (attempts > STATUS_POLL_MAX_ATTEMPTS) {
                    pollAttemptsRef.current.delete(publicId);
                    updateAttachment(publicId, {
                        phase: 'FAILED',
                        error: 'Verification timed out',
                    });
                    return;
                }

                pollAttemptsRef.current.set(publicId, attempts);

                try {
                    const { data } = await fetchAttachmentStatus({ variables: { publicId } });
                    const status = data?.attachmentForForge?.status;

                    if (status === AttachmentStatus.COMPLETED) {
                        pollAttemptsRef.current.delete(publicId);
                        updateAttachment(publicId, { phase: 'COMPLETED' });
                    } else if (status === AttachmentStatus.FAILED) {
                        pollAttemptsRef.current.delete(publicId);
                        updateAttachment(publicId, {
                            phase: 'FAILED',
                            error: 'Verification failed',
                        });
                    }
                } catch {
                    // Transient poll failure — the next tick retries
                }
            });
        }, STATUS_POLL_INTERVAL_MS);

        return () => clearInterval(interval);
    }, [attachments, fetchAttachmentStatus, updateAttachment]);

    useEffect(() => {
        return () => {
            attachmentsRef.current.forEach((attachment) => {
                if (attachment.previewUrl) URL.revokeObjectURL(attachment.previewUrl);
            });
        };
    }, []);

    const completedPublicIds = useMemo(
        () =>
            attachments
                .filter((attachment) => attachment.phase === 'COMPLETED')
                .map((attachment) => attachment.publicId),
        [attachments],
    );

    const isUploading = useMemo(
        () =>
            attachments.some(
                (attachment) =>
                    attachment.phase === 'UPLOADING' || attachment.phase === 'PROCESSING',
            ),
        [attachments],
    );

    return { attachments, addFiles, removeAttachment, reset, completedPublicIds, isUploading };
}
