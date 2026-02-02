"use client";

import { useState } from 'react';
import { Skeleton } from '@/shadcn/components/skeleton';
import { useCompanyDetail } from './company-detail-container';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/shadcn/components/card';
import { IconCalendar, IconCalendarClock, IconBuildingStore, IconFileDigit, IconCircleCheck } from '@tabler/icons-react';
import { Drawer, DrawerContent, DrawerTrigger, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose } from '@/shadcn/components/drawer';
import { useIsMobile } from '@/shadcn/hooks/use-mobile';
import { Label } from '@/shadcn/components/label';
import { Input } from '@/shadcn/components/input';
import { Separator } from '@/shadcn/components/separator';
import { Button } from '@/shadcn/components/button';
import { Switch } from '@/shadcn/components/switch';
import { formatDateTime } from '@repo/commons/utils/date';

export default function CompanyDetailCard() {
    const ctx = useCompanyDetail();
    const isMobile = useIsMobile();
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        companyName: '',
        registrationNumber: '',
        status: false
    });

    if (ctx.isFetchingCompany) return <Skeleton className="aspect-video rounded-xl" />

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        // TODO: Add API call to update company details
        setOpen(false);
    };

    const resetForm = () => {
        setFormData({
            companyName: ctx.company?.name || '',
            registrationNumber: ctx.company?.registrationNo || '',
            status: ctx.company?.isActive ?? false
        });
    };

    return (
        <Drawer open={open} onOpenChange={(isOpen) => { setOpen(isOpen); if (isOpen) resetForm(); }} direction={isMobile ? "bottom" : "right"}>
            <DrawerTrigger asChild>
                <Card className="@container/card cursor-pointer">
                    <CardHeader>
                        <CardTitle className="font-semibold">
                            Company Information
                        </CardTitle>
                        <CardDescription className='text-xs'>Click to update details</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-col items-start gap-1.5 text-sm">
                        <div className='flex justify-between items-center border-b px-1 py-2'>
                            <div className='flex items-center gap-2 font-medium text-sm'>
                                <IconBuildingStore className="size-3.5 text-primary shrink-0" /> Name
                            </div>
                            <div className='text-muted-foreground text-xs'>
                                {ctx.company?.name ?? "-"}
                            </div>
                        </div>
                        <div className='flex justify-between items-center border-b px-1 py-2'>
                            <div className='flex items-center gap-2 font-medium'>
                                <IconFileDigit className="size-3.5 shrink-0" /> Register Number
                            </div>
                            <div className='text-muted-foreground text-xs'>
                                #{ctx.company?.registrationNo.slice(0, 8)}
                            </div>
                        </div>
                        <div className='flex justify-between items-center border-b px-1 py-2'>
                            <div className='flex items-center gap-2 font-medium'>
                                <IconCalendar className="size-3.5 shrink-0" /> Register Date
                            </div>
                            <div className='text-muted-foreground text-xs'>
                                {formatDateTime(ctx.company?.createdAt)}
                            </div>
                        </div>
                        <div className='flex justify-between items-center border-b px-1 py-2'>
                            <div className='flex items-center gap-2 font-medium'>
                                <IconCalendarClock className="size-3.5 shrink-0" /> Last Update
                            </div>
                            <div className='text-muted-foreground text-xs'>
                                {formatDateTime(ctx.company?.updatedAt)}
                            </div>
                        </div>
                        <div className='flex justify-between items-center px-1 py-2'>
                            <div className='flex items-center gap-2 font-medium'>
                                <IconCircleCheck className="size-3.5 shrink-0" />
                                <span className="text-sm font-medium">Status</span>
                            </div>
                            <div className='text-muted-foreground text-xs'>
                                {ctx.company?.isActive === undefined ? "-" : ctx.company?.isActive ? "Active" : "Inactive"}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </DrawerTrigger>
            <DrawerContent className={isMobile ? "max-h-[85vh]" : "max-w-md"}>
                <form onSubmit={handleSubmit} className="flex flex-col h-full">
                    <DrawerHeader className="gap-1">
                        <DrawerTitle>Update Company Information</DrawerTitle>
                        <DrawerDescription>
                            Make changes to your company details below. Update the company name, registration number, and active status as needed.
                        </DrawerDescription>
                        <Separator />
                    </DrawerHeader>

                    <div className="flex-1 overflow-y-auto px-4 py-4">
                        <div className='flex flex-col gap-6'>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="companyName">Company Name</Label>
                                <Input
                                    id="companyName"
                                    value={formData.companyName}
                                    onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                                    placeholder="Enter company name"
                                    required
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <Label htmlFor="registrationNumber">Registration Number</Label>
                                <Input
                                    id="registrationNumber"
                                    value={formData.registrationNumber}
                                    onChange={(e) => setFormData(prev => ({ ...prev, registrationNumber: e.target.value }))}
                                    placeholder="Enter registration number"
                                    required
                                />
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
                                    <Label htmlFor="status" className="cursor-pointer">Active Status</Label>
                                    <p className="text-xs text-muted-foreground">
                                        Enable or disable company operations
                                    </p>
                                </div>
                                <Switch
                                    id="status"
                                    checked={formData.status}
                                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, status: checked }))}
                                />
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
