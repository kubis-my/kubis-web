'use client';

import { useState } from 'react';
import { useFormDirty } from '@repo/commons/hooks/use-form-dirty';
import { Skeleton } from '@/shadcn/components/skeleton';
import { useCompanyDetail } from './company-detail-container';
import {
    Card,
    CardHeader,
    CardContent,
    CardTitle,
    CardDescription,
} from '@/shadcn/components/card';
import {
    IconCalendar,
    IconCalendarClock,
    IconBuildingStore,
    IconFileDigit,
    IconCircleCheck,
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
import { Company, UpsertCompanyInput } from '@repo/commons/types/account-service-schema.type';
import { useApolloClient, useMutation } from '@apollo/client/react';
import { hasGraphQLError } from '@repo/commons/utils/graphql';
import { convertErrorMessageListToObject } from '@repo/commons/utils/error-message';
import ShowErrorText from '@/shadcn/custom-components/show-error-text';
import { toast } from 'sonner';

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

const initialFormData: UpsertCompanyInput = {
    name: '',
    registrationNo: '',
    isActive: false,
};

export default function CompanyDetailCard() {
    const ctx = useCompanyDetail();
    const isMobile = useIsMobile();
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState(initialFormData);
    const { isDirty, setOriginal } = useFormDirty(formData);
    const [formValidation, setFormValidation] = useState<Record<string, string[]>>({});

    const client = useApolloClient();
    const [upsertCompany, { loading }] = useMutation(UPSERT_COMPANY);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormValidation({});

        const { data, error } = await upsertCompany({
            variables: {
                input: {
                    ...formData,
                    publicId: ctx.company?.publicId,
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

                if (err?.statusCode === 409 && id === 'COMPANY_REGISTRATION_NUMBER_EXISTS') {
                    setFormValidation({
                        registrationNo: ['A company with this registration number already exists.'],
                    });
                    return;
                }
            }
        }

        if (data) {
            client.refetchQueries({ include: ['GetCompanyDetail'] });

            setOpen(false);
            toast.success('Company updated successfully!', {
                position: 'top-center',
            });
        }
    };

    const resetForm = () => {
        setFormValidation({});
        const data = {
            name: ctx.company?.name || '',
            registrationNo: ctx.company?.registrationNo || '',
            isActive: ctx.company?.isActive ?? false,
        };
        setFormData(data);
        setOriginal(data);
    };

    if (ctx.isFetchingCompany) return <Skeleton className="aspect-video rounded-xl" />;

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
                        <CardTitle className="font-semibold">Company Information</CardTitle>
                        <CardDescription className="text-xs">
                            Click to update details
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-col items-start gap-1.5 text-sm">
                        <div className="flex items-center justify-between border-b px-1 py-2">
                            <div className="flex items-center gap-2 text-sm font-medium">
                                <IconBuildingStore className="text-primary size-3.5 shrink-0" />{' '}
                                Name
                            </div>
                            <div className="text-muted-foreground text-xs">
                                {ctx.company?.name ?? '-'}
                            </div>
                        </div>
                        <div className="flex items-center justify-between border-b px-1 py-2">
                            <div className="flex items-center gap-2 font-medium">
                                <IconFileDigit className="size-3.5 shrink-0" /> Register Number
                            </div>
                            <div className="text-muted-foreground text-xs">
                                {ctx.company?.registrationNo.slice(0, 8)}
                            </div>
                        </div>
                        <div className="flex items-center justify-between border-b px-1 py-2">
                            <div className="flex items-center gap-2 font-medium">
                                <IconCalendar className="size-3.5 shrink-0" /> Register Date
                            </div>
                            <div className="text-muted-foreground text-xs">
                                {formatDateTime(ctx.company?.createdAt)}
                            </div>
                        </div>
                        <div className="flex items-center justify-between border-b px-1 py-2">
                            <div className="flex items-center gap-2 font-medium">
                                <IconCalendarClock className="size-3.5 shrink-0" /> Last Update
                            </div>
                            <div className="text-muted-foreground text-xs">
                                {formatDateTime(ctx.company?.updatedAt)}
                            </div>
                        </div>
                        <div className="flex items-center justify-between px-1 py-2">
                            <div className="flex items-center gap-2 font-medium">
                                <IconCircleCheck className="size-3.5 shrink-0" />
                                <span className="text-sm font-medium">Status</span>
                            </div>
                            <div className="text-muted-foreground text-xs">
                                {ctx.company?.isActive === undefined
                                    ? '-'
                                    : ctx.company?.isActive
                                      ? 'Active'
                                      : 'Inactive'}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </DrawerTrigger>
            <DrawerContent className={isMobile ? 'max-h-[85vh]' : 'max-w-md'}>
                <form onSubmit={handleSubmit} className="flex h-full flex-col">
                    <DrawerHeader className="gap-1">
                        <DrawerTitle>Update Company Information</DrawerTitle>
                        <DrawerDescription>
                            Make changes to your company details below. Update the company name,
                            registration number, and active status as needed.
                        </DrawerDescription>
                        <Separator />
                    </DrawerHeader>

                    <div className="flex-1 overflow-y-auto px-4 py-4">
                        <div className="flex flex-col gap-6">
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="companyName">Company Name</Label>
                                <Input
                                    id="companyName"
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData((prev) => ({ ...prev, name: e.target.value }))
                                    }
                                    placeholder="Enter company name"
                                    autoComplete="off"
                                />
                                <ShowErrorText error={formValidation} field="name" />
                            </div>

                            <div className="flex flex-col gap-2">
                                <Label htmlFor="registrationNumber">Registration Number</Label>
                                <Input
                                    id="registrationNumber"
                                    value={formData.registrationNo ?? ''}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            registrationNo: e.target.value,
                                        }))
                                    }
                                    placeholder="Enter registration number"
                                    autoComplete="off"
                                />
                                <ShowErrorText error={formValidation} field="registrationNo" />
                            </div>

                            <Separator />

                            <div className="flex flex-col gap-2">
                                <Label className="text-muted-foreground">Registration Date</Label>
                                <Input
                                    disabled
                                    value={formatDateTime(ctx.company?.createdAt)}
                                    className="cursor-not-allowed"
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <Label className="text-muted-foreground">Last Updated</Label>
                                <Input
                                    disabled
                                    value={formatDateTime(ctx.company?.updatedAt)}
                                    className="cursor-not-allowed"
                                />
                            </div>

                            <Separator />

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="status" className="cursor-pointer">
                                        Active Status
                                    </Label>
                                    <p className="text-muted-foreground text-xs">
                                        Enable or disable company operations
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
                        <Button type="submit" disabled={!isDirty || loading}>
                            {loading ? 'Saving...' : 'Save Changes'}
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
