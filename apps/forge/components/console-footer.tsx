import Link from 'next/link';
import { cn } from '@repo/shadcn-ui/lib/utils';

export default function ConsoleFooter({ className }: { className?: string }) {
    return (
        <footer className="mt-8">
            <div className="h-px bg-linear-to-r from-transparent via-foreground/10 to-transparent" />
            <div className={cn("mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6", className)}>
                <div className="flex items-center gap-2">
                    <span className="text-muted-foreground text-xs">
                        © {new Date().getFullYear()} Kubis Forge
                    </span>
                </div>
                <Link
                    href="/"
                    className="text-muted-foreground hover:text-foreground text-xs transition-colors"
                >
                    Home
                </Link>
            </div>
        </footer>
    );
}
