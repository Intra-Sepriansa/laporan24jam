import { Head, Link, usePage } from '@inertiajs/react';
import { FileText, ShieldCheck, Store, TrendingUp } from 'lucide-react';
import { dashboard, login, register } from '@/routes';
import { index as reportsIndex } from '@/routes/reports';
import type { SharedData } from '@/types';

export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Welcome" />
            <div className="app-surface min-h-screen text-slate-900">
                <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-8 sm:px-6 sm:py-10 lg:px-10">
                    <header className="flex flex-wrap items-center justify-between gap-6">
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-red-600 via-red-500 to-blue-600 text-white shadow-lg">
                                <Store className="h-6 w-6" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                                    Alfamart
                                </p>
                                <p className="font-display text-lg font-bold">
                                    Shift 3 Reports
                                </p>
                            </div>
                        </div>
                        <nav className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
                            {auth.user ? (
                                <Link
                                    href={dashboard()}
                                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-transparent bg-gradient-to-r from-red-600 to-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg sm:w-auto"
                                >
                                    Masuk Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={login()}
                                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/80 bg-white/70 px-5 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-white hover:text-slate-900 sm:w-auto"
                                    >
                                        Login
                                    </Link>
                                    {canRegister && (
                                        <Link
                                            href={register()}
                                            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-transparent bg-gradient-to-r from-red-600 to-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg sm:w-auto"
                                        >
                                            Daftar
                                        </Link>
                                    )}
                                </>
                            )}
                        </nav>
                    </header>

                    <main className="mt-10 flex flex-1 flex-col gap-12 lg:mt-16 lg:flex-row lg:items-center">
                        <div className="flex-1">
                            <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-600 shadow-sm">
                                Sistem Laporan Shift 3
                            </span>
                            <h1 className="mt-6 text-3xl font-bold leading-tight text-slate-900 sm:text-5xl lg:text-6xl">
                                Pantau performa shift dengan
                                <span className="block bg-gradient-to-r from-red-600 via-yellow-400 to-blue-600 bg-clip-text text-transparent">
                                    ritme yang lebih cepat
                                </span>
                            </h1>
                            <p className="mt-4 text-base text-slate-600 sm:text-lg">
                                Rekap penjualan, transaksi, dan APC secara terstruktur dengan tampilan yang
                                fokus, hangat, dan mudah dibaca untuk operasional toko.
                            </p>

                            <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                                <Link
                                    href={auth.user ? dashboard() : login()}
                                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-transparent bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-slate-950 hover:shadow-lg sm:w-auto"
                                >
                                    {auth.user ? 'Buka Dashboard' : 'Mulai Login'}
                                </Link>
                                <Link
                                    href={auth.user ? reportsIndex() : login()}
                                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-white sm:w-auto"
                                >
                                    Lihat Template Laporan
                                </Link>
                            </div>

                            <div className="mt-10 grid gap-4 sm:grid-cols-2">
                                <div className="rounded-2xl border border-white/80 bg-white/75 p-4 shadow-sm backdrop-blur">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-red-600">
                                            <FileText className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-slate-900">Laporan rapi</p>
                                            <p className="text-xs text-slate-500">Format bulanan yang konsisten</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="rounded-2xl border border-white/80 bg-white/75 p-4 shadow-sm backdrop-blur">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                                            <TrendingUp className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-slate-900">Tren jelas</p>
                                            <p className="text-xs text-slate-500">Pantau pergerakan penjualan</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="rounded-2xl border border-white/80 bg-white/75 p-4 shadow-sm backdrop-blur">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-100 text-yellow-700">
                                            <ShieldCheck className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-slate-900">Aman & tepercaya</p>
                                            <p className="text-xs text-slate-500">Akses data lebih terkontrol</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="rounded-2xl border border-white/80 bg-white/75 p-4 shadow-sm backdrop-blur">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                                            <Store className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-slate-900">Siap operasional</p>
                                            <p className="text-xs text-slate-500">Optim untuk kebutuhan toko</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="relative w-full max-w-md sm:max-w-lg">
                            <div className="absolute -left-6 -top-8 h-32 w-32 rounded-full bg-red-500/20 blur-3xl" />
                            <div className="absolute -bottom-10 right-0 h-40 w-40 rounded-full bg-blue-500/20 blur-3xl" />
                            <div className="relative rounded-[32px] border border-white/80 bg-white/85 p-4 shadow-[0_30px_80px_-50px_rgba(15,23,42,0.7)] backdrop-blur-xl sm:p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                                            Ringkasan Hari Ini
                                        </p>
                                        <p className="mt-2 font-display text-xl font-bold text-slate-900 sm:text-2xl">
                                            Shift 3 Highlights
                                        </p>
                                    </div>
                                    <div className="rounded-2xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white">
                                        Live
                                    </div>
                                </div>
                                <div className="mt-6 grid gap-4">
                                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                                            Total Penjualan
                                        </p>
                                        <p className="mt-2 text-xl font-bold text-slate-900 sm:text-2xl">Rp 48,2 Jt</p>
                                        <p className="mt-1 text-xs text-emerald-600">
                                            +12% dibanding kemarin
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="rounded-2xl border border-slate-200 bg-white p-4">
                                            <p className="text-xs text-slate-500">Transaksi</p>
                                            <p className="mt-2 text-lg font-bold text-slate-900 sm:text-xl">1.284</p>
                                        </div>
                                        <div className="rounded-2xl border border-slate-200 bg-white p-4">
                                            <p className="text-xs text-slate-500">APC</p>
                                            <p className="mt-2 text-lg font-bold text-slate-900 sm:text-xl">37,5K</p>
                                        </div>
                                    </div>
                                    <div className="rounded-2xl border border-slate-200 bg-gradient-to-r from-red-600 to-blue-600 p-4 text-white">
                                        <p className="text-xs uppercase tracking-[0.2em] text-white/80">Status</p>
                                        <p className="mt-2 text-lg font-semibold">Semua laporan tersinkron</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}
