import { Badge } from '@repo/shadcn-ui/components/badge';
import { cn } from '@repo/shadcn-ui/lib/utils';
import { ProjectStatus } from '@repo/commons/types/forge-service-schema.type';
import { STATUS_LABEL } from '@/root/libs/constants';

export const STATUS_BADGE_STYLES: Record<ProjectStatus, string> = {
    [ProjectStatus.PENDING_REVIEW]:
        'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800',
    [ProjectStatus.DISCOVERY]:
        'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800',
    [ProjectStatus.MVP_BUILD]:
        'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800',
    [ProjectStatus.VALIDATION]:
        'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800',
    [ProjectStatus.PRODUCTION]:
        'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800',
    [ProjectStatus.ON_HOLD]:
        'bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700',
    [ProjectStatus.CANCELLED]:
        'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800',
};

export function StatusBadge({ status }: { status: ProjectStatus }) {
    return (
        <Badge variant="outline" className={cn(STATUS_BADGE_STYLES[status])}>
            {STATUS_LABEL[status]}
        </Badge>
    );
}
