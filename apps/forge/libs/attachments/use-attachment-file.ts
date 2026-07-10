'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ACCESS_TOKEN_KEY, getToken } from '@repo/commons/utils/storage-helpers';
import { getAttachmentUrl } from './storage-url';

type AttachmentRef = { publicId: string } | null;

export function useAttachmentFile(attachment: AttachmentRef, options?: { auto?: boolean }) {
    const [blobUrl, setBlobUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const blobUrlRef = useRef<string | null>(null);

    const fetchFile = useCallback(async (): Promise<string | null> => {
        if (!attachment) return null;
        if (blobUrlRef.current) return blobUrlRef.current;

        setLoading(true);
        setError(false);

        try {
            const token = getToken(ACCESS_TOKEN_KEY);
            const response = await fetch(getAttachmentUrl(attachment.publicId), {
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            });

            if (!response.ok) throw new Error('Failed to fetch attachment');

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            blobUrlRef.current = url;
            setBlobUrl(url);
            return url;
        } catch {
            setError(true);
            return null;
        } finally {
            setLoading(false);
        }
    }, [attachment]);

    useEffect(() => {
        if (options?.auto) void fetchFile();
    }, [attachment?.publicId, options?.auto]);

    useEffect(() => {
        return () => {
            if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current);
        };
    }, []);

    return { blobUrl, loading, error, fetchFile };
}
