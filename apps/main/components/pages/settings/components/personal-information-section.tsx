'use client';

import { useState } from 'react';
import { useFormDirty } from '@repo/commons/hooks/use-form-dirty';
import { Skeleton } from '@/shadcn/components/skeleton';
import { TabsContent } from '@/shadcn/components/tabs';
import {
    Card,
    CardHeader,
    CardContent,
    CardTitle,
    CardDescription,
} from '@/shadcn/components/card';
import { IconUser } from '@tabler/icons-react';
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
import ShowErrorText from '@/shadcn/custom-components/show-error-text';
import { useAuth } from '@/shadcn/providers/auth-provider';
import { useProfile } from '../profile-container';

interface FormData {
    firstName: string;
    lastName: string;
    nickname: string;
}

const initialFormData: FormData = {
    firstName: '',
    lastName: '',
    nickname: '',
};

export default function PersonalInformationSection() {
    const { authUser } = useAuth();
    const { isFetchingCredential } = useProfile();
    const isMobile = useIsMobile();
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState(initialFormData);
    const { isDirty, setOriginal } = useFormDirty(formData);
    const [formValidation, setFormValidation] = useState<Record<string, string[]>>({});

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormValidation({});
    };

    const resetForm = () => {
        setFormValidation({});
        const data = {
            firstName: authUser?.firstName || '',
            lastName: authUser?.lastName || '',
            nickname: authUser?.nickname || '',
        };
        setFormData(data);
        setOriginal(data);
    };

    if (isFetchingCredential)
        return (
            <TabsContent value="personal-information" className="flex-1">
                <Skeleton className="h-full rounded-xl" />
            </TabsContent>
        );

    return (
        <TabsContent value="personal-information">
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
                </DrawerTrigger>
                <DrawerContent className={isMobile ? 'max-h-[85vh]' : 'max-w-md'}>
                    <form onSubmit={handleSubmit} className="flex h-full flex-col">
                        <DrawerHeader className="gap-1">
                            <DrawerTitle>Update Personal Information</DrawerTitle>
                            <DrawerDescription>
                                Make changes to your personal details below. Update your name and
                                nickname as needed.
                            </DrawerDescription>
                            <Separator />
                        </DrawerHeader>

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

                        <DrawerFooter className="mt-auto">
                            <Button type="submit" disabled={!isDirty}>
                                Save Changes
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
        </TabsContent>
    );
}
