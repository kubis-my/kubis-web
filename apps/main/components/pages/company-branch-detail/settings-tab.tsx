"use client";

import * as React from "react";
import { TabsContent } from "@/shadcn/components/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/shadcn-ui/components/card";
import { Label } from "@repo/shadcn-ui/components/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/shadcn-ui/components/select";
import { Switch } from "@repo/shadcn-ui/components/switch";
import { Button } from "@repo/shadcn-ui/components/button";
import { Input } from "@repo/shadcn-ui/components/input";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@repo/shadcn-ui/components/alert-dialog";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@repo/shadcn-ui/components/input-otp";
import { Separator } from "@repo/shadcn-ui/components/separator";
import { IconClock, IconTrash, IconDeviceFloppy, IconAlertTriangle } from "@tabler/icons-react";
import { useCompanyBranchDetail } from "./company-branch-detail-container";

type DaySchedule = {
    isOpen: boolean;
    openTime: string;
    closeTime: string;
};

type WeekSchedule = {
    monday: DaySchedule;
    tuesday: DaySchedule;
    wednesday: DaySchedule;
    thursday: DaySchedule;
    friday: DaySchedule;
    saturday: DaySchedule;
    sunday: DaySchedule;
};

const DAYS_OF_WEEK = [
    { key: "monday", label: "Monday" },
    { key: "tuesday", label: "Tuesday" },
    { key: "wednesday", label: "Wednesday" },
    { key: "thursday", label: "Thursday" },
    { key: "friday", label: "Friday" },
    { key: "saturday", label: "Saturday" },
    { key: "sunday", label: "Sunday" },
] as const;

