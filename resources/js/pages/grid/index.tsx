import { Head, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
    Images,
    Trash2,
    Save,
    Eye,
    Grid2X2,
    Grid3X3,
    Square,
    RectangleHorizontal,
    Smartphone,
    Plus,
    Camera,
    Upload,
} from 'lucide-react';
import type { SharedData } from '@/types';
import { useMemo, useState, useRef } from 'react';
import { cn } from '@/lib/utils';

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
    spacing?: number | null;
    ratio?: string | null;
};

type TabType = 'layout' | 'spacing' | 'ratio';

interface PendingPhoto {
    file: File;
    previewUrl: string;
}

const layoutOptions = [
    { value: '2x2', label: '2×2', rows: 2, cols: 2, icon: Grid2X2 },
    { value: '2x3', label: '2×3', rows: 3, cols: 2, icon: Grid2X2 },
    { value: '3x3', label: '3×3', rows: 3, cols: 3, icon: Grid3X3 },
];

const ratioOptions = [
    { value: '1:1', label: '1:1', icon: Square },
    { value: '4:3', label: '4:3', icon: RectangleHorizontal },
    { value: '16:9', label: '16:9', icon: Smartphone },
];

export default function GridIndex() {
    const { auth, photos, layout: savedLayout, spacing: savedSpacing, ratio: savedRatio } = usePage<GridPageProps>().props;
    const storeInfo = auth?.user?.employee?.store;
    const storeCode = storeInfo?.code ?? '';

    const [activeTab, setActiveTab] = useState<TabType>('layout');
    const [layout, setLayout] = useState(savedLayout ?? '2x3');
    const [spacing, setSpacing] = useState(savedSpacing ?? 4);
    const [ratio, setRatio] = useState(savedRatio ?? '4:3');
    const [isSaving, setIsSaving] = useState(false);
    const [isCompressing, setIsCompressing] = useState(false);

    const [pendingPhotos, setPendingPhotos] = useState<Map<number, PendingPhoto>>(new Map());
    const fileInputRefs = useRef<Map<number, HTMLInputElement>>(new Map());
    const bulkInputRef = useRef<HTMLInputElement>(null);

    const gridConfig = layoutOptions.find((opt) => opt.value === layout) ?? layoutOptions[1];
    const totalSlots = gridConfig.rows * gridConfig.cols;
    const slotPositions = useMemo(() => Array.from({ length: totalSlots }, (_, i) => i + 1), [totalSlots]);

    const photosByPosition = useMemo(() => {
        const map = new Map<number, GridPhoto>();
        photos.forEach((photo) => map.set(photo.position, photo));
        return map;
    }, [photos]);

    const getAspectRatio = () => {
        switch (ratio) {
            case '1:1':
                return 'aspect-square';
            case '4:3':
                return 'aspect-[4/3]';
            case '16:9':
                return 'aspect-video';
            default:
                return 'aspect-[4/3]';
        }
    };

    const compressImage = async (file: File): Promise<File> => {
        if (!file.type.startsWith('image/')) return file;

        const maxSize = 1.2 * 1024 * 1024;
        if (file.size <= maxSize) return file;

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
                if (!context) return null;
                context.drawImage(image, 0, 0, width, height);

                return new Promise<Blob | null>((resolve) =>
                    canvas.toBlob(resolve, 'image/jpeg', quality)
                );
            };

            let blob = await createBlob(1280, 0.75);
            if (!blob) return file;

            if (blob.size > maxSize) blob = await createBlob(1024, 0.65);
            if (blob && blob.size > maxSize) blob = await createBlob(900, 0.6);
            if (blob && blob.size > maxSize) blob = await createBlob(800, 0.55);
            if (!blob) return file;

            const compressedName = file.name.replace(/\.\w+$/, '.jpg');
            return new File([blob], compressedName, { type: 'image/jpeg' });
        } finally {
            URL.revokeObjectURL(objectUrl);
        }
    };

    const handlePhotoSelect = async (position: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsCompressing(true);
        const compressed = await compressImage(file);
        const previewUrl = URL.createObjectURL(compressed);

        setPendingPhotos((prev) => {
            const newMap = new Map(prev);
            const oldPending = newMap.get(position);
            if (oldPending) URL.revokeObjectURL(oldPending.previewUrl);
            newMap.set(position, { file: compressed, previewUrl });
            return newMap;
        });
        setIsCompressing(false);
    };

    const handleBulkFiles = async (files: FileList | null) => {
        if (!files) return;
        const fileArray = Array.from(files);
        let fileIndex = 0;
        setIsCompressing(true);

        const newPending = new Map(pendingPhotos);

        for (const position of slotPositions) {
            if (fileIndex >= fileArray.length) break;
            const existing = photosByPosition.get(position);
            const pending = newPending.get(position);
            if (existing || pending) continue;

            const file = fileArray[fileIndex];
            const compressed = await compressImage(file);
            const previewUrl = URL.createObjectURL(compressed);
            newPending.set(position, { file: compressed, previewUrl });
            fileIndex += 1;
        }

        setPendingPhotos(newPending);
        setIsCompressing(false);
    };

    const triggerFileInput = (position: number) => {
        const input = fileInputRefs.current.get(position);
        if (input) input.click();
    };

    const handleDelete = (id: number) => {
        if (confirm('Hapus foto ini?')) {
            router.delete(`/grid/${id}`, { preserveScroll: true });
        }
    };

    const hasPendingChanges =
        pendingPhotos.size > 0 ||
        layout !== (savedLayout ?? '2x3') ||
        spacing !== (savedSpacing ?? 4) ||
        ratio !== (savedRatio ?? '4:3');

    const handleSave = () => {
        setIsSaving(true);
        const formData = new FormData();
        formData.append('layout', layout);
        formData.append('spacing', String(spacing));
        formData.append('ratio', ratio);

        pendingPhotos.forEach((pending, position) => {
            formData.append(`items[${position}][position]`, String(position));
            formData.append(`items[${position}][code]`, storeCode);
            formData.append(`items[${position}][image]`, pending.file);
        });

        router.post('/grid/batch', formData, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                pendingPhotos.forEach((pending) => {
                    URL.revokeObjectURL(pending.previewUrl);
                });
                setPendingPhotos(new Map());
            },
            onFinish: () => setIsSaving(false),
        });
    };

    const getSlotImage = (position: number): string | null => {
        const pending = pendingPhotos.get(position);
        if (pending) return pending.previewUrl;
        const photo = photosByPosition.get(position);
        return photo?.image_url ?? null;
    };

    return (
        <AppLayout>
            <Head title="Grid Foto" />

            <div className="flex flex-col min-h-[calc(100vh-8rem)]">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                            Grid Foto
                        </h1>
                        <p className="text-gray-600 mt-1 text-sm sm:text-base">
                            Tap pada slot untuk menambah atau mengganti foto
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Button
                            variant="outline"
                            onClick={() => bulkInputRef.current?.click()}
                            disabled={isCompressing}
                            className="h-10"
                        >
                            <Upload className="w-4 h-4 mr-2" />
                            Upload Banyak
                        </Button>
                        <input
                            ref={bulkInputRef}
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={(e) => handleBulkFiles(e.target.files)}
                        />
                        <Button variant="outline" asChild className="h-10">
                            <a href="/grid/display">
                                <Eye className="w-4 h-4 mr-2" />
                                Lihat Grid
                            </a>
                        </Button>
                        <Button
                            onClick={handleSave}
                            disabled={isSaving || !hasPendingChanges}
                            className="h-10 bg-red-600 hover:bg-red-700"
                        >
                            <Save className="w-4 h-4 mr-2" />
                            {isSaving ? 'Menyimpan...' : 'Simpan'}
                        </Button>
                    </div>
                </div>

                {/* Loading indicator */}
                {isCompressing && (
                    <div className="mb-4 flex items-center gap-2 text-sm text-gray-600">
                        <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                        Memproses gambar...
                    </div>
                )}

                {/* Main Grid Canvas */}
                <div className="flex-1 mb-6">
                    <div className={cn('bg-white rounded-2xl shadow-lg overflow-hidden mx-auto max-w-3xl', getAspectRatio())}>
                        <div
                            className="w-full h-full grid bg-gray-100 p-2 sm:p-3"
                            style={{
                                gridTemplateColumns: `repeat(${gridConfig.cols}, 1fr)`,
                                gap: `${spacing * 2}px`,
                            }}
                        >
                            {slotPositions.map((position) => {
                                const imageUrl = getSlotImage(position);
                                const hasPending = pendingPhotos.has(position);
                                const photo = photosByPosition.get(position);

                                return (
                                    <div
                                        key={position}
                                        className={cn(
                                            'relative overflow-hidden rounded-xl bg-gray-200 cursor-pointer group transition-all',
                                            'hover:ring-2 hover:ring-red-500 hover:ring-offset-2',
                                            hasPending && 'ring-2 ring-green-500 ring-offset-2'
                                        )}
                                        onClick={() => triggerFileInput(position)}
                                    >
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            ref={(el) => {
                                                if (el) fileInputRefs.current.set(position, el);
                                            }}
                                            onChange={(e) => handlePhotoSelect(position, e)}
                                        />

                                        {imageUrl ? (
                                            <>
                                                <img
                                                    src={imageUrl}
                                                    alt={`Foto ${position}`}
                                                    className="w-full h-full object-cover"
                                                />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                    <div className="p-2 bg-white/20 rounded-full backdrop-blur-sm">
                                                        <Camera className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                                    </div>
                                                    {photo && (
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDelete(photo.id);
                                                            }}
                                                            className="p-2 bg-red-500/80 rounded-full backdrop-blur-sm hover:bg-red-600 transition-colors"
                                                        >
                                                            <Trash2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                                        </button>
                                                    )}
                                                </div>
                                                {hasPending && (
                                                    <div className="absolute top-2 right-2 bg-green-500 text-white text-[10px] px-2 py-1 rounded-full font-semibold shadow-lg">
                                                        Baru
                                                    </div>
                                                )}
                                                <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded-lg font-medium backdrop-blur-sm">
                                                    #{position}
                                                </div>
                                            </>
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 gap-2 group-hover:text-red-500 transition-colors p-4">
                                                <div className="p-3 bg-gray-300 rounded-xl group-hover:bg-red-100 transition-colors">
                                                    <Plus className="w-6 h-6 sm:w-8 sm:h-8" />
                                                </div>
                                                <span className="text-xs sm:text-sm font-medium">Slot {position}</span>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Status info */}
                    <div className="text-center mt-4 text-sm text-gray-500">
                        Layout: <span className="font-medium text-gray-700">{gridConfig.label}</span>
                        {' • '}Spasi: <span className="font-medium text-gray-700">{spacing}px</span>
                        {' • '}Rasio: <span className="font-medium text-gray-700">{ratio}</span>
                        {pendingPhotos.size > 0 && (
                            <span className="text-green-600 font-medium">
                                {' • '}{pendingPhotos.size} foto baru
                            </span>
                        )}
                    </div>
                </div>

                {/* Bottom Settings Panel */}
                <div className="bg-white rounded-t-3xl shadow-[0_-4px_20px_rgba(0,0,0,0.08)] border-t border-gray-100 -mx-4 px-4 sm:-mx-6 sm:px-6 md:-mx-8 md:px-8">
                    {/* Tab Navigation */}
                    <div className="flex border-b border-gray-100 max-w-lg mx-auto">
                        {[
                            { id: 'layout' as TabType, label: 'Tata Letak', icon: Grid2X2 },
                            { id: 'spacing' as TabType, label: 'Spasi', icon: Images },
                            { id: 'ratio' as TabType, label: 'Rasio', icon: Square },
                        ].map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={cn(
                                        'flex-1 py-4 text-sm font-medium transition-colors relative flex items-center justify-center gap-2',
                                        activeTab === tab.id ? 'text-red-600' : 'text-gray-500 hover:text-gray-700'
                                    )}
                                >
                                    <Icon className="w-4 h-4" />
                                    <span className="hidden sm:inline">{tab.label}</span>
                                    {activeTab === tab.id && (
                                        <span className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-red-600 rounded-full" />
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Tab Content */}
                    <div className="py-5 max-w-lg mx-auto">
                        {activeTab === 'layout' && (
                            <div className="flex justify-center gap-3 sm:gap-4">
                                {layoutOptions.map((opt) => {
                                    const Icon = opt.icon;
                                    const isSelected = layout === opt.value;
                                    return (
                                        <button
                                            key={opt.value}
                                            onClick={() => setLayout(opt.value)}
                                            className={cn(
                                                'flex flex-col items-center gap-2 p-3 sm:p-4 rounded-xl border-2 transition-all min-w-[70px] sm:min-w-[80px]',
                                                isSelected
                                                    ? 'border-red-600 bg-red-50 text-red-600'
                                                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                                            )}
                                        >
                                            <div
                                                className={cn(
                                                    'w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center',
                                                    isSelected ? 'bg-red-600 text-white' : 'bg-gray-100'
                                                )}
                                            >
                                                <Icon className="w-5 h-5" />
                                            </div>
                                            <span className="text-xs font-medium">{opt.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        )}

                        {activeTab === 'spacing' && (
                            <div className="space-y-4 px-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Jarak antar foto</span>
                                    <span className="text-sm font-medium text-red-600">{spacing}px</span>
                                </div>
                                <Slider
                                    value={[spacing]}
                                    onValueChange={([val]) => setSpacing(val)}
                                    min={0}
                                    max={16}
                                    step={1}
                                    className="w-full"
                                />
                                <div className="flex justify-between text-xs text-gray-400">
                                    <span>Rapat</span>
                                    <span>Lebar</span>
                                </div>
                            </div>
                        )}

                        {activeTab === 'ratio' && (
                            <div className="flex justify-center gap-3 sm:gap-4">
                                {ratioOptions.map((opt) => {
                                    const Icon = opt.icon;
                                    const isSelected = ratio === opt.value;
                                    return (
                                        <button
                                            key={opt.value}
                                            onClick={() => setRatio(opt.value)}
                                            className={cn(
                                                'flex flex-col items-center gap-2 p-3 sm:p-4 rounded-xl border-2 transition-all min-w-[70px] sm:min-w-[80px]',
                                                isSelected
                                                    ? 'border-red-600 bg-red-50 text-red-600'
                                                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                                            )}
                                        >
                                            <div
                                                className={cn(
                                                    'w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center',
                                                    isSelected ? 'bg-red-600 text-white' : 'bg-gray-100'
                                                )}
                                            >
                                                <Icon className="w-5 h-5" />
                                            </div>
                                            <span className="text-xs font-medium">{opt.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
