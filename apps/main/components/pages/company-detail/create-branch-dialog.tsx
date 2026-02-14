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
import { Branch, UpsertBranchInput } from '@repo/commons/types/account-service-schema.type';
import { hasGraphQLError } from '@repo/commons/utils/graphql';
import { convertErrorMessageListToObject } from '@repo/commons/utils/error-message';
import { useCompanyDetail } from './company-detail-container';

const UPSERT_BRANCH: TypedDocumentNode<{ upsertBranch: Branch }, { input: UpsertBranchInput }> =
    gql`
        mutation UpsertBranch($input: UpsertBranchInput!) {
            upsertBranch(input: $input) {
                publicId
                name
                code
                email
                isActive
                createdAt
                updatedAt
            }
        }
    `;

export default function CreateBranchDialog() {
    const ctx = useCompanyDetail();
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const [formValidation, setFormValidation] = useState<Record<string, string[]>>({});

    const client = useApolloClient();
    const [upsertBranch, { loading }] = useMutation(UPSERT_BRANCH);

    const resetForm = useCallback(() => {
        setName('');
        setCode('');
        setFormValidation({});
    }, []);

    const handleSubmit = useCallback(
        async (e: React.FormEvent) => {
            e.preventDefault();
            setFormValidation({});

            if (!ctx.company?.publicId) {
                toast.error('Company not found', {
                    position: 'top-center',
                });
                return;
            }

            try {
                const input: UpsertBranchInput = {
                    companyPublicId: ctx.company.publicId,
                    name,
                    code,
                    isActive: true,
                };

                const { data, error } = await upsertBranch({
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

                        if (err?.statusCode === 409 && id === 'BRANCH_CODE_ALREADY_EXISTS') {
                            setFormValidation({
                                code: ['A branch with this code already exists.'],
                            });
                            return;
                        }
                    }
                }

                if (data) {
                    client.refetchQueries({ include: ['GetCompanyDetail'] });
                    toast.success('Branch created successfully!', {
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
        [name, code, ctx.company?.publicId, upsertBranch, resetForm, client],
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
                <Button variant="outline" size="sm">
                    <IconPlus />
                    <span className="hidden lg:inline">Add Branch</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Create Branch</DialogTitle>
                        <DialogDescription>Enter the details for the new branch.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="branch-name">Name</Label>
                            <Input
                                id="branch-name"
                                placeholder="Branch name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                disabled={loading}
                                autoComplete="off"
                            />
                            <ShowErrorText error={formValidation} field="name" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="branch-code">Code</Label>
                            <Input
                                id="branch-code"
                                placeholder="Branch code"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                disabled={loading}
                                autoComplete="off"
                            />
                            <ShowErrorText error={formValidation} field="code" />
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
