'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Check, Loader2, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { gql, TypedDocumentNode } from '@apollo/client';
import { useQuery, useMutation } from '@apollo/client/react';
import { Badge } from '@/shadcn/components/badge';
import { Button } from '@/shadcn/components/button';
import { Skeleton } from '@/shadcn/components/skeleton';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/shadcn/components/dialog';
import { Input } from '@/shadcn/components/input';
import { Label } from '@/shadcn/components/label';
import { ROUTE } from '@/root/libs/constants';
import { GET_PACKAGE_PLAN } from '@/root/components/pages/forge/pricing/graphql';
import { bySortOrder } from '@repo/commons/utils/pagination-helpers';
import { useProjectDetail } from '../project-detail-container';
import type {
    UpgradeSubscriptionPlanInput,
    ProjectSubscription,
} from '@repo/commons/types/forge-service-schema.type';

interface UpgradeSubscriptionPlanResponse {
    upgradeSubscriptionPlanForForge: Pick<ProjectSubscription, 'publicId' | 'status' | 'plan'>;
}

interface UpgradeSubscriptionPlanVariables {
    input: UpgradeSubscriptionPlanInput;
}

const UPGRADE_SUBSCRIPTION_PLAN: TypedDocumentNode<
    UpgradeSubscriptionPlanResponse,
    UpgradeSubscriptionPlanVariables
> = gql`
    mutation UpgradeSubscriptionPlanForForge($input: UpgradeSubscriptionPlanInput!) {
        upgradeSubscriptionPlanForForge(input: $input) {
            publicId
            status
            plan {
                publicId
                name
            }
        }
    }
`;

