'use client';

import { Avatar, AvatarFallback } from '@repo/shadcn-ui/components/avatar';
import { getInitials } from '@repo/commons/utils/initials';
import { Project } from '@repo/commons/types/forge-service-schema.type';

export default function ProjectCellViewer({ item }: { item: Project }) {
    const initials = getInitials(item.name);
    const clientName = item.companies[0]?.name ?? '';

    return (
        <div className="flex items-center gap-3">
            <Avatar className="size-10 rounded-lg">
                <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
                <span className="font-medium">{item.name}</span>
                <span className="text-muted-foreground text-xs">{clientName}</span>
            </div>
        </div>
    );
}
