'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';
import { Fragment } from 'react';

export default function Breadcrumbs() {
    const pathname = usePathname();

    // Don't show on home page
    if (pathname === '/') return null;

    const segments = pathname.split('/').filter(Boolean);

    const breadcrumbs = segments.map((segment, index) => {
        const href = `/${segments.slice(0, index + 1).join('/')}`;
        // Format label: "cost-calculator" -> "Cost Calculator"
        const label = segment
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');

        return { label, href };
    });

    return (
        <nav aria-label="Breadcrumb" className="w-full mb-6">
            <ol className="flex items-center space-x-2 text-sm text-muted">
                <li>
                    <Link
                        href="/"
                        className="flex items-center hover:text-primary transition-colors"
                        aria-label="Home"
                    >
                        <Home size={16} />
                    </Link>
                </li>

                {breadcrumbs.map((crumb, index) => {
                    const isLast = index === breadcrumbs.length - 1;

                    return (
                        <Fragment key={crumb.href}>
                            <li aria-hidden="true" className="text-stone-300">
                                <ChevronRight size={14} />
                            </li>
                            <li>
                                {isLast ? (
                                    <span className="font-semibold text-foreground" aria-current="page">
                                        {crumb.label}
                                    </span>
                                ) : (
                                    <Link
                                        href={crumb.href}
                                        className="hover:text-primary transition-colors"
                                    >
                                        {crumb.label}
                                    </Link>
                                )}
                            </li>
                        </Fragment>
                    );
                })}
            </ol>
        </nav>
    );
}