export default function SubscriptionPlanSection() {
    const { projectId } = useParams<{ projectId: string }>();
    const { project } = useProjectDetail();
    const { data, loading } = useQuery(GET_PACKAGE_PLAN);
    const [upgradePlan] = useMutation(UPGRADE_SUBSCRIPTION_PLAN);
    const [upgradingPlanId, setUpgradingPlanId] = useState<string | null>(null);
    const [confirmDialog, setConfirmDialog] = useState<{ publicId: string; name: string } | null>(null);
    const [confirmInput, setConfirmInput] = useState('');

    const plans = [...(data?.getPackagePlan?.plans ?? [])].sort(bySortOrder);
    const activePlanId = project.subscription?.plan?.publicId;
    const activePlanSortOrder = plans.find((p) => p.publicId === activePlanId)?.sortOrder ?? -Infinity;

    const openConfirmDialog = (planPublicId: string, planName: string) => {
        setConfirmInput('');
        setConfirmDialog({ publicId: planPublicId, name: planName });
    };

    const handleUpgrade = async () => {
        if (!confirmDialog) return;

        setConfirmDialog(null);
        setUpgradingPlanId(confirmDialog.publicId);

        try {
            await upgradePlan({
                variables: {
                    input: {
                        projectPublicId: projectId,
                        planPublicId: confirmDialog.publicId,
                    },
                },
                refetchQueries: ['GetProjectForForge'],
            });
            toast.success('Subscription plan upgraded.', { position: 'top-center' });
        } catch {
            toast.error('Failed to upgrade plan.', { position: 'top-center' });
        } finally {
            setUpgradingPlanId(null);
        }
    };

    return (
        <section className="bg-card overflow-hidden rounded-xl border shadow-sm">
            <div className="bg-muted/30 border-b px-4 py-3 sm:px-5">
                <h2 className="text-base font-semibold">Subscription Plan</h2>
                <p className="text-muted-foreground mt-0.5 text-sm">
                    Your current plan and available upgrades.
                </p>
            </div>

            <div className="grid gap-4 p-4 sm:grid-cols-2 sm:p-5 lg:grid-cols-4">
                {loading
                    ? Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} className="h-48 rounded-lg" />
                    ))
                    : plans.map((plan) => {
                        const isActive = plan.publicId === activePlanId;
                        const isUpgrading = upgradingPlanId === plan.publicId;
                        const isDowngrade = (plan.sortOrder ?? 0) < activePlanSortOrder;

                        return (
                            <div
                                key={plan.publicId}
                                className={`relative flex flex-col rounded-lg border p-4 transition-colors ${isActive
                                    ? 'border-primary/10 bg-primary/3'
                                    : 'bg-muted/20 hover:bg-muted/40'
                                    }`}
                            >
                                {plan.badge && (
                                    <Badge className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-[#4CAF50] text-xs hover:bg-[#43A047]">
                                        {plan.badge}
                                    </Badge>
                                )}

                                <div className="mb-3">
                                    <h3 className="text-sm font-semibold">{plan.name}</h3>
                                    <p className="text-foreground mt-0.5 text-xl font-bold">
                                        {(plan.priceLabel ?? '').split('/')[0]}
                                        {plan.isCustomPricing === false && (
                                            <span className="text-muted-foreground text-sm font-normal">/month</span>
                                        )}
                                    </p>
                                    <p className="text-muted-foreground mt-1 text-xs">{plan.description}</p>
                                </div>

                                <ul className="mb-4 flex flex-col gap-1.5">
                                    {[...(plan.features ?? [])].sort(bySortOrder).map((feature) => (
                                        <li key={feature.id} className="flex items-start gap-2">
                                            <Check className="mt-0.5 size-3.5 shrink-0 text-[#4CAF50]" />
                                            <span className="text-foreground/80 text-xs">{feature.label}</span>
                                        </li>
                                    ))}
                                </ul>

                                <div className="mt-auto">
                                    {isActive ? (
                                        <Button variant="outline" size="sm" className="w-full" disabled>
                                            Active
                                        </Button>
                                    ) : isDowngrade ? (
                                        <Button variant="outline" size="sm" className="w-full" disabled>
                                            Downgrade
                                        </Button>
                                    ) : (
                                        <Button
                                            size="sm"
                                            className="w-full gap-1.5"
                                            variant="outline"
                                            disabled={isUpgrading || upgradingPlanId !== null}
                                            onClick={() => openConfirmDialog(plan.publicId, plan.name)}
                                        >
                                            {isUpgrading ? (
                                                <>
                                                    <Loader2 className="size-3.5 animate-spin" />
                                                    Upgrading...
                                                </>
                                            ) : (
                                                <>
                                                    <Zap className="size-3.5" />
                                                    Upgrade
                                                </>
                                            )}
                                        </Button>
                                    )}
                                </div>
                            </div>
                        );
                    })
                }
            </div>

            <div className="border-t px-4 py-3 sm:px-5">
                <p className="text-muted-foreground text-xs">
                    Once you upgrade, you cannot downgrade to a lower plan.{' '}
                    Have any inquiries? Ask the Kubis team on{' '}
                    <Button variant="link" size="sm" className="text-foreground h-auto p-0 text-xs underline underline-offset-2" asChild>
                        <Link href={ROUTE.FORGE.PROJECT_THREADS(projectId)}>
                            Threads
                        </Link>
                    </Button>
                </p>
            </div>

            <Dialog open={!!confirmDialog} onOpenChange={(open) => !open && setConfirmDialog(null)}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Confirm Plan Upgrade</DialogTitle>
                        <DialogDescription>
                            You are about to upgrade to the <span className="text-foreground font-medium">{confirmDialog?.name}</span> plan.
                            This action cannot be undone. Type <span className="text-foreground font-medium">{confirmDialog?.name}</span> to confirm.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="confirm-plan-name" className="text-sm">Plan name</Label>
                        <Input
                            id="confirm-plan-name"
                            value={confirmInput}
                            onChange={(e) => setConfirmInput(e.target.value)}
                            placeholder={confirmDialog?.name}
                            autoComplete="off"
                        />
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setConfirmDialog(null)}>
                            Cancel
                        </Button>
                        <Button
                            disabled={confirmInput !== confirmDialog?.name}
                            onClick={handleUpgrade}
                        >
                            <Zap className="size-3.5" />
                            Upgrade to {confirmDialog?.name}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </section>
    );
}
