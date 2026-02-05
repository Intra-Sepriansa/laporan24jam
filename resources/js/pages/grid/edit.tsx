import { Head, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { ArrowLeft, Grid2X2, Grid3X3, Save, Square, RectangleHorizontal, Smartphone, Plus, Camera } from 'lucide-react';
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

type GridEditProps = SharedData & {
    photos: GridPhoto[];
    layout?: string | null;
    spacing?: number | null;
    ratio?: string | null;
};

type TabType = 'layout' | 'spacing' | 'ratio';

// State for pending photo changes
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

export default function GridEdit() {
    const { photos, layout: savedLayout, spacing: savedSpacing, ratio: savedRatio } = usePage<GridEditProps>().props;

    const [activeTab, setActiveTab] = useState<TabType>('layout');
    const [layout, setLayout] = useState(savedLayout ?? '2x3');
    const [spacing, setSpacing] = useState(savedSpacing ?? 4);
    const [ratio, setRatio] = useState(savedRatio ?? '1:1');
    const [isSaving, setIsSaving] = useState(false);

    // State for pending photo changes (position -> file data)
    const [pendingPhotos, setPendingPhotos] = useState<Map<number, PendingPhoto>>(new Map());
    const fileInputRefs = useRef<Map<number, HTMLInputElement>>(new Map());

    const gridConfig = layoutOptions.find((opt) => opt.value === layout) ?? layoutOptions[1];
    const totalSlots = gridConfig.rows * gridConfig.cols;
    const slotPositions = useMemo(() => Array.from({ length: totalSlots }, (_, i) => i + 1), [totalSlots]);

    const photosByPosition = useMemo(() => {
        const map = new Map<number, GridPhoto>();
        photos.forEach((photo) => map.set(photo.position, photo));
        return map;
    }, [photos]);

    // Calculate aspect ratio for canvas
    const getAspectRatio = () => {
        switch (ratio) {
            case '1:1':
                return 'aspect-square';
            case '4:3':
                return 'aspect-[4/3]';
            case '16:9':
                return 'aspect-video';
            default:
                return 'aspect-square';
        }
    };

    // Handle photo selection for a specific slot
    const handlePhotoSelect = (position: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Create preview URL
        const previewUrl = URL.createObjectURL(file);

        // Update pending photos
        setPendingPhotos(prev => {
            const newMap = new Map(prev);
            // Revoke old preview URL if exists
            const oldPending = newMap.get(position);
            if (oldPending) {
                URL.revokeObjectURL(oldPending.previewUrl);
            }
            newMap.set(position, { file, previewUrl });
            return newMap;
        });
    };

    // Trigger file input for a specific slot
    const triggerFileInput = (position: number) => {
        const input = fileInputRefs.current.get(position);
        if (input) {
            input.click();
        }
    };

    // Check if there are any pending changes
    const hasPendingChanges = pendingPhotos.size > 0 ||
        layout !== (savedLayout ?? '2x3') ||
        spacing !== (savedSpacing ?? 4) ||
        ratio !== (savedRatio ?? '1:1');

    const handleSave = () => {
        setIsSaving(true);
        const formData = new FormData();
        formData.append('layout', layout);
        formData.append('spacing', String(spacing));
        formData.append('ratio', ratio);

        // Add pending photos to form data
        pendingPhotos.forEach((pending, position) => {
            formData.append(`items[${position}][position]`, String(position));
            formData.append(`items[${position}][image]`, pending.file);
        });

        router.post('/grid/batch', formData, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                // Clear pending photos and revoke URLs
                pendingPhotos.forEach((pending) => {
                    URL.revokeObjectURL(pending.previewUrl);
                });
                setPendingPhotos(new Map());
            },
            onFinish: () => setIsSaving(false),
        });
    };

    // Get display image for a slot (pending preview or existing photo)
    const getSlotImage = (position: number): string | null => {
        const pending = pendingPhotos.get(position);
        if (pending) {
            return pending.previewUrl;
        }
        const photo = photosByPosition.get(position);
        return photo?.image_url ?? null;
    };

    return (
        <AppLayout>
            <Head title="Edit Grid Display" />

            <div className="flex flex-col h-[calc(100vh-4rem)] bg-gray-100">
                {/* Top Navigation Bar */}
                <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between px-4 h-14">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => router.visit('/grid')}
                            className="text-gray-600 hover:text-gray-900"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                        <h1 className="text-lg font-semibold text-gray-900">Edit Grid Display</h1>
                        <Button
                            onClick={handleSave}
                            disabled={isSaving || !hasPendingChanges}
                            className="bg-[#0066CC] hover:bg-[#0052A3] text-white font-medium px-4 h-9 rounded-lg disabled:opacity-50"
                        >
                            <Save className="w-4 h-4 mr-1.5" />
                            {isSaving ? 'Menyimpan...' : 'Simpan'}
                        </Button>
                    </div>
                </header>

                {/* Central Canvas Area */}
                <main className="flex-1 overflow-auto p-4 pb-48">
                    <div className="max-w-2xl mx-auto">
                        {/* Instruction text */}
                        <p className="text-center text-sm text-gray-600 mb-3">
                            Tap pada slot untuk memilih atau mengganti foto
                        </p>

                        {/* Canvas Container */}
                        <div className={cn('bg-white rounded-2xl shadow-lg overflow-hidden', getAspectRatio())}>
                            <div
                                className="w-full h-full grid bg-white p-2"
                                style={{
                                    gridTemplateColumns: `repeat(${gridConfig.cols}, 1fr)`,
                                    gap: `${spacing}px`,
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
                                                "relative overflow-hidden rounded-lg bg-gray-100 cursor-pointer group transition-all",
                                                "hover:ring-2 hover:ring-[#0066CC] hover:ring-offset-1",
                                                hasPending && "ring-2 ring-green-500 ring-offset-1"
                                            )}
                                            onClick={() => triggerFileInput(position)}
                                        >
                                            {/* Hidden file input */}
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
                                                        alt={photo?.title ?? `Foto ${position}`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                    {/* Overlay on hover */}
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                        <Camera className="w-8 h-8 text-white" />
                                                    </div>
                                                    {/* Pending indicator */}
                                                    {hasPending && (
                                                        <div className="absolute top-1 right-1 bg-green-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-medium">
                                                            Baru
                                                        </div>
                                                    )}
                                                </>
                                            ) : (
                                                <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 gap-1 group-hover:text-[#0066CC] transition-colors">
                                                    <Plus className="w-6 h-6" />
                                                    <span className="text-xs">Slot {position}</span>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Info Text */}
                        <p className="text-center text-sm text-gray-500 mt-4">
                            Layout: {gridConfig.label} • Spasi: {spacing}px • Rasio: {ratio}
                            {pendingPhotos.size > 0 && (
                                <span className="text-green-600 font-medium"> • {pendingPhotos.size} foto baru</span>
                            )}
                        </p>
                    </div>
                </main>

                {/* Floating Bottom Sheet */}
                <div className="fixed bottom-0 left-0 right-0 z-40">
                    <div className="bg-white rounded-t-3xl shadow-[0_-4px_20px_rgba(0,0,0,0.1)] border-t border-gray-100">
                        {/* Tab Navigation */}
                        <div className="flex border-b border-gray-100">
                            {[
                                { id: 'layout' as TabType, label: 'Tata Letak' },
                                { id: 'spacing' as TabType, label: 'Spasi' },
                                { id: 'ratio' as TabType, label: 'Rasio' },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={cn(
                                        'flex-1 py-3 text-sm font-medium transition-colors relative',
                                        activeTab === tab.id
                                            ? 'text-[#0066CC]'
                                            : 'text-gray-500 hover:text-gray-700',
                                    )}
                                >
                                    {tab.label}
                                    {activeTab === tab.id && (
                                        <span className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-[#0066CC] rounded-full" />
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Tab Content */}
                        <div className="p-4 pb-8">
                            {/* Layout Tab */}
                            {activeTab === 'layout' && (
                                <div className="flex justify-center gap-4">
                                    {layoutOptions.map((opt) => {
                                        const Icon = opt.icon;
                                        const isSelected = layout === opt.value;
                                        return (
                                            <button
                                                key={opt.value}
                                                onClick={() => setLayout(opt.value)}
                                                className={cn(
                                                    'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all min-w-[80px]',
                                                    isSelected
                                                        ? 'border-[#0066CC] bg-blue-50 text-[#0066CC]'
                                                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300',
                                                )}
                                            >
                                                <div
                                                    className={cn(
                                                        'w-10 h-10 rounded-lg flex items-center justify-center',
                                                        isSelected ? 'bg-[#0066CC] text-white' : 'bg-gray-100',
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

                            {/* Spacing Tab */}
                            {activeTab === 'spacing' && (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">Jarak antar foto</span>
                                        <span className="text-sm font-medium text-[#0066CC]">{spacing}px</span>
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
                                        <span>0px</span>
                                        <span>16px</span>
                                    </div>
                                </div>
                            )}

                            {/* Ratio Tab */}
                            {activeTab === 'ratio' && (
                                <div className="flex justify-center gap-4">
                                    {ratioOptions.map((opt) => {
                                        const Icon = opt.icon;
                                        const isSelected = ratio === opt.value;
                                        return (
                                            <button
                                                key={opt.value}
                                                onClick={() => setRatio(opt.value)}
                                                className={cn(
                                                    'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all min-w-[80px]',
                                                    isSelected
                                                        ? 'border-[#0066CC] bg-blue-50 text-[#0066CC]'
                                                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300',
                                                )}
                                            >
                                                <div
                                                    className={cn(
                                                        'w-10 h-10 rounded-lg flex items-center justify-center',
                                                        isSelected ? 'bg-[#0066CC] text-white' : 'bg-gray-100',
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
            </div>
        </AppLayout>
    );
}
