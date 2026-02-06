import { Link, usePage } from '@inertiajs/react';
import { LayoutGrid, FileText, BarChart3, ClipboardList, MoreHorizontal, Target, Users, StoreIcon, FileDown, Images, Settings, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface NavItem {
    title: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
}

const primaryNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Laporan',
        href: '/reports',
        icon: FileText,
    },
    {
        title: 'Analitik',
        href: '/analytics',
        icon: BarChart3,
    },
    {
        title: 'Catatan',
        href: '/notes',
        icon: ClipboardList,
    },
];

const moreNavItems: NavItem[] = [
    {
        title: 'Target & KPI',
        href: '/targets',
        icon: Target,
    },
    {
        title: 'Karyawan',
        href: '/employees',
        icon: Users,
    },
    {
        title: 'Profil Toko',
        href: '/store',
        icon: StoreIcon,
    },
    {
        title: 'Ringkasan & Export',
        href: '/summary',
        icon: FileDown,
    },
    {
        title: 'Grid Foto',
        href: '/grid',
        icon: Images,
    },
    {
        title: 'Pengaturan',
        href: '/settings/profile',
        icon: Settings,
    },
];

export function MobileNav() {
    const { url } = usePage();
    const [showMore, setShowMore] = useState(false);

    const isActive = (href: string) => {
        if (href === '/dashboard') {
            return url === '/dashboard' || url === '/';
        }
        return url.startsWith(href);
    };

    const isMoreActive = moreNavItems.some(item => isActive(item.href));

    return (
        <>
            {/* More Menu Overlay */}
            {showMore && (
                <div className="fixed inset-0 z-60 md:hidden" onClick={() => setShowMore(false)}>
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

                    {/* Menu Panel */}
                    <div
                        className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl p-6 pb-safe animate-in slide-in-from-bottom duration-300"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-gray-900">Menu Lainnya</h3>
                            <button
                                onClick={() => setShowMore(false)}
                                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"
                            >
                                <X className="w-4 h-4 text-gray-600" />
                            </button>
                        </div>

                        {/* Drag Handle */}
                        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-10 h-1 bg-gray-300 rounded-full" />

                        <div className="grid grid-cols-3 gap-3">
                            {moreNavItems.map((item) => {
                                const Icon = item.icon;
                                const active = isActive(item.href);

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setShowMore(false)}
                                        className={cn(
                                            'flex flex-col items-center justify-center p-4 rounded-2xl transition-all duration-200',
                                            active
                                                ? 'bg-red-50 text-red-600 shadow-sm'
                                                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                                        )}
                                    >
                                        <div className={cn(
                                            'w-12 h-12 rounded-xl flex items-center justify-center mb-2 transition-all',
                                            active
                                                ? 'bg-red-100'
                                                : 'bg-white shadow-sm'
                                        )}>
                                            <Icon className={cn(
                                                'w-6 h-6',
                                                active ? 'text-red-600' : 'text-gray-500'
                                            )} />
                                        </div>
                                        <span className={cn(
                                            'text-[11px] font-semibold text-center leading-tight',
                                            active ? 'text-red-600' : 'text-gray-600'
                                        )}>
                                            {item.title}
                                        </span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* Bottom Navigation Bar */}
            <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
                {/* Glass effect background */}
                <div className="absolute inset-0 bg-white/80 backdrop-blur-xl border-t border-gray-200/50" />

                {/* Safe area padding for iOS */}
                <div className="relative flex items-center justify-around px-2 pb-safe">
                    {primaryNavItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.href);

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    'flex flex-col items-center justify-center py-2 px-3 min-w-14 transition-all duration-200',
                                    active
                                        ? 'text-red-600'
                                        : 'text-gray-500 hover:text-gray-700'
                                )}
                            >
                                <div className={cn(
                                    'relative p-2 rounded-xl transition-all duration-200',
                                    active && 'bg-red-50'
                                )}>
                                    <Icon className={cn(
                                        'w-5 h-5 transition-transform duration-200',
                                        active && 'scale-110'
                                    )} />
                                    {active && (
                                        <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-red-600 rounded-full" />
                                    )}
                                </div>
                                <span className={cn(
                                    'text-[10px] font-medium mt-0.5 transition-colors duration-200',
                                    active ? 'text-red-600' : 'text-gray-500'
                                )}>
                                    {item.title}
                                </span>
                            </Link>
                        );
                    })}

                    {/* More Button */}
                    <button
                        onClick={() => setShowMore(!showMore)}
                        className={cn(
                            'flex flex-col items-center justify-center py-2 px-3 min-w-14 transition-all duration-200',
                            (showMore || isMoreActive)
                                ? 'text-red-600'
                                : 'text-gray-500 hover:text-gray-700'
                        )}
                    >
                        <div className={cn(
                            'relative p-2 rounded-xl transition-all duration-200',
                            (showMore || isMoreActive) && 'bg-red-50'
                        )}>
                            <MoreHorizontal className={cn(
                                'w-5 h-5 transition-transform duration-200',
                                showMore && 'rotate-90'
                            )} />
                            {isMoreActive && !showMore && (
                                <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-red-600 rounded-full" />
                            )}
                        </div>
                        <span className={cn(
                            'text-[10px] font-medium mt-0.5 transition-colors duration-200',
                            (showMore || isMoreActive) ? 'text-red-600' : 'text-gray-500'
                        )}>
                            Lainnya
                        </span>
                    </button>
                </div>
            </nav>
        </>
    );
}
