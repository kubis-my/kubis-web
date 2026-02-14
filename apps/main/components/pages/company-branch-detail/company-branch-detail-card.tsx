'use client';

import { useState } from 'react';
import { useFormDirty } from '@repo/commons/hooks/use-form-dirty';
import { Skeleton } from '@/shadcn/components/skeleton';
import { useCompanyBranchDetail } from './company-branch-detail-container';
import {
    Card,
    CardHeader,
    CardContent,
    CardTitle,
    CardDescription,
} from '@/shadcn/components/card';
import {
    IconBuildingStore,
    IconCode,
    IconMail,
    IconPhone,
    IconCircleCheck,
    IconCalendar,
    IconCalendarClock,
} from '@tabler/icons-react';
import {
    Drawer,
    DrawerContent,
    DrawerTrigger,
    DrawerHeader,
    DrawerTitle,
    DrawerDescription,
    DrawerFooter,
    DrawerClose,
} from '@/shadcn/components/drawer';
import { useIsMobile } from '@/shadcn/hooks/use-mobile';
import { Label } from '@/shadcn/components/label';
import { Input } from '@/shadcn/components/input';
import { Separator } from '@/shadcn/components/separator';
import { Button } from '@/shadcn/components/button';
import { Switch } from '@/shadcn/components/switch';
import { formatDateTime } from '@repo/commons/utils/date';
import { gql, TypedDocumentNode } from '@apollo/client';
import { useApolloClient, useMutation } from '@apollo/client/react';
import { Branch, UpsertBranchInput } from '@repo/commons/types/account-service-schema.type';
import { hasGraphQLError } from '@repo/commons/utils/graphql';
import { convertErrorMessageListToObject } from '@repo/commons/utils/error-message';
import ShowErrorText from '@repo/shadcn-ui/custom-components/show-error-text';
import { toast } from 'sonner';

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

const initialFormData: Omit<UpsertBranchInput, 'publicId' | 'companyPublicId'> = {
    name: '',
    code: '',
    email: '',
    isActive: false,
};

