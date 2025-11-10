"use client";

import { Button } from "@repo/shadcn-ui/components/button"
import { CardContent } from "@repo/shadcn-ui/components/card"
import { Input } from "@repo/shadcn-ui/components/input"
import { Label } from "@repo/shadcn-ui/components/label"
import { GalleryVerticalEnd, Loader2Icon, } from "lucide-react"
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import ShowErrorText from "@repo/shadcn-ui/custom-components/show-error-text";
import { errorDict } from "@/root/libs/dict/error-dict";
import { toast } from "sonner";
import { MAIN_CLIENT_ID } from "@repo/commons/constant/client-id";
import { MAIN_APP_BASE_URL } from "@repo/commons/constant/base";
import { useSearchParams } from "next/navigation";
import { authClient } from "@repo/commons/lib/auth-client";
import { secureTokenStorage } from "@repo/commons/utils/secure-token-storage";


export default function SignInWithIdentifierForm() {
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [clientId, setClientId] = useState("");
    const [redirectUri, setRedirectUri] = useState("");
    const [formValidation, setFormValidation] = useState<Record<string, string[]>>({})
    const [isSignIn, setIsSignIn] = useState(false);

    const param = useSearchParams()

    const signInHandler = useCallback(async () => {
        setFormValidation({});
        setIsSignIn(true);

        // TODO: Add CSRF token protection to prevent cross-site request forgery attacks
        const res = await authClient.signIn({
            identifier,
            password,
            clientId,
            redirectUri,
        });

        if (res.code === 200) {
            const { twoFactorEnabled, sessionToken, redirectUrl } = res.raw;

            // Store session token encrypted in localStorage
            await secureTokenStorage.setSessionToken(sessionToken);

            // Redirect with verifier in URL hash
            const finalRedirectUrl = new URL(redirectUrl);

            if (res.raw.verifier) {
                finalRedirectUrl.hash = `verifier=${res.raw.verifier}`;
            }

            window.location.href = finalRedirectUrl.toString();
        } else if (res.code === 400) {
            setFormValidation(res.raw)
        } else if (res.code !== 500 && res.raw?.id) {
            const statusKey = res.raw?.id || "-1";

            if (statusKey in errorDict) {
                toast.error(errorDict[statusKey as keyof typeof errorDict],
                    {
                        position: "top-center"
                    }
                );
            } else {
                toast.error(
                    "An unexpected error occurred. Please contact our support team for assistance.",
                    {
                        position: "top-center",
                    }
                );
            }
        } else if (res.code === 500) {
            toast.error(
                "An unexpected error occurred. Please contact our support team for assistance.",
                {
                    position: "top-center",
                }
            );
        }

        setIsSignIn(false);

        return res;
    }, [
        identifier,
        password,
        clientId,
        redirectUri,
    ])

    useEffect(() => {
        setClientId(param.get("client_id") || MAIN_CLIENT_ID)
        setRedirectUri(param.get("redirect_uri") || MAIN_APP_BASE_URL)
    }, [param])

    return (
        <CardContent className="grid p-0 md:grid-cols-2 h-[500px]">
            <div className="relative hidden md:flex border-r justify-center items-center">
                <div className="relative w-full max-w-sm aspect-square">
                    <Image
                        priority
                        src="/sign-in.svg"
                        alt={"Sign in illustration"}
                        fill
                        className="object-contain dark:brightness-[0.2] dark:grayscale"
                    />
                </div>
            </div>
            <div className="p-6 md:p-8">
                <div className="flex flex-col gap-6">
                    <a href="#" className="flex items-center gap-2 self-center font-medium">
                        <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
                            <GalleryVerticalEnd className="size-4" />
                        </div>
                        Acme Inc.
                    </a>
                    <div className="flex flex-col items-center text-center">
                        <h1 className="text-xl font-bold">Welcome back</h1>
                        <p className="text-muted-foreground text-balance">
                            Login to your Workspace account
                        </p>
                    </div>
                    <div className="grid gap-3">
                        <Label >Identifier</Label>
                        <Input
                            placeholder="Enter your username or email"
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                        />
                        <ShowErrorText error={formValidation} field="identifier" />
                    </div>
                    <div className="grid gap-3">
                        <div className="flex items-center">
                            <Label>Password</Label>
                            {/* TODO: Add forgot password flow/page */}
                            <a
                                href="#"
                                className="ml-auto text-xs underline-offset-2 hover:underline"
                            >
                                Forgot your password?
                            </a>
                        </div>
                        <Input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <ShowErrorText error={formValidation} field="password" />
                    </div>
                    <Button
                        type="button"
                        className="w-full"
                        onClick={signInHandler}
                        disabled={isSignIn}
                    >
                        {
                            !isSignIn
                                ? <>Login</>
                                : (
                                    <>
                                        <Loader2Icon className="animate-spin" />
                                        Please wait
                                    </>
                                )
                        }
                    </Button>
                    <div className="text-center text-sm">
                        Don&apos;t have an account?{" "}
                        {/* TODO: Add sign-up page route */}
                        <Link href={""} className="underline underline-offset-4">
                            Register
                        </Link>
                    </div>
                </div>
            </div>
        </CardContent>
    )
}
