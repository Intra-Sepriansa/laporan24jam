import { Head, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Images, Download, Printer, Edit } from 'lucide-react';
import type { SharedData } from '@/types';
import { useMemo } from 'react';

interface GridPhoto {
    id: number;
    title: string | null;
    code: string | null;
    span: number;
    position: number;
    image_url: string;
}

type GridDisplayProps = SharedData & {
    photos: GridPhoto[];
    layout?: string | null;
};

export default function GridDisplay() {
    const { auth, photos, layout: savedLayout } = usePage<GridDisplayProps>().props;
    const storeInfo = auth?.user?.employee?.store;
    const storeName = storeInfo?.name ?? 'Dokumentasi Toko';
    const storeCode = storeInfo?.code ?? '';
    const employeeName = auth?.user?.name ?? '';

    const layoutOptions = [
        { value: '2x2', label: '2 x 2', rows: 2, cols: 2 },
        { value: '2x3', label: '2 x 3', rows: 3, cols: 2 },
        { value: '3x3', label: '3 x 3', rows: 3, cols: 3 },
    ];

    const layout = savedLayout ?? '2x3';
    const gridConfig = layoutOptions.find((option) => option.value === layout) ?? layoutOptions[1];
    const totalSlots = gridConfig.rows * gridConfig.cols;
    const slotPositions = useMemo(() => Array.from({ length: totalSlots }, (_, i) => i + 1), [totalSlots]);

    const photosByPosition = useMemo(() => {
        const map = new Map<number, GridPhoto>();
        photos.forEach((photo) => map.set(photo.position, photo));
        return map;
    }, [photos]);

    const handlePrint = () => {
        window.print();
    };

    return (
        <AppLayout>
            <Head title="Display Grid Foto" />

            <div className="space-y-6">
                {/* Header - Hide on print */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between print:hidden">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                            Display Grid Foto
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Tampilan grid dokumentasi display toko
                        </p>
                    </div>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                        <Button variant="outline" onClick={handlePrint}>
                            <Printer className="w-4 h-4 mr-2" />
                            Print
                        </Button>
                        <Button variant="outline" asChild>
                            <a href="/grid">
                                <Edit className="w-4 h-4 mr-2" />
                                Edit Grid
                            </a>
                        </Button>
                    </div>
                </div>

                {/* Print Header - Show only on print */}
                <div className="hidden print:block text-center mb-6">
                    <h1 className="text-2xl font-bold text-primary">ALFAMART</h1>
                    <h2 className="text-xl font-semibold mt-2">DOKUMENTASI DISPLAY TOKO</h2>
                    <p className="text-lg mt-1">{storeName} - {storeCode}</p>
                    <p className="text-sm text-gray-600 mt-1">Layout: {gridConfig.label}</p>
                </div>

                {/* Store Info */}
                <Card className="border-0 shadow-lg print:shadow-none print:border-2">
                    <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b print:bg-white">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-3 text-lg sm:text-xl">
                                    <div className="w-9 h-9 bg-red-600 rounded-lg flex items-center justify-center sm:w-10 sm:h-10 print:hidden">
                                        <Images className="w-5 h-5 text-white" />
                                    </div>
                                    {storeName}
                                </CardTitle>
                                <CardDescription className="text-sm sm:text-base mt-1">
                                    Layout: {gridConfig.label} ({photos.length} foto)
                                </CardDescription>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <Badge className="bg-red-600 text-white">
                                    {storeCode}
                                </Badge>
                                <Badge variant="outline" className="border-slate-200 text-slate-600">
                                    {employeeName}
                                </Badge>
                            </div>
                        </div>
                    </CardHeader>
                </Card>

                {/* Grid Display */}
                <Card className="border-0 shadow-lg print:shadow-none print:border-2">
                    <CardContent className="pt-6">
                        {photos.length > 0 ? (
                            <div
                                className="grid gap-4 print:gap-3"
                                style={{
                                    gridTemplateColumns: `repeat(${gridConfig.cols}, minmax(0, 1fr))`,
                                }}
                            >
                                {slotPositions.map((position) => {
                                    const photo = photosByPosition.get(position);

                                    if (!photo) {
                                        return (
                                            <div
                                                key={position}
                                                className="rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 p-4 print:hidden"
                                            >
                                                <div className="flex h-48 w-full items-center justify-center text-sm text-gray-400 sm:h-64">
                                                    Slot {position} kosong
                                                </div>
                                            </div>
                                        );
                                    }

                                    return (
                                        <div
                                            key={position}
                                            className="rounded-2xl border-2 border-gray-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow print:shadow-none print:border print:rounded-lg"
                                        >
                                            {/* Image */}
                                            <div className="relative">
                                                <img
                                                    src={photo.image_url}
                                                    alt={photo.title ?? `Foto ${position}`}
                                                    className="h-48 w-full object-cover sm:h-64 print:h-48"
                                                />
                                                {/* Position Badge */}
                                                <div className="absolute top-2 left-2 bg-red-600 text-white px-3 py-1 rounded-lg text-xs font-bold shadow-lg print:bg-red-600">
                                                    #{position}
                                                </div>
                                            </div>

                                            {/* Info */}
                                            <div className="p-4 print:p-2">
                                                {photo.title && (
                                                    <h3 className="font-bold text-gray-900 text-base mb-1 print:text-sm">
                                                        {photo.title}
                                                    </h3>
                                                )}
                                                {photo.code && (
                                                    <p className="text-sm text-gray-600 print:text-xs">
                                                        Kode: {photo.code}
                                                    </p>
                                                )}
                                                {!photo.title && !photo.code && (
                                                    <p className="text-sm text-gray-400 italic">
                                                        Tanpa keterangan
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Images className="w-10 h-10 text-gray-400" />
                                </div>
                                <p className="text-gray-900 font-semibold text-lg mb-2">Belum ada foto</p>
                                <p className="text-gray-500 mb-6">Mulai upload foto untuk membuat grid dokumentasi</p>
                                <Button asChild size="lg" className="gap-2">
                                    <a href="/grid">
                                        <Edit className="w-5 h-5" />
                                        Kelola Grid Foto
                                    </a>
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Print Footer */}
                <div className="hidden print:block mt-8 text-center text-sm text-gray-600">
                    <p>Dicetak pada: {new Date().toLocaleString('id-ID')}</p>
                    <p className="mt-2">© 2026 Alfamart - Sistem Dokumentasi Display Toko</p>
                </div>
            </div>

            {/* Print Styles */}
            <style>{`
                @media print {
                    body {
                        print-color-adjust: exact;
                        -webkit-print-color-adjust: exact;
                    }
                    @page {
                        margin: 1cm;
                        size: landscape;
                    }
                }
            `}</style>
        </AppLayout>
    );
}
