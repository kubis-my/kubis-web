'use client';

import { useEffect, useMemo, useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@repo/shadcn-ui/components/dialog';
import { Button } from '@repo/shadcn-ui/components/button';
import { Separator } from '@repo/shadcn-ui/components/separator';
import { cn } from '@repo/shadcn-ui/lib/utils';
import { useAuth } from '@/shadcn/providers/auth-provider';
import { IconCheck, IconChevronDown } from '@tabler/icons-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@repo/shadcn-ui/components/select';
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ROUTE } from '@/root/libs/constants';
import { Branch } from '@repo/commons/types/account-service-schema.type';
import { getInitials } from '@repo/commons/utils/initials';
import { useCompany } from '@/component/container/company-provider';

export const OPEN_SWITCH_COMPANY_EVENT = 'open-switch-company-dialog';

export function openSwitchCompanyDialog() {
    window.dispatchEvent(new CustomEvent(OPEN_SWITCH_COMPANY_EVENT));
}

const AVATAR_COLORS = [
    { bg: 'bg-violet-500', text: 'text-white' },
    { bg: 'bg-blue-500', text: 'text-white' },
    { bg: 'bg-emerald-500', text: 'text-white' },
    { bg: 'bg-orange-500', text: 'text-white' },
    { bg: 'bg-rose-500', text: 'text-white' },
    { bg: 'bg-cyan-500', text: 'text-white' },
    { bg: 'bg-amber-500', text: 'text-white' },
    { bg: 'bg-pink-500', text: 'text-white' },
];

function getAvatarColor(name: string) {
    const hash = name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    return AVATAR_COLORS[hash % AVATAR_COLORS.length] ?? AVATAR_COLORS[0];
}

