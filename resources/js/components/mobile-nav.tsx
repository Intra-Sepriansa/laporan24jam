import { Link, usePage } from '@inertiajs/react';
import { LayoutGrid, FileText, Images, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
    title: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
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

    const isActive = (href: string) => {
        if (href === '/dashboard') {
            return url === '/dashboard' || url === '/';
        }
        return url.startsWith(href);
    };

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
            {/* Glass effect background */}
            <div className="absolute inset-0 bg-white/80 backdrop-blur-xl border-t border-gray-200/50" />

            {/* Safe area padding for iOS */}
            <div className="relative flex items-center justify-around px-2 pb-safe">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                'flex flex-col items-center justify-center py-2 px-4 min-w-[64px] transition-all duration-200',
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
                                    'w-6 h-6 transition-transform duration-200',
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
            </div>
        </nav>
    );
}
