"use client";

import { useState } from 'react';
import { Skeleton } from '@/shadcn/components/skeleton';
import { useCompanyDetail } from './company-detail-container';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/shadcn/components/card';
import { IconMapPin, IconPhone, IconMailbox, IconWorld, IconBuilding } from '@tabler/icons-react';
import { Drawer, DrawerContent, DrawerTrigger, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose } from '@/shadcn/components/drawer';
import { useIsMobile } from '@/shadcn/hooks/use-mobile';
import { Label } from '@/shadcn/components/label';
import { Input } from '@/shadcn/components/input';
import { Separator } from '@/shadcn/components/separator';
import { Button } from '@/shadcn/components/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shadcn/components/select';
import { gql, TypedDocumentNode } from '@apollo/client';
import { Company, UpsertCompanyBillingAddressInput } from '@repo/commons/types/account-service-schema.type';
import { useApolloClient, useMutation } from '@apollo/client/react';
import { hasGraphQLError } from '@repo/commons/utils/graphql';
import { convertErrorMessageListToObject } from '@repo/commons/utils/error-message';
import ShowErrorText from '@/shadcn/custom-components/show-error-text';
import { toast } from "sonner";
import { PHONE_CODES } from '@/root/libs/constants';

const UPSERT_COMPANY_BILLING_ADDRESS: TypedDocumentNode<
    { upsertCompanyBillingAddress: Company },
    { companyPublicId: string; input: UpsertCompanyBillingAddressInput }
