import { Link, usePage } from '@inertiajs/react';
import { Store, FileText, LayoutGrid, Settings } from 'lucide-react';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem, SharedData } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Laporan Shift',
        href: '/reports',
        icon: FileText,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Pengaturan',
        href: '/settings/profile',
        icon: Settings,
    },
];

export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;
    const storeInfo = auth?.user?.employee?.store;
    const storeName = storeInfo?.name ?? 'Nama Toko';
    const storeCode = storeInfo?.code ?? '';
    const employeeName = auth?.user?.name ?? 'Nama Karyawan';

    return (
        <Sidebar
            collapsible="icon"
            variant="inset"
            className="border-sidebar-border/60 [&_[data-sidebar=sidebar]]:bg-white/90 [&_[data-sidebar=sidebar]]:backdrop-blur-xl"
        >
            <SidebarHeader className="p-3">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild className="h-auto p-0 hover:bg-transparent">
                            <Link href={dashboard()} prefetch>
                                <div className="w-full rounded-2xl bg-gradient-to-br from-red-600 via-red-500 to-blue-600 p-4 text-white shadow-[0_18px_40px_-24px_rgba(15,23,42,0.8)] transition-transform duration-300 hover:-translate-y-0.5">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/30">
                                            <Store className="h-6 w-6" />
                                        </div>
                                        <div className="min-w-0 group-data-[collapsible=icon]:hidden">
                                            <span className="text-xs uppercase tracking-[0.2em] text-white/70">
                                                Alfamart
                                            </span>
                                            <span className="block truncate font-display text-lg font-bold">
                                                Shift 3 Reports
                                            </span>
                                            <span className="block truncate text-xs text-white/80">
                                                Belanja puas, harga pas
                                            </span>
                                        </div>
                                    </div>
                                    <div className="mt-4 flex flex-wrap gap-2 text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-white/70 group-data-[collapsible=icon]:hidden">
                                        <span className="rounded-full bg-white/15 px-3 py-1">
                                            {storeName}
                                        </span>
                                        {storeCode && (
                                            <span className="rounded-full bg-white/15 px-3 py-1">
                                                {storeCode}
                                            </span>
                                        )}
                                    </div>
                                    <div className="mt-2 text-[0.65rem] font-medium text-white/80 group-data-[collapsible=icon]:hidden">
                                        {employeeName}
                                    </div>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="px-2">
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter className="border-t border-white/70 px-2 pt-2">
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