export default function CompanyBranchDetailCard() {
    const ctx = useCompanyBranchDetail();
    const isMobile = useIsMobile();
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState(initialFormData);
    const { isDirty, setOriginal } = useFormDirty(formData);
    const [formValidation, setFormValidation] = useState<Record<string, string[]>>({});

    const client = useApolloClient();
    const [upsertBranch, { loading: submitting }] = useMutation(UPSERT_BRANCH);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormValidation({});

        const { data, error } = await upsertBranch({
            variables: {
                input: {
                    ...formData,
                    publicId: ctx.branch?.publicId,
                    companyPublicId: ctx.branch?.company.publicId!,
                },
            },
            errorPolicy: 'all',
        });

        if (hasGraphQLError(error)) {
            const gqlError = error.errors?.[0] || error.graphQLErrors?.[0];

            if (gqlError) {
                const err = gqlError.extensions?.originalError as Record<string, any> | undefined;

                if (err?.statusCode === 400 && Array.isArray(err?.message)) {
                    setFormValidation(
                        convertErrorMessageListToObject(Object.keys(formData), err.message),
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
            client.refetchQueries({ include: ['GetBranchDetail'] });
            toast.success('Branch updated successfully!', { position: 'top-center' });
            setOpen(false);
        }
    };

    const resetForm = () => {
        setFormValidation({});
        const data = {
            name: ctx.branch?.name || '',
            code: ctx.branch?.code || '',
            email: ctx.branch?.email || '',
            isActive: ctx.branch?.isActive ?? false,
        };
        setFormData(data);
        setOriginal(data);
    };

    if (ctx.loading) return <Skeleton className="aspect-video rounded-xl" />;

    return (
        <Drawer
            open={open}
            onOpenChange={(isOpen) => {
                setOpen(isOpen);
                if (isOpen) resetForm();
            }}
            direction={isMobile ? 'bottom' : 'right'}
        >
            <DrawerTrigger asChild>
                <Card className="@container/card cursor-pointer">
                    <CardHeader>
                        <CardTitle className="font-semibold">Branch Information</CardTitle>
                        <CardDescription className="text-xs">
                            Click to update details
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-col items-start gap-1.5 text-sm">
                        <div className="flex items-center justify-between border-b px-1 py-2">
                            <div className="flex items-center gap-2 text-sm font-medium">
                                <IconBuildingStore className="text-primary size-3.5 shrink-0" />{' '}
                                Branch Name
                            </div>
                            <div className="text-muted-foreground text-xs">
                                {ctx.branch?.name ?? '-'}
                            </div>
                        </div>
                        <div className="flex items-center justify-between border-b px-1 py-2">
                            <div className="flex items-center gap-2 font-medium">
                                <IconCode className="size-3.5 shrink-0" /> Branch Code
                            </div>
                            <div className="text-muted-foreground text-xs">
                                {ctx.branch?.code.slice(0, 8)}
                            </div>
                        </div>
                        <div className="flex items-center justify-between border-b px-1 py-2">
                            <div className="flex items-center gap-2 font-medium">
                                <IconMail className="size-3.5 shrink-0" /> Email
                            </div>
                            <div className="text-muted-foreground text-xs">
                                {ctx.branch?.email ?? '-'}
                            </div>
                        </div>
                        <div className="flex items-center justify-between border-b px-1 py-2">
                            <div className="flex items-center gap-2 font-medium">
                                <IconCalendar className="size-3.5 shrink-0" /> Register Date
                            </div>
                            <div className="text-muted-foreground text-xs">
                                {formatDateTime(ctx.branch?.createdAt)}
                            </div>
                        </div>
                        <div className="flex items-center justify-between border-b px-1 py-2">
                            <div className="flex items-center gap-2 font-medium">
                                <IconCalendarClock className="size-3.5 shrink-0" /> Last Update
                            </div>
                            <div className="text-muted-foreground text-xs">
                                {formatDateTime(ctx.branch?.updatedAt)}
                            </div>
                        </div>
                        <div className="flex items-center justify-between px-1 py-2">
                            <div className="flex items-center gap-2 font-medium">
                                <IconCircleCheck className="size-3.5 shrink-0" />
                                <span className="text-sm font-medium">Status</span>
                            </div>
                            <div className="text-muted-foreground text-xs">
                                {ctx.branch?.isActive ? 'Active' : 'Inactive'}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </DrawerTrigger>
            <DrawerContent className={isMobile ? 'max-h-[85vh]' : 'max-w-md'}>
                <form onSubmit={handleSubmit} className="flex h-full flex-col">
                    <DrawerHeader className="gap-1">
                        <DrawerTitle>Update Branch Information</DrawerTitle>
                        <DrawerDescription>
                            Make changes to your branch details below. Update the branch name, code,
                            contact information, and active status as needed.
                        </DrawerDescription>
                        <Separator />
                    </DrawerHeader>

                    <div className="flex-1 overflow-y-auto px-4 py-4">
                        <div className="flex flex-col gap-6">
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="branchName">Branch Name</Label>
                                <Input
                                    id="branchName"
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData((prev) => ({ ...prev, name: e.target.value }))
                                    }
                                    placeholder="Enter branch name"
                                    autoComplete="off"
                                />
                                <ShowErrorText error={formValidation} field="name" />
                            </div>

                            <div className="flex flex-col gap-2">
                                <Label htmlFor="branchCode">Branch Code</Label>
                                <Input
                                    id="branchCode"
                                    value={formData.code}
                                    onChange={(e) =>
                                        setFormData((prev) => ({ ...prev, code: e.target.value }))
                                    }
                                    placeholder="Enter branch code"
                                    autoComplete="off"
                                />
                                <ShowErrorText error={formValidation} field="code" />
                            </div>
                            <Separator />
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.email ?? ''}
                                    onChange={(e) =>
                                        setFormData((prev) => ({ ...prev, email: e.target.value }))
                                    }
                                    placeholder="Enter email address"
                                    autoComplete="off"
                                />
                                <ShowErrorText error={formValidation} field="email" />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="status" className="cursor-pointer">
                                        Active Status
                                    </Label>
                                    <p className="text-muted-foreground text-xs">
                                        Enable or disable branch operations
                                    </p>
                                </div>
                                <Switch
                                    id="status"
                                    checked={formData.isActive}
                                    onCheckedChange={(checked) =>
                                        setFormData((prev) => ({ ...prev, isActive: checked }))
                                    }
                                />
                            </div>
                        </div>
                    </div>
                    <DrawerFooter className="mt-auto">
                        <Button type="submit" disabled={!isDirty || submitting}>
                            {submitting ? 'Saving...' : 'Save Changes'}
                        </Button>
                        <DrawerClose asChild>
                            <Button type="button" variant="outline">
                                Cancel
                            </Button>
                        </DrawerClose>
                    </DrawerFooter>
                </form>
            </DrawerContent>
        </Drawer>
    );
}