> = gql`
    mutation UpsertCompanyBillingAddress($companyPublicId: String!, $input: UpsertCompanyBillingAddressInput!) {
        upsertCompanyBillingAddress(companyPublicId: $companyPublicId, input: $input) {
            publicId
            companyBillingAddress {
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

const initialFormData: UpsertCompanyBillingAddressInput = {
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    phoneCode: '',
    phoneNumber: ''
};

export default function CompanyBillingAddressCard() {
    const ctx = useCompanyDetail();
    const isMobile = useIsMobile();
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState(initialFormData);
    const [formValidation, setFormValidation] = useState<Record<string, string[]>>({});

    const client = useApolloClient();
    const [upsertBillingAddress, { loading }] = useMutation(UPSERT_COMPANY_BILLING_ADDRESS);

    if (ctx.isFetchingCompany) return <Skeleton className="aspect-video rounded-xl" />

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormValidation({});

        if (!ctx.company?.publicId) return;

        const { data, error } = await upsertBillingAddress({
            variables: {
                companyPublicId: ctx.company.publicId,
                input: formData
            },
            errorPolicy: "all",
        });

        if (hasGraphQLError(error)) {
            const gqlError = error.errors?.[0] || error.graphQLErrors?.[0];

            if (gqlError) {
                const err = gqlError.extensions?.originalError as Record<string, any> | undefined;

                if (err?.statusCode === 400 && Array.isArray(err?.message)) {
                    setFormValidation(
                        convertErrorMessageListToObject(Object.keys(formData), err.message)
                    );
                    return;
                }
            }
        }

        if (data) {
            client.refetchQueries({ include: ["GetCompanyDetail"] });

            setOpen(false);
            toast.success("Billing address updated successfully!", {
                position: "top-center",
            });
        }
    };

    const resetForm = () => {
        setFormValidation({});
        setFormData({
            street: ctx.company?.companyBillingAddress?.street || '',
            city: ctx.company?.companyBillingAddress?.city || '',
            state: ctx.company?.companyBillingAddress?.state || '',
            postalCode: ctx.company?.companyBillingAddress?.postalCode || '',
            country: ctx.company?.companyBillingAddress?.country || '',
            phoneCode: ctx.company?.companyBillingAddress?.phoneCode || '',
            phoneNumber: ctx.company?.companyBillingAddress?.phoneNumber || ''
        });
    };

    return (
        <Drawer open={open} onOpenChange={(isOpen) => { setOpen(isOpen); if (isOpen) resetForm(); }} direction={isMobile ? "bottom" : "right"}>
            <DrawerTrigger asChild>
                <Card className="@container/card cursor-pointer">
                    <CardHeader>
                        <CardTitle className="font-semibold">
                            Billing Address
                        </CardTitle>
                        <CardDescription className='text-xs'>Click to update address</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-col items-start gap-1.5 text-sm">
                        <div className='flex justify-between items-center border-b px-1 py-2'>
                            <div className='flex items-center gap-2 font-medium text-sm'>
                                <IconBuilding className="size-3.5 text-primary shrink-0" /> Street
                            </div>
                            <div className='text-muted-foreground text-xs'>
                                {ctx.company?.companyBillingAddress?.street ?? "-"}
                            </div>
                        </div>
                        <div className='flex justify-between items-center border-b px-1 py-2'>
                            <div className='flex items-center gap-2 font-medium'>
                                <IconMapPin className="size-3.5 shrink-0" /> City
                            </div>
                            <div className='text-muted-foreground text-xs'>
                                {ctx.company?.companyBillingAddress?.city ?? "-"}
                            </div>
                        </div>
                        <div className='flex justify-between items-center border-b px-1 py-2'>
                            <div className='flex items-center gap-2 font-medium'>
                                <IconMapPin className="size-3.5 shrink-0" /> State
                            </div>
                            <div className='text-muted-foreground text-xs'>
                                {ctx.company?.companyBillingAddress?.state ?? "-"}
                            </div>
                        </div>
                        <div className='flex justify-between items-center border-b px-1 py-2'>
                            <div className='flex items-center gap-2 font-medium'>
                                <IconMailbox className="size-3.5 shrink-0" /> Postal Code
                            </div>
                            <div className='text-muted-foreground text-xs'>
                                {ctx.company?.companyBillingAddress?.postalCode ?? "-"}
                            </div>
                        </div>
                        <div className='flex justify-between items-center border-b px-1 py-2'>
                            <div className='flex items-center gap-2 font-medium'>
                                <IconWorld className="size-3.5 shrink-0" /> Country
                            </div>
                            <div className='text-muted-foreground text-xs'>
                                {ctx.company?.companyBillingAddress?.country ?? "-"}
                            </div>
                        </div>
                        <div className='flex justify-between items-center px-1 py-2'>
                            <div className='flex items-center gap-2 font-medium'>
                                <IconPhone className="size-3.5 shrink-0" />
                                <span className="text-sm font-medium">Phone</span>
                            </div>
                            <div className='text-muted-foreground text-xs'>
                                {
                                    (ctx.company?.companyBillingAddress?.phoneCode && ctx.company?.companyBillingAddress?.phoneNumber)
                                        ? `${ctx.company?.companyBillingAddress?.phoneCode}${ctx.company?.companyBillingAddress?.phoneNumber}`
                                        : "-"
                                }
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </DrawerTrigger>
            <DrawerContent className={isMobile ? "max-h-[85vh]" : "max-w-md"}>
                <form onSubmit={handleSubmit} className="flex flex-col h-full">
                    <DrawerHeader className="gap-1">
                        <DrawerTitle>Update Billing Address</DrawerTitle>
                        <DrawerDescription>
                            Make changes to your company&apos;s billing address below. Update the street, city, state, postal code, country, and phone number as needed.
                        </DrawerDescription>
                        <Separator />
                    </DrawerHeader>

                    <div className="flex-1 overflow-y-auto px-4 py-4">
                        <div className='flex flex-col gap-6'>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="street">Street Address</Label>
                                <Input
                                    id="street"
                                    value={formData.street}
                                    onChange={(e) => setFormData(prev => ({ ...prev, street: e.target.value }))}
                                    placeholder="Enter street address"
                                />
                                <ShowErrorText error={formValidation} field="street" />
                            </div>

                            <div className="flex flex-col gap-2">
                                <Label htmlFor="city">City</Label>
                                <Input
                                    id="city"
                                    value={formData.city}
                                    onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                                    placeholder="Enter city"
                                />
                                <ShowErrorText error={formValidation} field="city" />
                            </div>

                            <div className="flex flex-col gap-2">
                                <Label htmlFor="state">State</Label>
                                <Input
                                    id="state"
                                    value={formData.state}
                                    onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                                    placeholder="Enter state"
                                />
                                <ShowErrorText error={formValidation} field="state" />
                            </div>

                            <div className="flex flex-col gap-2">
                                <Label htmlFor="postalCode">Postal Code</Label>
                                <Input
                                    id="postalCode"
                                    value={formData.postalCode}
                                    onChange={(e) => setFormData(prev => ({ ...prev, postalCode: e.target.value }))}
                                    placeholder="Enter postal code"
                                />
                                <ShowErrorText error={formValidation} field="postalCode" />
                            </div>

                            <div className="flex flex-col gap-2">
                                <Label htmlFor="country">Country</Label>
                                <Input
                                    id="country"
                                    value={formData.country}
                                    onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                                    placeholder="Enter country"
                                />
                                <ShowErrorText error={formValidation} field="country" />
                            </div>

                            <Separator />

                            <div className="flex flex-col gap-2">
                                <Label htmlFor="phoneCode">Phone Code</Label>
                                <Select
                                    value={formData.phoneCode}
                                    onValueChange={(value) => setFormData(prev => ({ ...prev, phoneCode: value }))}
                                >
                                    <SelectTrigger id="phoneCode" className="w-full">
                                        <SelectValue placeholder="Select phone code" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {PHONE_CODES.map((code) => (
                                            <SelectItem key={code.value} value={code.value}>
                                                {code.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <ShowErrorText error={formValidation} field="phoneCode" />
                            </div>

                            <div className="flex flex-col gap-2">
                                <Label htmlFor="phoneNumber">Phone Number</Label>
                                <Input
                                    id="phoneNumber"
                                    type="tel"
                                    value={formData.phoneNumber}
                                    onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                                    placeholder="Enter phone number"
                                />
                                <ShowErrorText error={formValidation} field="phoneNumber" />
                            </div>
                        </div>
                    </div>

                    <DrawerFooter className="mt-auto">
                        <Button type="submit" disabled={loading}>
                            {loading ? "Saving..." : "Save Changes"}
                        </Button>
                        <DrawerClose asChild>
                            <Button type="button" variant="outline">Cancel</Button>
                        </DrawerClose>
                    </DrawerFooter>
                </form>
            </DrawerContent>
        </Drawer>
    )
}
