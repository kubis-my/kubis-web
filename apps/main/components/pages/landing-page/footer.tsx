import Link from "next/link";
import { Button } from "@repo/shadcn-ui/components/button";
import { Globe } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
                {/* Footer Links Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-12">
                    {/* What's new */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                            What&apos;s new
                        </h3>
                        <ul className="space-y-3">
                            <li>
                                <Link
                                    href="#"
                                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                                >
                                    Latest features
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                                >
                                    Product updates
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                                >
                                    Roadmap
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Products */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                            Products
                        </h3>
                        <ul className="space-y-3">
                            <li>
                                <Link
                                    href="/drive"
                                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                                >
                                    Drive
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/mail"
                                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                                >
                                    Mail
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/calendar"
                                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                                >
                                    Calendar
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/meet"
                                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                                >
                                    Meet
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                            Resources
                        </h3>
                        <ul className="space-y-3">
                            <li>
                                <Link
                                    href="#"
                                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                                >
                                    Documentation
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                                >
                                    API Reference
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                                >
                                    Tutorials
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                                >
                                    Community
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Business */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                            Business
                        </h3>
                        <ul className="space-y-3">
                            <li>
                                <Link
                                    href="#"
                                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                                >
                                    Enterprise
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                                >
                                    Plans & Pricing
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                                >
                                    For Teams
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                            Support
                        </h3>
                        <ul className="space-y-3">
                            <li>
                                <Link
                                    href="#"
                                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                                >
                                    Help Center
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                                >
                                    Contact Us
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                                >
                                    Status
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                            Company
                        </h3>
                        <ul className="space-y-3">
                            <li>
                                <Link
                                    href="#"
                                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                                >
                                    About
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                                >
                                    Blog
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                                >
                                    Careers
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                                >
                                    Press
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Footer Bottom */}
                <div className="pt-8 border-t border-gray-200 dark:border-gray-800">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        {/* Left side */}
                        <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
                            <Button variant="ghost" size="sm" className="h-auto p-0">
                                <Globe className="w-4 h-4 mr-2" />
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
    )
}