export default function SwitchCompanyDialog() {
    const { authUser } = useAuth();
    const { activeBranch } = useCompany();
    const params = useParams();
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();

    const [open, setOpen] = useState(false);
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
    const [selectedCompanyIndex, setSelectedCompanyIndex] = useState<number>(0);
    const [selectedBranch, setSelectedBranch] = useState<Branch | undefined>(undefined);

    const companies = useMemo(() => authUser?.companies ?? [], [authUser?.companies]);
    const currentIndex = Number(params?.companyIndex ?? 0);

    const branchesByCompany = useMemo(() => {
        const map = new Map<string, Branch[]>();
        for (const ua of authUser?.userAccounts ?? []) {
            const companyPublicId = ua.companyEmployee.company.publicId;
            const list = map.get(companyPublicId) ?? [];
            list.push(ua.branch);
            map.set(companyPublicId, list);
        }
        return map;
    }, [authUser?.userAccounts]);

    useEffect(() => {
        const handler = () => setOpen(true);
        window.addEventListener(OPEN_SWITCH_COMPANY_EVENT, handler);
        return () => window.removeEventListener(OPEN_SWITCH_COMPANY_EVENT, handler);
    }, []);

    useEffect(() => {
        if (open) {
            setSelectedCompanyIndex(currentIndex);
            setExpandedIndex(currentIndex);
            setSelectedBranch(activeBranch);
        }
    }, [open, currentIndex, activeBranch]);

    function handleCompanyClick(index: number) {
        if (selectedCompanyIndex !== index) {
            setSelectedBranch(undefined);
        }
        setSelectedCompanyIndex(index);
        setExpandedIndex((prev) => (prev === index ? null : index));
    }

    function handleBranchChange(publicId: string) {
        if (publicId === '__none__') {
            setSelectedBranch(undefined);
            return;
        }
        const branch = [...branchesByCompany.values()].flat().find((b) => b.publicId === publicId);
        setSelectedBranch(branch);
    }

    function handleClose() {
        setOpen(false);
    }

    function handleContinue() {
        const isSameCompany = selectedCompanyIndex === currentIndex;

        if (isSameCompany) {
            const newParams = new URLSearchParams(searchParams.toString());
            if (selectedBranch) {
                newParams.set('branch', selectedBranch.publicId);
            } else {
                newParams.delete('branch');
            }
            const query = newParams.toString();
            router.push(query ? `${pathname}?${query}` : pathname);
            setOpen(false);
            return;
        }

        const base = ROUTE.OPS.HOME(selectedCompanyIndex);
        window.location.href = selectedBranch ? `${base}?branch=${selectedBranch.publicId}` : base;
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent
                showCloseButton={false}
                onEscapeKeyDown={(e) => e.preventDefault()}
                onInteractOutside={(e) => e.preventDefault()}
                className="gap-0 overflow-hidden p-0 sm:max-w-md"
            >
                <DialogHeader className="px-6 pt-6 pb-4 text-left">
                    <DialogTitle className="text-base font-semibold">Switch Company</DialogTitle>
                    <p className="text-muted-foreground text-sm">
                        Select a company and optionally a branch to work in.
                    </p>
                </DialogHeader>

                <div className="max-h-[420px] space-y-2 overflow-y-auto px-6 pb-6">
                    {companies.length === 0 && (
                        <div className="text-muted-foreground rounded-xl border border-dashed px-4 py-8 text-center text-sm">
                            No companies available for this account.
                        </div>
                    )}

                    {companies.map((company, index) => {
                        const isSelected = selectedCompanyIndex === index;
                        const isCurrent = currentIndex === index;
                        const isExpanded = expandedIndex === index;
                        const branches = branchesByCompany.get(company.publicId) ?? [];
                        const color = getAvatarColor(company.name)!;

                        return (
                            <div
                                key={company.publicId}
                                className={cn(
                                    'overflow-hidden rounded-xl border transition-all duration-200',
                                    isSelected
                                        ? 'border-foreground/20 shadow-sm'
                                        : 'border-border hover:border-foreground/15',
                                )}
                            >
                                <button
                                    type="button"
                                    onClick={() => handleCompanyClick(index)}
                                    className={cn(
                                        'flex w-full items-center gap-3 px-4 py-3 text-left transition-colors',
                                        isSelected ? 'bg-muted/50' : 'hover:bg-muted/30',
                                    )}
                                >
                                    <div
                                        className={cn(
                                            'flex size-9 shrink-0 items-center justify-center rounded-lg text-xs font-bold',
                                            color.bg,
                                            color.text,
                                        )}
                                    >
                                        {getInitials(company.name)}
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2">
                                            <p className="truncate text-sm font-medium">
                                                {company.name}
                                            </p>
                                            {isCurrent && (
                                                <span className="bg-muted text-muted-foreground shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium">
                                                    Current
                                                </span>
                                            )}
                                        </div>
                                        {isSelected && selectedBranch && isCurrent && (
                                            <p className="text-muted-foreground truncate text-xs">
                                                {selectedBranch.name}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex shrink-0 items-center gap-1.5">
                                        {isSelected && (
                                            <div className="bg-foreground text-background flex size-5 items-center justify-center rounded-full">
                                                <IconCheck className="size-3" strokeWidth={2.5} />
                                            </div>
                                        )}
                                        <IconChevronDown
                                            className={cn(
                                                'text-muted-foreground size-4 transition-transform duration-200',
                                                isExpanded && 'rotate-180',
                                            )}
                                        />
                                    </div>
                                </button>

                                {isExpanded && branches.length > 0 && (
                                    <div className="border-t px-4 py-3">
                                        <Select
                                            value={
                                                isSelected
                                                    ? (selectedBranch?.publicId ?? '__none__')
                                                    : '__none__'
                                            }
                                            onValueChange={handleBranchChange}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="__none__">All Branch</SelectItem>
                                                {branches.map((branch) => (
                                                    <SelectItem
                                                        key={branch.publicId}
                                                        value={branch.publicId}
                                                    >
                                                        {branch.name}
                                                        <span className="text-muted-foreground ml-1.5 text-xs">
                                                            {branch.code}
                                                        </span>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                <Separator />
                <DialogFooter className="px-6 py-4 sm:justify-end">
                    <div className="flex w-full flex-col-reverse gap-2 sm:w-auto sm:flex-row">
                        <Button variant="outline" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button onClick={handleContinue} disabled={companies.length === 0}>
                            Continue
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
