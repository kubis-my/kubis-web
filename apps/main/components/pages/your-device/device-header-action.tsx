"use client";

import { useState } from "react";
import { Button } from "@repo/shadcn-ui/components/button";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@repo/shadcn-ui/components/alert-dialog";
import { IconLogout } from "@tabler/icons-react";

interface DeviceHeaderActionProps {
    otherDevicesCount: number;
    onSignOutAll: () => void;
}

export default function DeviceHeaderAction({ otherDevicesCount, onSignOutAll }: DeviceHeaderActionProps) {
    const [signOutAllOpen, setSignOutAllOpen] = useState(false);

    if (otherDevicesCount <= 0) return null;

    return (
        <div className="flex items-center gap-2">
            <AlertDialog open={signOutAllOpen} onOpenChange={setSignOutAllOpen}>
                <AlertDialogTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="size-7"
                    >
                        <IconLogout />
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Revoke all other devices</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to revoke access from {otherDevicesCount}{" "}
                            other {otherDevicesCount === 1 ? "device" : "devices"}? This
                            will end all sessions except your current one.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <Button
                            variant="destructive"
                            onClick={() => {
                                onSignOutAll();
                                setSignOutAllOpen(false);
                            }}
                        >
                            Revoke all
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
