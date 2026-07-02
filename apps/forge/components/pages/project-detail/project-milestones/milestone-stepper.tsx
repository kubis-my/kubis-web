import { cn } from '@repo/shadcn-ui/lib/utils';
import { formatDateTime } from '@repo/commons/utils/date';
import type { ProjectDetail } from '../project-detail-container';
import { STATUS_CONFIG } from './milestone-status';

type Props = {
    milestones: ProjectDetail['milestones'];
};

export default function MilestoneStepper({ milestones }: Props) {
    return (
        <div className="flex items-start">
            {milestones.map((milestone, index) => {
                const config = STATUS_CONFIG[milestone.status];
                const isFirst = index === 0;
                const isLast = index === milestones.length - 1;
                const prevDone = index > 0 && milestones[index - 1]?.status === 'Done';
                const isDone = milestone.status === 'Done';

                return (
                    <div key={milestone.id} className="flex flex-1 flex-col items-center">
                        <div className="flex w-full items-center">
                            <div
                                className={cn(
                                    'h-px flex-1',
                                    isFirst
                                        ? 'invisible'
                                        : prevDone || isDone
                                          ? 'bg-green-400'
                                          : 'bg-border',
                                )}
                            />
                            <div
                                className={cn(
                                    'flex size-9 shrink-0 items-center justify-center rounded-full',
                                    config.iconClass,
                                )}
                            >
                                <config.Icon size={16} stroke={2.5} />
                            </div>
                            <div
                                className={cn(
                                    'h-px flex-1',
                                    isLast ? 'invisible' : isDone ? 'bg-green-400' : 'bg-border',
                                )}
                            />
                        </div>

                        <div className="mt-3 flex flex-col items-center gap-1.5 px-1 text-center">
                            <p className="text-sm leading-tight font-medium">{milestone.name}</p>
                            <span
                                className={cn(
                                    'rounded-md border px-1.5 py-0.5 text-xs font-medium',
                                    config.badgeClass,
                                )}
                            >
                                {config.label}
                            </span>
                            {milestone.estimatedDate ? (
                                <p className="text-muted-foreground text-xs">
                                    Est. {formatDateTime(milestone.estimatedDate, { format: 'dd MMM yyyy' })}
                                </p>
                            ) : null}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
