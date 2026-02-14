import { useRef } from 'react';

export function useFormDirty<T>(formData: T) {
    const originalRef = useRef<T>(formData);

    const isDirty = JSON.stringify(formData) !== JSON.stringify(originalRef.current);

    const setOriginal = (data: T) => {
        originalRef.current = data;
    };

    return { isDirty, setOriginal };
}
