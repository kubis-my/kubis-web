"use client";

import React, { Suspense } from 'react'
import SignInWithIdentifierForm from './sign-in-identifier-form'

export default function SignInContainer() {
    return (
        <Suspense fallback={null}>
            <SignInWithIdentifierForm />
        </Suspense>
    )
}
