import Link from 'next/link';
import { Button } from '@repo/shadcn-ui/components/button';
import { Globe } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="border-t border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-gray-900">
            <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
                {/* Footer Links Grid */}
                <div className="mb-12 grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-6">
                    {/* What's new */}
                    <div>
                        <h3 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">
                            What&apos;s new
                        </h3>
                        <ul className="space-y-3">
                            <li>
                                <Link
                                    href="#"
                                    className="text-sm text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                                >
                                    Latest features
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="text-sm text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                                >
                                    Product updates
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="text-sm text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                                >
                                    Roadmap
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Products */}
                    <div>
                        <h3 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">
                            Products
                        </h3>
                        <ul className="space-y-3">
                            <li>
                                <Link
                                    href="/drive"
                                    className="text-sm text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                                >
                                    Drive
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/mail"
                                    className="text-sm text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                                >
                                    Mail
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/calendar"
                                    className="text-sm text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                                >
                                    Calendar
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/meet"
                                    className="text-sm text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                                >
                                    Meet
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h3 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">
                            Resources
                        </h3>
                        <ul className="space-y-3">
                            <li>
                                <Link
                                    href="#"
                                    className="text-sm text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                                >
                                    Documentation
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="text-sm text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                                >
                                    API Reference
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="text-sm text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                                >
                                    Tutorials
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="text-sm text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                                >
                                    Community
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Business */}
                    <div>
                        <h3 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">
                            Business
                        </h3>
                        <ul className="space-y-3">
                            <li>
                                <Link
                                    href="#"
                                    className="text-sm text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                                >
                                    Enterprise
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="text-sm text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                                >
                                    Plans & Pricing
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="text-sm text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                                >
                                    For Teams
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">
                            Support
                        </h3>
                        <ul className="space-y-3">
                            <li>
                                <Link
                                    href="#"
                                    className="text-sm text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                                >
                                    Help Center
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="text-sm text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                                >
                                    Contact Us
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="text-sm text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                                >
                                    Status
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h3 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">
                            Company
                        </h3>
                        <ul className="space-y-3">
                            <li>
                                <Link
                                    href="#"
                                    className="text-sm text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                                >
                                    About
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="text-sm text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                                >
                                    Blog
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="text-sm text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                                >
                                    Careers
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="text-sm text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                                >
                                    Press
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Footer Bottom */}
                <div className="border-t border-gray-200 pt-8 dark:border-gray-800">
                    <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                        {/* Left side */}
                        <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
                            <Button variant="ghost" size="sm" className="h-auto p-0">
                                <Globe className="mr-2 h-4 w-4" />
                                <span>English (Malaysia)</span>
                            </Button>
                            <Button variant="link" size="sm" className="h-auto p-0" asChild>
                                <Link href="#">Privacy</Link>
                            </Button>
                            <Button variant="link" size="sm" className="h-auto p-0" asChild>
                                <Link href="#">Terms of use</Link>
                            </Button>
                            <Button variant="link" size="sm" className="h-auto p-0" asChild>
                                <Link href="#">Contact</Link>
                            </Button>
                        </div>

                        {/* Right side */}
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                            © KUBIS 2025
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
