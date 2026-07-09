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
import { IconMapPin, IconPhone, IconMailbox, IconWorld, IconBuilding } from '@tabler/icons-react';
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
import { gql, TypedDocumentNode } from '@apollo/client';
import {
    Branch,
    UpsertBranchPhysicalAddressInput,
} from '@repo/commons/types/account-service-schema.type';
import { useApolloClient, useMutation } from '@apollo/client/react';
import { hasGraphQLError } from '@repo/commons/utils/graphql';
import { convertErrorMessageListToObject } from '@repo/commons/utils/error-message';
import ShowErrorText from '@/shadcn/custom-components/show-error-text';
import { toast } from 'sonner';
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
    InputGroupText,
} from '@/shadcn/components/input-group';

const UPSERT_BRANCH_PHYSICAL_ADDRESS: TypedDocumentNode<
    { upsertBranchPhysicalAddress: Branch },
    { branchPublicId: string; input: UpsertBranchPhysicalAddressInput }
> = gql`
    mutation UpsertBranchPhysicalAddress(
        $branchPublicId: String!
        $input: UpsertBranchPhysicalAddressInput!
    ) {
        upsertBranchPhysicalAddress(branchPublicId: $branchPublicId, input: $input) {
            publicId
            branchPhysicalAddresses {
                street
                city
                state
                postalCode
                country
                phoneCode
                phoneNumber
            }
        }
    }
`;

const initialFormData: UpsertBranchPhysicalAddressInput = {
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    phoneCode: '+60',
    phoneNumber: '',
};

