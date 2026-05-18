import Link from 'next/link';

export default function ConsoleFooter() {
    return (
        <footer className="border-border/60 mt-8 border-t">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">
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
