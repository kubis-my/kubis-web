"use client";

import { useState } from 'react';
import { Skeleton } from '@/shadcn/components/skeleton';
import { useCompanyBranchDetail } from './company-branch-detail-container';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/shadcn/components/card';
import { IconBuildingStore, IconCode, IconMail, IconPhone, IconCircleCheck } from '@tabler/icons-react';
import { Drawer, DrawerContent, DrawerTrigger, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose } from '@/shadcn/components/drawer';
import { useIsMobile } from '@/shadcn/hooks/use-mobile';
import { Label } from '@/shadcn/components/label';
import { Input } from '@/shadcn/components/input';
import { Separator } from '@/shadcn/components/separator';
import { Button } from '@/shadcn/components/button';
import { Switch } from '@/shadcn/components/switch';

export default function CompanyBranchDetailCard() {
    const ctx = useCompanyBranchDetail();
    const isMobile = useIsMobile();
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        branchName: '',
        branchCode: '',
        phone: '',
        email: '',
        status: false
    });

    if (ctx.loading) return <Skeleton className="aspect-video rounded-xl" />

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        // TODO: Add API call to update branch details
        setOpen(false);
    };

    const resetForm = () => {
        setFormData({
            branchName: ctx.branch?.name || '',
            branchCode: ctx.branch?.code || '',
            phone: ctx.branch?.phoneCode || '',
            email: ctx.branch?.email || '',
            status: ctx.branch?.isActive || false
        });
    };

    return (
        <Drawer open={open} onOpenChange={(isOpen) => { setOpen(isOpen); if (isOpen) resetForm(); }} direction={isMobile ? "bottom" : "right"}>
            <DrawerTrigger asChild>
                <Card className="@container/card cursor-pointer">
                    <CardHeader>
                        <CardTitle className="font-semibold">
                            Branch Information
                        </CardTitle>
                        <CardDescription className='text-xs'>Click to update details</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-col items-start gap-1.5 text-sm">
                        <div className='flex justify-between items-center border-b px-1 py-2'>
                            <div className='flex items-center gap-2 font-medium text-sm'>
                                <IconBuildingStore className="size-3.5 text-primary shrink-0" /> Branch Name
                            </div>
                            <div className='text-muted-foreground text-xs'>
                                {ctx.branch?.name ?? "-"}
                            </div>
                        </div>
                        <div className='flex justify-between items-center border-b px-1 py-2'>
                            <div className='flex items-center gap-2 font-medium'>
                                <IconCode className="size-3.5 shrink-0" /> Branch Code
                            </div>
                            <div className='text-muted-foreground text-xs'>
                                {ctx.branch?.code ?? "-"}
                            </div>
                        </div>
                        <div className='flex justify-between items-center border-b px-1 py-2'>
                            <div className='flex items-center gap-2 font-medium'>
                                <IconPhone className="size-3.5 shrink-0" /> Phone
                            </div>
                            <div className='text-muted-foreground text-xs'>
                                {(ctx.branch?.phoneCode && ctx.branch?.phoneNumber) ? `${ctx.branch?.phoneCode} ${ctx.branch?.phoneNumber}` : "-"}
                            </div>
                        </div>
                        <div className='flex justify-between items-center border-b px-1 py-2'>
                            <div className='flex items-center gap-2 font-medium'>
                                <IconMail className="size-3.5 shrink-0" /> Email
                            </div>
                            <div className='text-muted-foreground text-xs'>
                                {ctx.branch?.email ?? "-"}
                            </div>
                        </div>
                        <div className='flex justify-between items-center px-1 py-2'>
                            <div className='flex items-center gap-2 font-medium'>
                                <IconCircleCheck className="size-3.5 shrink-0" />
                                <span className="text-sm font-medium">Status</span>
                            </div>
                            <div className='text-muted-foreground text-xs'>
                                {ctx.branch?.isActive ? "Active" : "Inactive"}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </DrawerTrigger>
            <DrawerContent className={isMobile ? "max-h-[85vh]" : "max-w-md"}>
                <form onSubmit={handleSubmit} className="flex flex-col h-full">
                    <DrawerHeader className="gap-1">
                        <DrawerTitle>Update Branch Information</DrawerTitle>
                        <DrawerDescription>
                            Make changes to your branch details below. Update the branch name, code, contact information, and active status as needed.
                        </DrawerDescription>
                        <Separator />
                    </DrawerHeader>

                    <div className="flex-1 overflow-y-auto px-4 py-4">
                        <div className='flex flex-col gap-6'>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="branchName">Branch Name</Label>
                                <Input
                                    id="branchName"
                                    value={formData.branchName}
                                    onChange={(e) => setFormData(prev => ({ ...prev, branchName: e.target.value }))}
                                    placeholder="Enter branch name"
                                    required
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <Label htmlFor="branchCode">Branch Code</Label>
                                <Input
                                    id="branchCode"
                                    value={formData.branchCode}
                                    onChange={(e) => setFormData(prev => ({ ...prev, branchCode: e.target.value }))}
                                    placeholder="Enter branch code"
                                    required
                                />
                            </div>

                            <Separator />

                            <div className="flex flex-col gap-2">
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input
                                    id="phone"
                                    value={formData.phone}
                                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                                    placeholder="Enter phone number"
                                    required
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                    placeholder="Enter email address"
                                    required
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="status" className="cursor-pointer">Active Status</Label>
                                    <p className="text-xs text-muted-foreground">
                                        Enable or disable branch operations
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
