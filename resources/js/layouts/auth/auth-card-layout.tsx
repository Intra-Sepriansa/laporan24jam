import { Link } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';
import AppLogoIcon from '@/components/app-logo-icon';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { dashboard } from '@/routes';

export default function AuthCardLayout({
    children,
    title,
    description,
}: PropsWithChildren<{
    name?: string;
    title?: string;
    description?: string;
}>) {
    return (
        <div className="app-surface flex min-h-svh flex-col items-center justify-center gap-6 p-4 sm:p-6 md:p-10">
            <div className="flex w-full max-w-md flex-col gap-6">
                <Link
                    href={dashboard()}
                    className="flex items-center gap-2 self-center font-medium"
                >
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-red-600 via-red-500 to-blue-600 text-white shadow-md">
                        <AppLogoIcon className="size-7 fill-current text-white" />
                    </div>
                </Link>

                <div className="flex flex-col gap-6">
                    <Card className="rounded-3xl border border-white/80 bg-white/85 backdrop-blur">
                        <CardHeader className="px-6 pb-0 pt-6 text-center sm:px-10 sm:pt-8">
                            <CardTitle className="text-lg sm:text-xl">{title}</CardTitle>
                            <CardDescription>{description}</CardDescription>
                        </CardHeader>
                        <CardContent className="px-6 py-6 sm:px-10 sm:py-8">
                            {children}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
