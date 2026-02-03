import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import type { BreadcrumbItem as BreadcrumbItemType } from '@/types';

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    return (
        <header className="relative flex h-14 shrink-0 items-center gap-2 border-b border-white/60 bg-white/75 px-4 backdrop-blur-xl shadow-[inset_0_-1px_0_rgba(15,23,42,0.06)] transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 sm:h-16 sm:px-6">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-red-500/60 via-yellow-400/60 to-blue-500/60" />
            <div className="relative z-10 flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>
        </header>
    );
}
