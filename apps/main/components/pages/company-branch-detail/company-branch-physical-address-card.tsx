"use client";

import { useState } from 'react';
import { Skeleton } from '@/shadcn/components/skeleton';
import { useCompanyBranchDetail } from './company-branch-detail-container';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/shadcn/components/card';
import { IconMapPin, IconMailbox, IconWorld, IconBuilding } from '@tabler/icons-react';
import { Drawer, DrawerContent, DrawerTrigger, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose } from '@/shadcn/components/drawer';
import { useIsMobile } from '@/shadcn/hooks/use-mobile';
import { Label } from '@/shadcn/components/label';
import { Input } from '@/shadcn/components/input';
import { Separator } from '@/shadcn/components/separator';
import { Button } from '@/shadcn/components/button';

export default function CompanyBranchPhysicalAddressCard() {
    const ctx = useCompanyBranchDetail();
    const isMobile = useIsMobile();
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: ''
    });

    if (ctx.isLoading.branchDetail) return <Skeleton className="aspect-video rounded-xl" />

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        // TODO: Add API call to update physical address
        setOpen(false);
    };

    const resetForm = () => {
        setFormData({
            street: ctx.branch?.physicalAddress?.street || '',
            city: ctx.branch?.physicalAddress?.city || '',
            state: ctx.branch?.physicalAddress?.state || '',
            postalCode: ctx.branch?.physicalAddress?.postalCode || '',
            country: ctx.branch?.physicalAddress?.country || ''
        });
    };

    return (
        <Drawer open={open} onOpenChange={(isOpen) => { setOpen(isOpen); if (isOpen) resetForm(); }} direction={isMobile ? "bottom" : "right"}>
            <DrawerTrigger asChild>
                <Card className="@container/card cursor-pointer">
                    <CardHeader>
                        <CardTitle className="font-semibold">
                            Physical Address
                        </CardTitle>
                        <CardDescription className='text-xs'>Click to update address</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-col items-start gap-1.5 text-sm">
                        <div className='flex justify-between items-center border-b px-1 py-2'>
                            <div className='flex items-center gap-2 font-medium text-sm'>
                                <IconBuilding className="size-3.5 text-primary shrink-0" /> Street
                            </div>
                            <div className='text-muted-foreground text-xs'>
                                {ctx.branch?.physicalAddress?.street}
                            </div>
                        </div>
                        <div className='flex justify-between items-center border-b px-1 py-2'>
                            <div className='flex items-center gap-2 font-medium'>
                                <IconMapPin className="size-3.5 shrink-0" /> City
                            </div>
                            <div className='text-muted-foreground text-xs'>
                                {ctx.branch?.physicalAddress?.city}
                            </div>
                        </div>
                        <div className='flex justify-between items-center border-b px-1 py-2'>
                            <div className='flex items-center gap-2 font-medium'>
                                <IconMapPin className="size-3.5 shrink-0" /> State
                            </div>
                            <div className='text-muted-foreground text-xs'>
                                {ctx.branch?.physicalAddress?.state}
                            </div>
                        </div>
                        <div className='flex justify-between items-center border-b px-1 py-2'>
                            <div className='flex items-center gap-2 font-medium'>
                                <IconMailbox className="size-3.5 shrink-0" /> Postal Code
                            </div>
                            <div className='text-muted-foreground text-xs'>
                                {ctx.branch?.physicalAddress?.postalCode}
                            </div>
                        </div>
                        <div className='flex justify-between items-center px-1 py-2'>
                            <div className='flex items-center gap-2 font-medium'>
                                <IconWorld className="size-3.5 shrink-0" /> Country
                            </div>
                            <div className='text-muted-foreground text-xs'>
                                {ctx.branch?.physicalAddress?.country}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </DrawerTrigger>
            <DrawerContent className={isMobile ? "max-h-[85vh]" : "max-w-md"}>
                <form onSubmit={handleSubmit} className="flex flex-col h-full">
                    <DrawerHeader className="gap-1">
                        <DrawerTitle>Update Physical Address</DrawerTitle>
                        <DrawerDescription>
                            Make changes to your branch&apos;s physical address below. Update the street, city, state, postal code, and country as needed.
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
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="city">City</Label>
                                    <Input
                                        id="city"
                                        value={formData.city}
                                        onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                                        placeholder="Enter city"
                                        required
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="state">State</Label>
                                    <Input
                                        id="state"
                                        value={formData.state}
                                        onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                                        placeholder="Enter state"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="postalCode">Postal Code</Label>
                                    <Input
                                        id="postalCode"
                                        value={formData.postalCode}
                                        onChange={(e) => setFormData(prev => ({ ...prev, postalCode: e.target.value }))}
                                        placeholder="Enter postal code"
                                        required
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="country">Country</Label>
                                    <Input
                                        id="country"
                                        value={formData.country}
                                        onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                                        placeholder="Enter country"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <DrawerFooter className="mt-auto">
                        <Button type="submit">Save Changes</Button>
                        <DrawerClose asChild>
                            <Button type="button" variant="outline">Cancel</Button>
                        </DrawerClose>
                    </DrawerFooter>
                </form>
            </DrawerContent>
        </Drawer>
    )
}
