import { Link } from '@inertiajs/react';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/hooks/use-current-url';
import type { NavItem } from '@/types';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const { isCurrentUrl } = useCurrentUrl();

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel className="px-3 text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-slate-500">
                Menu Utama
            </SidebarGroupLabel>
            <SidebarMenu className="gap-2">
                {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                            asChild
                            isActive={isCurrentUrl(item.href)}
                            size="lg"
                            className="group relative h-11 rounded-xl border border-transparent bg-white/70 px-3 text-slate-700 shadow-sm transition-all hover:-translate-y-0.5 hover:border-white hover:bg-white hover:text-slate-900 hover:shadow-md data-[active=true]:border-transparent data-[active=true]:bg-gradient-to-r data-[active=true]:from-red-600 data-[active=true]:via-red-500 data-[active=true]:to-blue-600 data-[active=true]:text-white data-[active=true]:shadow-[0_16px_30px_-18px_rgba(15,23,42,0.8)]"
                            tooltip={{ children: item.title }}
                        >
                            <Link href={item.href} prefetch>
                                {item.icon && (
                                    <item.icon className="size-4 text-slate-500 transition-colors group-data-[active=true]:text-white" />
                                )}
                                <span>{item.title}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
