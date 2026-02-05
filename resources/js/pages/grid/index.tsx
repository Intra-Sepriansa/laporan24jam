import { Head, router, useForm, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Images, Trash2, Save, Eye } from 'lucide-react';
import type { SharedData } from '@/types';
import { useMemo, useState } from 'react';

interface GridPhoto {
    id: number;
    title: string | null;
    code: string | null;
    span: number;
    position: number;
    image_url: string;
}

type GridPageProps = SharedData & {
    photos: GridPhoto[];
    layout?: string | null;
};

export default function GridIndex() {
    const { auth, photos, layout: savedLayout } = usePage<GridPageProps>().props;
    const storeInfo = auth?.user?.employee?.store;
    const storeName = storeInfo?.name ?? 'Dokumentasi Toko';
    const storeCode = storeInfo?.code ?? '';
    const employeeName = auth?.user?.name ?? '';

    const layoutOptions = [
        { value: '2x2', label: '2 x 2', rows: 2, cols: 2 },
        { value: '2x3', label: '2 x 3', rows: 3, cols: 2 },
        { value: '3x3', label: '3 x 3', rows: 3, cols: 3 },
    ];

    const [layout, setLayout] = useState(savedLayout ?? '2x3');
    const gridConfig = layoutOptions.find((option) => option.value === layout) ?? layoutOptions[1];
    const totalSlots = gridConfig.rows * gridConfig.cols;
    const slotPositions = useMemo(() => Array.from({ length: totalSlots }, (_, i) => i + 1), [totalSlots]);

    const photosByPosition = useMemo(() => {
        const map = new Map<number, GridPhoto>();
        photos.forEach((photo) => map.set(photo.position, photo));
        return map;
    }, [photos]);

    const [drafts, setDrafts] = useState<Record<number, { title?: string; code?: string; file?: File; preview?: string }>>({});

    const { processing } = useForm({});
    const [isCompressing, setIsCompressing] = useState(false);

    const compressImage = async (file: File): Promise<File> => {
        if (!file.type.startsWith('image/')) {
            return file;
        }

        const maxSize = 1.2 * 1024 * 1024; // ~1.2MB
        if (file.size <= maxSize) {
            return file;
        }

        const image = new Image();
        const objectUrl = URL.createObjectURL(file);

        try {
            await new Promise<void>((resolve, reject) => {
                image.onload = () => resolve();
                image.onerror = () => reject();
                image.src = objectUrl;
            });

            const createBlob = async (maxDimension: number, quality: number) => {
                let { width, height } = image;
                if (width > height) {
                    if (width > maxDimension) {
                        height = Math.round((height * maxDimension) / width);
                        width = maxDimension;
                    }
                } else if (height > maxDimension) {
                    width = Math.round((width * maxDimension) / height);
                    height = maxDimension;
                }

                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const context = canvas.getContext('2d');
                if (!context) {
                    return null;
                }
                context.drawImage(image, 0, 0, width, height);

                return new Promise<Blob | null>((resolve) =>
                    canvas.toBlob(resolve, 'image/jpeg', quality)
                );
            };

            let blob = await createBlob(1280, 0.75);
            if (!blob) {
                return file;
            }

            if (blob.size > maxSize) {
                blob = await createBlob(1024, 0.65);
            }
            if (blob && blob.size > maxSize) {
                blob = await createBlob(900, 0.6);
            }
            if (blob && blob.size > maxSize) {
                blob = await createBlob(800, 0.55);
            }
            if (!blob) {
                return file;
            }

            const compressedName = file.name.replace(/\.\w+$/, '.jpg');
            return new File([blob], compressedName, { type: 'image/jpeg' });
        } catch (error) {
            return file;
        } finally {
            URL.revokeObjectURL(objectUrl);
        }
    };

    const handleLayoutSave = () => {
        const formData = new FormData();
        formData.append('layout', layout);

        router.post('/grid/batch', formData, {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    const handleSlotSave = (position: number) => {
        const draft = drafts[position];
        const photo = photosByPosition.get(position);

        const formData = new FormData();
        formData.append('layout', layout);
        formData.append('items[0][position]', String(position));
        formData.append('items[0][title]', draft?.title ?? photo?.title ?? '');
        formData.append('items[0][code]', draft?.code ?? photo?.code ?? storeCode);

        if (draft?.file) {
            formData.append('items[0][image]', draft.file);
        }

        router.post('/grid/batch', formData, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                setDrafts((prev) => {
                    const next = { ...prev };
                    delete next[position];
                    return next;
                });
            },
        });
    };

    const handleSlotChange = (position: number, field: 'title' | 'code', value: string) => {
        setDrafts((prev) => ({
            ...prev,
            [position]: {
                ...prev[position],
                [field]: value,
            },
        }));
    };

    const handleFileChange = async (position: number, file?: File | null) => {
        if (!file) return;
        setIsCompressing(true);
        const compressed = await compressImage(file);
        const previewUrl = URL.createObjectURL(compressed);
        setDrafts((prev) => ({
            ...prev,
            [position]: {
                ...prev[position],
                file: compressed,
                preview: previewUrl,
            },
        }));
        setIsCompressing(false);
    };

    const handleBulkFiles = async (files: FileList | null) => {
        if (!files) return;
        const fileArray = Array.from(files);
        let fileIndex = 0;
        setIsCompressing(true);
        const nextDrafts: Record<number, { title?: string; code?: string; file?: File; preview?: string }> = {};
        for (const position of slotPositions) {
            if (fileIndex >= fileArray.length) break;
            const existing = photosByPosition.get(position);
            if (existing) continue;
            const file = fileArray[fileIndex];
            const compressed = await compressImage(file);
            nextDrafts[position] = {
                file: compressed,
                preview: URL.createObjectURL(compressed),
            };
            fileIndex += 1;
        }
        setDrafts((prev) => ({ ...prev, ...nextDrafts }));
        setIsCompressing(false);
    };

    const handleDelete = (id: number) => {
        if (confirm('Hapus foto ini?')) {
            router.delete(`/grid/${id}`, { preserveScroll: true });
        }
    };

    return (
        <AppLayout>
            <Head title="Grid Foto" />

            <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                            Grid Foto
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Dokumentasi display toko dalam satu tampilan rapi.
                        </p>
                    </div>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                        <Button variant="outline" asChild>
                            <a href="/grid/display">
                                <Eye className="w-4 h-4 mr-2" />
                                Lihat Grid
                            </a>
                        </Button>
                        <Badge className="w-fit bg-red-600 text-white">
                            {storeName}
                        </Badge>
                        {storeCode && (
                            <Badge variant="outline" className="w-fit border-red-200 text-red-600">
                                {storeCode}
                            </Badge>
                        )}
                        {employeeName && (
                            <Badge variant="outline" className="w-fit border-slate-200 text-slate-600">
                                {employeeName}
                            </Badge>
                        )}
                    </div>
                </div>

                <Card className="border-0 shadow-lg">
                    <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
                        <CardTitle className="flex items-center gap-3 text-lg sm:text-xl">
                            <div className="w-9 h-9 bg-red-600 rounded-lg flex items-center justify-center sm:w-10 sm:h-10">
                                <Images className="w-5 h-5 text-white" />
                            </div>
                            Grid Dokumentasi
                        </CardTitle>
                        <CardDescription className="text-sm sm:text-base">
                            Susun foto display agar mudah dibaca tim.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="space-y-6">
                            <div className="flex flex-col gap-3 rounded-2xl border border-dashed border-red-200 bg-red-50/40 p-4 sm:flex-row sm:items-end sm:justify-between">
                                <div className="space-y-2">
                                    <Label htmlFor="layout">Pilih Layout</Label>
                                    <select
                                        id="layout"
                                        value={layout}
                                        onChange={(event) => setLayout(event.target.value)}
                                        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm sm:w-56"
                                    >
                                        {layoutOptions.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                                    <div className="space-y-1">
                                        <Label htmlFor="bulk-files">Pilih Banyak Foto</Label>
                                        <Input
                                            id="bulk-files"
                                            type="file"
                                            accept="image/*"
                                            capture="environment"
                                            multiple
                                            onChange={(event) => handleBulkFiles(event.target.files)}
                                            className="h-11"
                                        />
                                    </div>
                                    <Button type="button" className="h-11" onClick={handleLayoutSave} disabled={processing}>
                                        <Save className="w-4 h-4 mr-2" />
                                        Simpan Layout
                                    </Button>
                                </div>
                            </div>
                            {isCompressing && (
                                <p className="text-xs text-slate-500">
                                    Memproses gambar, mohon tunggu...
                                </p>
                            )}
                            <p className="text-xs text-slate-500">
                                Setelah pilih foto, klik tombol <strong>Simpan</strong> di slot yang diubah.
                            </p>

                            <div
                                className="grid gap-4"
                                style={{
                                    gridTemplateColumns: `repeat(${gridConfig.cols}, minmax(0, 1fr))`,
                                }}
                            >
                                {slotPositions.map((position) => {
                                    const photo = photosByPosition.get(position);
                                    const draft = drafts[position];
                                    const preview = draft?.preview;

                                    return (
                                        <div
                                            key={position}
                                            className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm"
                                        >
                                            <div className="text-xs font-semibold text-slate-500">
                                                Slot {position}
                                            </div>
                                            <div className="mt-2 overflow-hidden rounded-xl border border-slate-100 bg-slate-50">
                                                {preview || photo ? (
                                                    <img
                                                        src={preview ?? photo?.image_url}
                                                        alt={photo?.title ?? `Foto ${position}`}
                                                        className="h-32 w-full object-cover sm:h-40"
                                                    />
                                                ) : (
                                                    <div className="flex h-32 w-full items-center justify-center text-xs text-slate-400 sm:h-40">
                                                        Belum ada foto
                                                    </div>
                                                )}
                                            </div>

                                            <div className="mt-3 space-y-2">
                                                <div className="space-y-1">
                                                    <Label htmlFor={`title-${position}`}>Judul</Label>
                                                    <Input
                                                        id={`title-${position}`}
                                                        value={draft?.title ?? photo?.title ?? ''}
                                                        onChange={(event) => handleSlotChange(position, 'title', event.target.value)}
                                                        placeholder="Judul foto"
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <Label htmlFor={`code-${position}`}>Kode</Label>
                                                    <Input
                                                        id={`code-${position}`}
                                                        value={draft?.code ?? photo?.code ?? storeCode}
                                                        onChange={(event) => handleSlotChange(position, 'code', event.target.value)}
                                                        placeholder="Kode toko"
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <Label htmlFor={`file-${position}`}>Pilih Foto</Label>
                                                    <Input
                                                        id={`file-${position}`}
                                                        type="file"
                                                        accept="image/*"
                                                        capture="environment"
                                                        onChange={(event) => handleFileChange(position, event.target.files?.[0])}
                                                        className="h-11"
                                                    />
                                                </div>
                                                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        className="w-full sm:w-auto"
                                                        onClick={() => handleSlotSave(position)}
                                                        disabled={processing}
                                                    >
                                                        <Save className="w-4 h-4 mr-2" />
                                                        Simpan
                                                    </Button>
                                                    {photo && (
                                                        <Button
                                                            type="button"
                                                            variant="destructive"
                                                            onClick={() => handleDelete(photo.id)}
                                                            className="w-full sm:w-auto"
                                                        >
                                                            <Trash2 className="w-4 h-4 mr-2" />
                                                            Hapus
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                    </div>
                                );
                            })}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
