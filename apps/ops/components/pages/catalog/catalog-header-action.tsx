'use client';

import { Button } from '@repo/shadcn-ui/components/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@repo/shadcn-ui/components/dropdown-menu';
import {
    IconPlus,
    IconBox,
    IconColorSwatch,
    IconDownload,
    IconTools,
    IconStack2,
    IconHammer,
} from '@tabler/icons-react';
import type { ProductType } from './catalog-container';

const TYPE_OPTIONS: { type: ProductType; label: string; icon: React.ReactNode }[] = [
    { type: 'simple', label: 'Simple', icon: <IconBox className="size-4" /> },
    { type: 'variant', label: 'Variant', icon: <IconColorSwatch className="size-4" /> },
    { type: 'digital', label: 'Digital', icon: <IconDownload className="size-4" /> },
    { type: 'service', label: 'Service', icon: <IconTools className="size-4" /> },
    { type: 'bundle', label: 'Bundle', icon: <IconStack2 className="size-4" /> },
    { type: 'custom', label: 'Custom', icon: <IconHammer className="size-4" /> },
];

export default function CatalogHeaderAction({
    onSelect,
}: {
    onSelect: (type: ProductType) => void;
}) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="size-7">
                    <IconPlus />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {TYPE_OPTIONS.map((option) => (
                    <DropdownMenuItem key={option.type} onClick={() => onSelect(option.type)}>
                        {option.icon}
                        {option.label}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
