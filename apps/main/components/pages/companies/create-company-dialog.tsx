'use client';

import { Button } from '@repo/shadcn-ui/components/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@repo/shadcn-ui/components/dialog';
import { Input } from '@repo/shadcn-ui/components/input';
import { Label } from '@repo/shadcn-ui/components/label';
import ShowErrorText from '@repo/shadcn-ui/custom-components/show-error-text';
import { IconPlus } from '@tabler/icons-react';
import { Loader2Icon } from 'lucide-react';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { gql, TypedDocumentNode } from '@apollo/client';
import { useApolloClient, useMutation } from '@apollo/client/react';
import { Company, UpsertCompanyInput } from '@repo/commons/types/account-service-schema.type';
import { hasGraphQLError } from '@repo/commons/utils/graphql';
import { convertErrorMessageListToObject } from '@repo/commons/utils/error-message';

const UPSERT_COMPANY: TypedDocumentNode<{ upsertCompany: Company }, { input: UpsertCompanyInput }> =
    gql`
        mutation UpsertCompany($input: UpsertCompanyInput!) {
            upsertCompany(input: $input) {
                publicId
                name
                registrationNo
                isActive
                createdAt
                updatedAt
            }
        }
    `;

export function CreateCompanyFormDialog() {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');
    const [registrationNo, setRegistrationNo] = useState('');
    const [formValidation, setFormValidation] = useState<Record<string, string[]>>({});

    const client = useApolloClient();
    const [upsertCompany, { loading }] = useMutation(UPSERT_COMPANY);

    const resetForm = useCallback(() => {
        setName('');
        setRegistrationNo('');
        setFormValidation({});
    }, []);

    const handleSubmit = useCallback(
        async (e: React.FormEvent) => {
            e.preventDefault();
            setFormValidation({});

            try {
                const input: UpsertCompanyInput = {
                    name,
                    registrationNo: registrationNo || undefined,
                    isActive: true,
                };

                const { data, error } = await upsertCompany({
                    variables: { input },
                    errorPolicy: 'all',
                });

                if (hasGraphQLError(error)) {
                    const gqlError = error.errors?.[0] || error.graphQLErrors?.[0];

                    if (gqlError) {
                        const err = gqlError.extensions?.originalError as
                            | Record<string, any>
                            | undefined;

                        if (err?.statusCode === 400 && Array.isArray(err?.message)) {
                            setFormValidation(
                                convertErrorMessageListToObject(Object.keys(input), err.message),
                            );
                            return;
                        }

                        const id = err?.id;

                        if (
                            err?.statusCode === 409 &&
                            id === 'COMPANY_REGISTRATION_NUMBER_EXISTS'
                        ) {
                            setFormValidation({
                                registrationNo: [
                                    'A company with this registration number already exists.',
                                ],
                            });
                            return;
                        }
                    }
                }

                if (data) {
                    client.refetchQueries({ include: ['GetUserCompanies'] });
                    toast.success('Company created successfully!', {
                        position: 'top-center',
                    });
                    resetForm();
                    setOpen(false);
                    return;
                }

                toast.error('An unexpected error occurred. Please try again.', {
                    position: 'top-center',
                });
            } catch {
                toast.error('Network error occurred. Please check your connection.', {
                    position: 'top-center',
                });
            }
        },
        [name, registrationNo, upsertCompany, resetForm, client],
    );

    return (
        <Dialog
            open={open}
            onOpenChange={(value) => {
                setOpen(value);
                if (!value) resetForm();
            }}
        >
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="size-7">
                    <IconPlus />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Create Company</DialogTitle>
                        <DialogDescription>
                            Enter the details for the new company.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="company-name">Name</Label>
                            <Input
                                id="company-name"
                                placeholder="Company name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                disabled={loading}
                                autoComplete="Off"
                            />
                            <ShowErrorText error={formValidation} field="name" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="company-registration-no">Registration Number</Label>
                            <Input
                                id="company-registration-no"
                                placeholder="Registration number (optional)"
                                value={registrationNo}
                                onChange={(e) => setRegistrationNo(e.target.value)}
                                disabled={loading}
                                autoComplete="Off"
                            />
                            <ShowErrorText error={formValidation} field="registrationNo" />
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="outline" disabled={loading}>
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button type="submit" disabled={loading}>
                            {!loading ? (
                                'Create'
                            ) : (
                                <>
                                    <Loader2Icon className="animate-spin" />
                                    Creating...
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
