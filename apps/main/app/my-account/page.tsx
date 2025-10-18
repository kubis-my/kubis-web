import { MAIN_APP_BASE_URL } from '@repo/commons/constant/base'
import { MAIN_CLIENT_ID } from '@repo/commons/constant/client-id'
import AuthGuard from '@repo/shadcn-ui/guards/auth-guard'
import React from 'react'

export default function page() {
    return (
        <AuthGuard baseUrl={MAIN_APP_BASE_URL} clientId={MAIN_CLIENT_ID}>
            <div>page</div>
        </AuthGuard>
    )
}
