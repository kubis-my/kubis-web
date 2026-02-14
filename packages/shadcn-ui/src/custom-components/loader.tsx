'use client';

import HashLoader from 'react-spinners/HashLoader';

interface LoaderProps {
    message?: string;
}

export default function Loader({ message }: LoaderProps) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4">
            <HashLoader size={30} />
            {message && (
                <div className="flex w-full justify-center">
                    <p className="text-muted-foreground text-center text-sm">{message}</p>
                </div>
            )}
        </div>
    );
}