export default function CompanyBranchPhysicalAddressCard() {
    const ctx = useCompanyBranchDetail();
    const isMobile = useIsMobile();
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState(initialFormData);
    const { isDirty, setOriginal } = useFormDirty(formData);
    const [formValidation, setFormValidation] = useState<Record<string, string[]>>({});

    const client = useApolloClient();
    const [upsertPhysicalAddress, { loading }] = useMutation(UPSERT_BRANCH_PHYSICAL_ADDRESS);

    if (ctx.loading) return <Skeleton className="aspect-video rounded-xl" />;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormValidation({});

        if (!ctx.branch?.publicId) return;

        try {
            const { data, error } = await upsertPhysicalAddress({
                variables: {
                    branchPublicId: ctx.branch.publicId,
                    input: formData,
                },
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
                            convertErrorMessageListToObject(Object.keys(formData), err.message),
                        );
                        return;
                    }
                }

                toast.error('Something went wrong. Please try again.', {
                    position: 'top-center',
                });
                return;
            }

            if (data) {
                client.refetchQueries({ include: ['GetBranchDetail'] });

                setOpen(false);
                toast.success('Physical address updated successfully!', {
                    position: 'top-center',
                });
            }
        } catch {
            toast.error('Network error occurred. Please check your connection.', {
                position: 'top-center',
            });
        }
    };

    const resetForm = () => {
        setFormValidation({});
        const data = {
            street: ctx.branch?.branchPhysicalAddresses?.street || '',
            city: ctx.branch?.branchPhysicalAddresses?.city || '',
            state: ctx.branch?.branchPhysicalAddresses?.state || '',
            postalCode: ctx.branch?.branchPhysicalAddresses?.postalCode || '',
            country: ctx.branch?.branchPhysicalAddresses?.country || '',
            phoneCode: ctx.branch?.branchPhysicalAddresses?.phoneCode || '+60',
            phoneNumber: ctx.branch?.branchPhysicalAddresses?.phoneNumber || '',
        };
        setFormData(data);
        setOriginal(data);
    };

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
                        <CardTitle className="font-semibold">Physical Address</CardTitle>
                        <CardDescription className="text-xs">
                            Click to update address
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-col items-start gap-1.5 text-sm">
                        <div className="flex items-center justify-between border-b px-1 py-2">
                            <div className="flex items-center gap-2 text-sm font-medium">
                                <IconBuilding className="text-primary size-3.5 shrink-0" /> Street
                            </div>
                            <div className="text-muted-foreground text-xs">
                                {ctx.branch?.branchPhysicalAddresses?.street ?? '-'}
                            </div>
                        </div>
                        <div className="flex items-center justify-between border-b px-1 py-2">
                            <div className="flex items-center gap-2 font-medium">
                                <IconMapPin className="size-3.5 shrink-0" /> City
                            </div>
                            <div className="text-muted-foreground text-xs">
                                {ctx.branch?.branchPhysicalAddresses?.city ?? '-'}
                            </div>
                        </div>
                        <div className="flex items-center justify-between border-b px-1 py-2">
                            <div className="flex items-center gap-2 font-medium">
                                <IconMapPin className="size-3.5 shrink-0" /> State
                            </div>
                            <div className="text-muted-foreground text-xs">
                                {ctx.branch?.branchPhysicalAddresses?.state ?? '-'}
                            </div>
                        </div>
                        <div className="flex items-center justify-between border-b px-1 py-2">
                            <div className="flex items-center gap-2 font-medium">
                                <IconMailbox className="size-3.5 shrink-0" /> Postal Code
                            </div>
                            <div className="text-muted-foreground text-xs">
                                {ctx.branch?.branchPhysicalAddresses?.postalCode ?? '-'}
                            </div>
                        </div>
                        <div className="flex items-center justify-between border-b px-1 py-2">
                            <div className="flex items-center gap-2 font-medium">
                                <IconWorld className="size-3.5 shrink-0" /> Country
                            </div>
                            <div className="text-muted-foreground text-xs">
                                {ctx.branch?.branchPhysicalAddresses?.country ?? '-'}
                            </div>
                        </div>
                        <div className="flex items-center justify-between px-1 py-2">
                            <div className="flex items-center gap-2 font-medium">
                                <IconPhone className="size-3.5 shrink-0" />
                                <span className="text-sm font-medium">Phone</span>
                            </div>
                            <div className="text-muted-foreground text-xs">
                                {ctx.branch?.branchPhysicalAddresses?.phoneCode &&
                                ctx.branch?.branchPhysicalAddresses?.phoneNumber
                                    ? `${ctx.branch?.branchPhysicalAddresses?.phoneCode}${ctx.branch?.branchPhysicalAddresses?.phoneNumber}`
                                    : '-'}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </DrawerTrigger>
            <DrawerContent className={isMobile ? 'max-h-[85vh]' : 'max-w-md'}>
                <form onSubmit={handleSubmit} className="flex h-full flex-col">
                    <DrawerHeader className="gap-1">
                        <DrawerTitle>Update Physical Address</DrawerTitle>
                        <DrawerDescription>
                            Make changes to your branch&apos;s physical address below. Update the
                            street, city, state, postal code, country, and phone number as needed.
                        </DrawerDescription>
                        <Separator />
                    </DrawerHeader>

                    <div className="flex-1 overflow-y-auto px-4 py-4">
                        <div className="flex flex-col gap-6">
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="street">Street Address</Label>
                                <Input
                                    id="street"
                                    value={formData.street}
                                    onChange={(e) =>
                                        setFormData((prev) => ({ ...prev, street: e.target.value }))
                                    }
                                    placeholder="Enter street address"
                                />
                                <ShowErrorText error={formValidation} field="street" />
                            </div>

                            <div className="flex flex-col gap-2">
                                <Label htmlFor="city">City</Label>
                                <Input
                                    id="city"
                                    value={formData.city}
                                    onChange={(e) =>
                                        setFormData((prev) => ({ ...prev, city: e.target.value }))
                                    }
                                    placeholder="Enter city"
                                />
                                <ShowErrorText error={formValidation} field="city" />
                            </div>

                            <div className="flex flex-col gap-2">
                                <Label htmlFor="state">State</Label>
                                <Input
                                    id="state"
                                    value={formData.state}
                                    onChange={(e) =>
                                        setFormData((prev) => ({ ...prev, state: e.target.value }))
                                    }
                                    placeholder="Enter state"
                                />
                                <ShowErrorText error={formValidation} field="state" />
                            </div>

                            <div className="flex flex-col gap-2">
                                <Label htmlFor="postalCode">Postal Code</Label>
                                <Input
                                    id="postalCode"
                                    value={formData.postalCode}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            postalCode: e.target.value,
                                        }))
                                    }
                                    placeholder="Enter postal code"
                                />
                                <ShowErrorText error={formValidation} field="postalCode" />
                            </div>

                            <div className="flex flex-col gap-2">
                                <Label htmlFor="country">Country</Label>
                                <Input
                                    id="country"
                                    value={formData.country}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            country: e.target.value,
                                        }))
                                    }
                                    placeholder="Enter country"
                                />
                                <ShowErrorText error={formValidation} field="country" />
                            </div>

                            <Separator />

                            <div className="flex flex-col gap-2">
                                <Label htmlFor="phoneNumber">Phone Number</Label>
                                <InputGroup>
                                    <InputGroupAddon>
                                        <InputGroupText>+60</InputGroupText>
                                    </InputGroupAddon>
                                    <InputGroupInput
                                        id="phoneNumber"
                                        type="tel"
                                        value={formData.phoneNumber}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                phoneNumber: e.target.value,
                                            }))
                                        }
                                        placeholder="Enter phone number"
                                    />
                                </InputGroup>
                                <ShowErrorText error={formValidation} field="phoneNumber" />
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
