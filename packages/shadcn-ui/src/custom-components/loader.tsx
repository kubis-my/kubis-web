"use client";

import HashLoader from "react-spinners/HashLoader"

export default function Loader() {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <HashLoader
                size={30}
            />
        </div>
    )
}