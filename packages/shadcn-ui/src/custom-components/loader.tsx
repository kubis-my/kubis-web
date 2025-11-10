"use client";

import HashLoader from "react-spinners/HashLoader"

interface LoaderProps {
    message?: string;
}

export default function Loader({ message }: LoaderProps) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
            <HashLoader
                size={30}
            />
            {message && (
                <div className="w-full flex justify-center">
                    <p className="text-sm text-muted-foreground text-center">{message}</p>
                </div>
            )}
        </div>
    )
}