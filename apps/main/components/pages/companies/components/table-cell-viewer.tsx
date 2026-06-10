import { Avatar, AvatarFallback, AvatarImage } from '@/shadcn/components/avatar';
import { Company } from '@repo/commons/types/account-service-schema.type';
import { getInitials } from '@repo/commons/utils/initials';

export default function TableCellViewer({ item }: { item: Company }) {
    const initials = getInitials(item.name);

    return (
        <div className="flex items-center gap-3">
            <Avatar className="size-10 rounded-lg">
                <AvatarImage src={item.logo || ''} alt={item.name} />
                <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
                <span className="font-medium">{item.name}</span>
            </div>
            <div className="flex items-center justify-center">
                <div
                    className={`mr-1.5 size-2 rounded-full ${item.isActive ? 'bg-green-600 dark:bg-green-400' : 'bg-muted-foreground'}`}
                />
            </div>
        </div>
    );
}