const TIMEZONES = [
    { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
    { value: "America/Denver", label: "Mountain Time (MT)" },
    { value: "America/Chicago", label: "Central Time (CT)" },
    { value: "America/New_York", label: "Eastern Time (ET)" },
    { value: "America/Phoenix", label: "Arizona Time (AZ)" },
    { value: "America/Anchorage", label: "Alaska Time (AKT)" },
    { value: "Pacific/Honolulu", label: "Hawaii Time (HT)" },
];

const CURRENCIES = [
    { value: "USD", label: "US Dollar (USD)", symbol: "$" },
    { value: "EUR", label: "Euro (EUR)", symbol: "€" },
    { value: "GBP", label: "British Pound (GBP)", symbol: "£" },
    { value: "JPY", label: "Japanese Yen (JPY)", symbol: "¥" },
    { value: "CAD", label: "Canadian Dollar (CAD)", symbol: "$" },
    { value: "AUD", label: "Australian Dollar (AUD)", symbol: "$" },
    { value: "CNY", label: "Chinese Yuan (CNY)", symbol: "¥" },
    { value: "INR", label: "Indian Rupee (INR)", symbol: "₹" },
];

export default function SettingsTab() {
    const ctx = useCompanyBranchDetail();
    const [weekSchedule, setWeekSchedule] = React.useState<WeekSchedule>({
        monday: { isOpen: true, openTime: "09:00", closeTime: "17:00" },
        tuesday: { isOpen: true, openTime: "09:00", closeTime: "17:00" },
        wednesday: { isOpen: true, openTime: "09:00", closeTime: "17:00" },
        thursday: { isOpen: true, openTime: "09:00", closeTime: "17:00" },
        friday: { isOpen: true, openTime: "09:00", closeTime: "17:00" },
        saturday: { isOpen: false, openTime: "09:00", closeTime: "17:00" },
        sunday: { isOpen: false, openTime: "09:00", closeTime: "17:00" },
    });
    const [timezone, setTimezone] = React.useState("America/Los_Angeles");
    const [currency, setCurrency] = React.useState("USD");
    const [invoicePrefix, setInvoicePrefix] = React.useState("INV");
    const [taxRate, setTaxRate] = React.useState("10");
    const [notifications, setNotifications] = React.useState({
        newUsers: true,
        upcomingEvents: true,
        branchUpdates: false,
    });

    // Delete branch state
    const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
    const [deleteStep, setDeleteStep] = React.useState<"code" | "otp">("code");
    const [branchCodeInput, setBranchCodeInput] = React.useState("");
    const [otpValue, setOtpValue] = React.useState("");
    const [isRequestingOtp, setIsRequestingOtp] = React.useState(false);
    const [isDeleting, setIsDeleting] = React.useState(false);

    const handleDayToggle = (day: keyof WeekSchedule, isOpen: boolean) => {
        setWeekSchedule((prev) => ({
            ...prev,
            [day]: { ...prev[day], isOpen },
        }));
    };

    const handleTimeChange = (
        day: keyof WeekSchedule,
        timeType: "openTime" | "closeTime",
        value: string
    ) => {
        setWeekSchedule((prev) => ({
            ...prev,
            [day]: { ...prev[day], [timeType]: value },
        }));
    };

    const handleSaveOperationHours = async () => {
        // TODO: Implement GraphQL mutation to save operation hours
        console.log("Saving operation hours:", weekSchedule);
        // await updateBranchOperationHours({ branchId: ctx.branch?.id, schedule: weekSchedule });
    };

    const handleSaveGeneralSettings = async () => {
        // TODO: Implement GraphQL mutation to save all general settings
        console.log("Saving general settings:", {
            timezone,
            currency,
            invoicePrefix,
            taxRate,
            notifications,
        });
    };

    const handleRequestOtp = async () => {
        setIsRequestingOtp(true);
        // TODO: Implement GraphQL mutation to request OTP
        // This should send OTP to company owner (CEO)
        console.log("Requesting OTP for company:", ctx.company?.id);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setIsRequestingOtp(false);
        setDeleteStep("otp");
    };

    const handleDeleteBranch = async () => {
        setIsDeleting(true);
        // TODO: Implement GraphQL mutation to delete branch
        console.log("Deleting branch with OTP:", otpValue);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2000));

        setIsDeleting(false);
        setDeleteDialogOpen(false);

        // Redirect to company page after deletion
        // router.push(`/my-account/company/${ctx.company?.id}`);
    };

    const resetDeleteDialog = () => {
        setDeleteStep("code");
        setBranchCodeInput("");
        setOtpValue("");
        setDeleteDialogOpen(false);
    };

    const isBranchCodeValid = branchCodeInput === ctx.branch?.branchCode;
    const isOtpValid = otpValue.length === 6;

    if (ctx.isLoading.branchDetail) {
        return (
            <TabsContent value="settings">
                <div className="bg-red-500/50 min-h-screen flex-1 rounded-xl md:min-h-min" />
            </TabsContent>
        );
    }

    return (
        <TabsContent value="settings" className="space-y-6">
            {/* Operation Hours */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <IconClock className="size-5" />
                        <CardTitle>Operation Hours</CardTitle>
                    </div>
                    <CardDescription>
                        Set the operating hours for each day of the week
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {DAYS_OF_WEEK.map(({ key, label }) => {
                        const schedule = weekSchedule[key];
                        return (
                            <div
                                key={key}
                                className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
                            >
                                <div className="flex items-center gap-3">
                                    <Switch
                                        checked={schedule.isOpen}
                                        onCheckedChange={(checked) => handleDayToggle(key, checked)}
                                    />
                                    <Label className="min-w-[100px] font-medium">{label}</Label>
                                </div>
                                {schedule.isOpen ? (
                                    <div className="flex items-center gap-2">
                                        <Input
                                            type="time"
                                            value={schedule.openTime}
                                            onChange={(e) =>
                                                handleTimeChange(key, "openTime", e.target.value)
                                            }
                                            className="w-[130px]"
                                        />
                                        <span className="text-muted-foreground">to</span>
                                        <Input
                                            type="time"
                                            value={schedule.closeTime}
                                            onChange={(e) =>
                                                handleTimeChange(key, "closeTime", e.target.value)
                                            }
                                            className="w-[130px]"
                                        />
                                    </div>
                                ) : (
                                    <span className="text-muted-foreground text-sm">Closed</span>
                                )}
                            </div>
                        );
                    })}
                    <div className="flex justify-end pt-2">
                        <Button onClick={handleSaveOperationHours}>
                            <IconDeviceFloppy className="size-4" />
                            Save Operation Hours
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* General Settings */}
            <Card>
                <CardHeader>
                    <CardTitle>General Settings</CardTitle>
                    <CardDescription>
                        Configure branch preferences, billing, and notifications
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Business Settings */}
                    <div className="grid gap-4 sm:grid-cols-3">
                        {/* Timezone */}
                        <div className="space-y-2">
                            <Label htmlFor="timezone">Timezone</Label>
                            <Select value={timezone} onValueChange={setTimezone}>
                                <SelectTrigger id="timezone" className="w-full">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {TIMEZONES.map((tz) => (
                                        <SelectItem key={tz.value} value={tz.value}>
                                            {tz.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Currency */}
                        <div className="space-y-2">
                            <Label htmlFor="currency">Currency</Label>
                            <Select value={currency} onValueChange={setCurrency}>
                                <SelectTrigger id="currency" className="w-full">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {CURRENCIES.map((curr) => (
                                        <SelectItem key={curr.value} value={curr.value}>
                                            {curr.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Tax Rate */}
                        <div className="space-y-2">
                            <Label htmlFor="tax-rate">Default Tax Rate (%)</Label>
                            <Input
                                id="tax-rate"
                                type="number"
                                value={taxRate}
                                onChange={(e) => setTaxRate(e.target.value)}
                                placeholder="10"
                                min="0"
                                max="100"
                                step="0.01"
                            />
                        </div>

                        {/* Invoice Prefix */}
                        <div className="space-y-2">
                            <Label htmlFor="invoice-prefix">Invoice Prefix</Label>
                            <Input
                                id="invoice-prefix"
                                value={invoicePrefix}
                                onChange={(e) => setInvoicePrefix(e.target.value.toUpperCase())}
                                placeholder="e.g., INV (will generate INV-001, INV-002...)"
                                className="font-mono"
                                maxLength={10}
                            />
                        </div>
                    </div>

                    <Separator />

                    {/* Notifications Section */}
                    <div className="space-y-4">
                        <Label className="text-base font-medium">Notifications</Label>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between gap-2">
                                <div className="space-y-0.5">
                                    <Label className="text-sm font-normal">New Users</Label>
                                    <p className="text-muted-foreground text-xs">
                                        Notify when users are added
                                    </p>
                                </div>
                                <Switch
                                    checked={notifications.newUsers}
                                    onCheckedChange={(checked) =>
                                        setNotifications((prev) => ({ ...prev, newUsers: checked }))
                                    }
                                />
                            </div>
                            <div className="flex items-center justify-between gap-2">
                                <div className="space-y-0.5">
                                    <Label className="text-sm font-normal">Upcoming Events</Label>
                                    <p className="text-muted-foreground text-xs">
                                        Event reminders
                                    </p>
                                </div>
                                <Switch
                                    checked={notifications.upcomingEvents}
                                    onCheckedChange={(checked) =>
                                        setNotifications((prev) => ({ ...prev, upcomingEvents: checked }))
                                    }
                                />
                            </div>
                            <div className="flex items-center justify-between gap-2">
                                <div className="space-y-0.5">
                                    <Label className="text-sm font-normal">Branch Updates</Label>
                                    <p className="text-muted-foreground text-xs">
                                        Branch info changes
                                    </p>
                                </div>
                                <Switch
                                    checked={notifications.branchUpdates}
                                    onCheckedChange={(checked) =>
                                        setNotifications((prev) => ({ ...prev, branchUpdates: checked }))
                                    }
                                />
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* Single Save Button */}
                    <div className="flex justify-end">
                        <Button onClick={handleSaveGeneralSettings} size="lg">
                            <IconDeviceFloppy className="size-4" />
                            Save All Settings
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Danger Zone - Delete Branch */}
            <Card className="border-destructive">
                <CardHeader>
                    <div className="flex items-center gap-2 text-destructive">
                        <IconAlertTriangle className="size-5" />
                        <CardTitle>Danger Zone</CardTitle>
                    </div>
                    <CardDescription>
                        Irreversible actions that require confirmation
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-start justify-between rounded-lg border border-destructive/50 bg-destructive/5 p-4">
                        <div className="space-y-1">
                            <p className="font-medium">Delete this branch</p>
                            <p className="text-muted-foreground text-sm">
                                Once you delete a branch, there is no going back. This will delete all
                                users and events associated with this branch.
                            </p>
                        </div>
                        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive" onClick={() => setDeleteDialogOpen(true)}>
                                    <IconTrash className="size-4" />
                                    Delete Branch
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>
                                        {deleteStep === "code"
                                            ? "Delete Branch Confirmation"
                                            : "Enter OTP Code"}
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        {deleteStep === "code" ? (
                                            <>
                                                This action cannot be undone. This will permanently delete
                                                the branch and remove all associated data.
                                            </>
                                        ) : (
                                            <>
                                                An OTP has been sent to the company owner (CEO). Please
                                                enter the 6-digit code to confirm deletion.
                                            </>
                                        )}
                                    </AlertDialogDescription>
                                </AlertDialogHeader>

                                {deleteStep === "code" ? (
                                    <div className="space-y-4">
                                        <div className="rounded-lg bg-destructive/10 p-3 text-sm">
                                            <p className="font-medium">This will delete:</p>
                                            <ul className="ml-4 mt-2 list-disc space-y-1 text-muted-foreground">
                                                <li>{ctx.users.length} users</li>
                                                <li>{ctx.events.length} events</li>
                                                <li>All branch settings and data</li>
                                            </ul>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="branch-code">
                                                Type{" "}
                                                <span className="font-mono font-bold">
                                                    {ctx.branch?.branchCode}
                                                </span>{" "}
                                                to confirm
                                            </Label>
                                            <Input
                                                id="branch-code"
                                                value={branchCodeInput}
                                                onChange={(e) => setBranchCodeInput(e.target.value)}
                                                placeholder="Enter branch code"
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4 py-4">
                                        <div className="flex justify-center">
                                            <InputOTP
                                                maxLength={6}
                                                value={otpValue}
                                                onChange={setOtpValue}
                                            >
                                                <InputOTPGroup>
                                                    <InputOTPSlot index={0} />
                                                    <InputOTPSlot index={1} />
                                                    <InputOTPSlot index={2} />
                                                    <InputOTPSlot index={3} />
                                                    <InputOTPSlot index={4} />
                                                    <InputOTPSlot index={5} />
                                                </InputOTPGroup>
                                            </InputOTP>
                                        </div>
                                    </div>
                                )}

                                <AlertDialogFooter>
                                    <AlertDialogCancel onClick={resetDeleteDialog}>
                                        Cancel
                                    </AlertDialogCancel>
                                    {deleteStep === "code" ? (
                                        <Button
                                            variant="destructive"
                                            disabled={!isBranchCodeValid || isRequestingOtp}
                                            onClick={handleRequestOtp}
                                        >
                                            {isRequestingOtp ? "Requesting OTP..." : "Request OTP"}
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="destructive"
                                            disabled={!isOtpValid || isDeleting}
                                            onClick={handleDeleteBranch}
                                        >
                                            {isDeleting ? "Deleting..." : "Confirm Delete"}
                                        </Button>
                                    )}
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
    );
}
