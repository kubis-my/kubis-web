'use client';

import { Button } from '../components/button';

export default function NotFound() {
    return (
        <div className="flex min-h-screen items-center px-4 py-12 sm:px-6 md:px-8 lg:px-12 xl:px-16">
            <div className="w-full space-y-6 text-center">
                <div className="space-y-3">
                    <h1 className="animate-bounce text-4xl font-bold tracking-tighter sm:text-5xl">
                        404
                    </h1>
                    <p className="text-gray-500">
                        This page couldn't be found. It might have been moved, deleted, or never
                        existed.
                    </p>
                </div>
                <Button onClick={() => window.location.replace('/')}>Back to home</Button>
            </div>
        </div>
    );
}
