'use client';

import { useRef, useState } from 'react';
import { useFormDirty } from '@repo/commons/hooks/use-form-dirty';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/shadcn/components/card';
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/shadcn/components/sheet';
import { Button } from '@/shadcn/components/button';
import { Input } from '@/shadcn/components/input';
import { Label } from '@/shadcn/components/label';
import { Separator } from '@/shadcn/components/separator';
import { Skeleton } from '@/shadcn/components/skeleton';
import { TabsContent } from '@/shadcn/components/tabs';
import { IconUser } from '@tabler/icons-react';
import { useAuth } from '@/shadcn/providers/auth-provider';
import { useIsMobile } from '@/shadcn/hooks/use-mobile';
import ShowErrorText from '@/shadcn/custom-components/show-error-text';
import { useProfile } from '../profile-container';
import { gql, TypedDocumentNode } from '@apollo/client';
import { useApolloClient, useMutation } from '@apollo/client/react';
import { hasGraphQLError } from '@repo/commons/utils/graphql';
import { convertErrorMessageListToObject } from '@repo/commons/utils/error-message';
import { toast } from 'sonner';
import { UpdateUserInput, User } from '@repo/commons/types/account-service-schema.type';

const UPDATE_PROFILE: TypedDocumentNode<{ updateProfile: User }, { input: UpdateUserInput }> = gql`
    mutation UpdateProfile($input: UpdateUserInput!) {
        updateProfile(input: $input) {
            publicId
            firstName
            lastName
            nickname
            displayName
            profilePicture
            companies {
                publicId
                name
            }
            credential {
                publicId
                email
                username
            }
        }
    }
`;

const initialFormData: UpdateUserInput = {
    firstName: '',
    lastName: '',
    nickname: '',
};

interface ValidationErrorPayload {
    statusCode?: number;
    message?: string[];
}

export default function PersonalInformationSection() {
    const isMobile = useIsMobile();
    const client = useApolloClient();
    const { authUser, updateAuthUser } = useAuth();
    const { isFetchingCredential } = useProfile();
    const [open, setOpen] = useState(false);
    const sheetTitleRef = useRef<HTMLHeadingElement>(null);
    const [formData, setFormData] = useState(initialFormData);
    const { isDirty, setOriginal } = useFormDirty(formData);
    const [formValidation, setFormValidation] = useState<Record<string, string[]>>({});
    const [updateProfile, { loading }] = useMutation(UPDATE_PROFILE);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormValidation({});

        const { data, error } = await updateProfile({
            variables: {
                input: formData,
            },
            errorPolicy: 'all',
        });

        if (hasGraphQLError(error)) {
            const gqlError = error.errors?.[0] || error.graphQLErrors?.[0];

            if (gqlError) {
                const err = gqlError.extensions?.originalError as
                    | ValidationErrorPayload
                    | undefined;

                if (err?.statusCode === 400 && Array.isArray(err?.message)) {
                    setFormValidation(
                        convertErrorMessageListToObject(Object.keys(formData), err.message),
                    );

                    return;
                }
            }
        }

        if (data) {
            updateAuthUser(data.updateProfile);
            client.refetchQueries({ include: ['GetAuthUser'] });
            setOpen(false);
            toast.success('Personal information updated successfully!', {
                position: 'top-center',
            });
        }
    };

    const resetForm = () => {
        setFormValidation({});

        const data = {
            firstName: authUser?.firstName ?? '',
            lastName: authUser?.lastName ?? '',
            nickname: authUser?.nickname ?? '',
        };

        setFormData(data);
        setOriginal(data);
    };

    if (isFetchingCredential) {
        return (
            <TabsContent value="personal-information" className="flex-1">
                <Skeleton className="h-full rounded-xl" />
            </TabsContent>
        );
    }

    return (
        <TabsContent value="personal-information">
            <Sheet
                open={open}
                onOpenChange={(isOpen) => {
                    setOpen(isOpen);
                    if (isOpen) resetForm();
                }}
            >
                <SheetTrigger asChild>
                    <Card className="@container/card cursor-pointer">
                        <CardHeader>
                            <CardTitle className="font-semibold">Personal Information</CardTitle>
                            <CardDescription className="text-xs">
                                Click to update details
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-col items-start gap-1.5 text-sm">
                            <div className="flex items-center justify-between border-b px-1 py-2">
                                <div className="flex items-center gap-2 text-sm font-medium">
                                    <IconUser className="text-primary size-3.5 shrink-0" /> First
                                    Name
                                </div>
                                <div className="text-muted-foreground text-xs">
                                    {authUser?.firstName ?? '-'}
                                </div>
                            </div>
                            <div className="flex items-center justify-between border-b px-1 py-2">
                                <div className="flex items-center gap-2 font-medium">
                                    <IconUser className="size-3.5 shrink-0" /> Last Name
                                </div>
                                <div className="text-muted-foreground text-xs">
                                    {authUser?.lastName ?? '-'}
                                </div>
                            </div>
                            <div className="flex items-center justify-between px-1 py-2">
                                <div className="flex items-center gap-2 font-medium">
                                    <IconUser className="size-3.5 shrink-0" /> Nickname
                                </div>
                                <div className="text-muted-foreground text-xs">
                                    {authUser?.nickname ?? '-'}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </SheetTrigger>
                <SheetContent
                    side={isMobile ? 'bottom' : 'right'}
                    className={isMobile ? 'max-h-[85vh]' : 'max-w-md'}
                    onOpenAutoFocus={(e) => {
                        e.preventDefault();
                        sheetTitleRef.current?.focus();
                    }}
                >
                    <form onSubmit={handleSubmit} className="flex h-full flex-col">
                        <SheetHeader className="gap-1">
                            <SheetTitle ref={sheetTitleRef} tabIndex={-1} className="outline-none">
                                Update Personal Information
                            </SheetTitle>
                            <SheetDescription>
                                Make changes to your profile details below.
                            </SheetDescription>
                            <Separator />
                        </SheetHeader>

                        <div className="flex-1 overflow-y-auto px-4 py-4">
                            <div className="flex flex-col gap-6">
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="firstName">First Name</Label>
                                    <Input
                                        id="firstName"
                                        value={formData.firstName}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                firstName: e.target.value,
                                            }))
                                        }
                                        placeholder="Enter first name"
                                        autoComplete="off"
                                    />
                                    <ShowErrorText error={formValidation} field="firstName" />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="lastName">Last Name</Label>
                                    <Input
                                        id="lastName"
                                        value={formData.lastName}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                lastName: e.target.value,
                                            }))
                                        }
                                        placeholder="Enter last name"
                                        autoComplete="off"
                                    />
                                    <ShowErrorText error={formValidation} field="lastName" />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="nickname">Nickname</Label>
                                    <Input
                                        id="nickname"
                                        value={formData.nickname}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                nickname: e.target.value,
                                            }))
                                        }
                                        placeholder="Enter nickname"
                                        autoComplete="off"
                                    />
                                    <ShowErrorText error={formValidation} field="nickname" />
                                </div>
                            </div>
                        </div>

                        <SheetFooter className="mt-auto">
                            <Button type="submit" disabled={!isDirty || loading}>
                                {loading ? 'Saving...' : 'Save Changes'}
                            </Button>
                            <SheetClose asChild>
                                <Button type="button" variant="outline">
                                    Cancel
                                </Button>
                            </SheetClose>
                        </SheetFooter>
                    </form>
                </SheetContent>
            </Sheet>
        </TabsContent>
    );
}
