import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';
import { Badge } from '../components/badge';
import { Button } from '../components/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/card';

interface ComingSoonAction {
    label: string;
    href: string;
}

interface ComingSoonProps {
    badgeText?: string;
    title?: string;
    description?: string;
    etaText?: string;
    primaryAction?: ComingSoonAction;
    secondaryAction?: ComingSoonAction;
    className?: string;
}

export default function ComingSoon({
    badgeText = 'New Experience',
    title = 'Coming Soon',
    description = 'We are building this feature right now. Check back shortly for the full experience.',
    etaText = 'Expected rollout soon',
    primaryAction,
    secondaryAction,
    className,
}: ComingSoonProps) {
    return (
        <section className={cn('bg-background w-full p-6 sm:p-8', className)}>
            <Card className="bg-background border-0 shadow-none">
                <CardHeader className="items-center justify-items-center text-center">
                    <Badge variant="secondary" className="mb-2 gap-1.5 px-3 py-1">
                        <Sparkles className="h-3.5 w-3.5" />
                        {badgeText}
                    </Badge>
                    <CardTitle className="text-3xl tracking-tight sm:text-4xl">{title}</CardTitle>
                    <CardDescription className="max-w-xl text-base">{description}</CardDescription>
                </CardHeader>

                <CardContent className="flex flex-col items-center gap-5">
                    <p className="bg-muted text-muted-foreground rounded-md px-3 py-1.5 text-sm font-medium">
                        {etaText}
                    </p>

                    <div className="flex flex-col items-center gap-3 sm:flex-row">
                        {primaryAction ? (
                            <Button asChild>
                                <Link href={primaryAction.href}>{primaryAction.label}</Link>
                            </Button>
                        ) : null}

                        {secondaryAction ? (
                            <Button asChild variant="secondary">
                                <Link href={secondaryAction.href}>{secondaryAction.label}</Link>
                            </Button>
                        ) : null}
                    </div>
                </CardContent>
            </Card>
        </section>
    );
}
