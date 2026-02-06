import { Head, useForm, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    ClipboardList,
    StickyNote,
    Plus,
    CheckSquare,
    Square,
    AlertTriangle,
    AlertCircle,
    Info,
    Bell,
    ArrowRightLeft,
    Trash2,
    Check,
    X,
    Clock,
    Flame,
    CheckCircle2,
    MessageSquare,
} from 'lucide-react';
import { FormEvent, useState } from 'react';

interface Note {
    id: number;
    shift: number;
    note_date: string;
    type: string;
    title: string;
    content: string;
    priority: string;
    is_resolved: boolean;
    created_by: string;
    created_at: string;
}

interface ChecklistItem {
    name: string;
    checked: boolean;
    [key: string]: string | boolean;
}

interface Checklist {
    id: number;
    shift: number;
    checklist_date: string;
    title: string;
    items: ChecklistItem[];
    completed_count: number;
    total_count: number;
    completion_percentage: number;
    created_by: string;
    created_at: string;
}

interface Template {
    id: number;
    title: string;
    items: ChecklistItem[];
    total_count: number;
}

interface Stats {
    total_notes: number;
    unresolved: number;
    urgent: number;
    today_checklists: number;
}

interface Props {
    notes: Note[];
    checklists: Checklist[];
    templates: Template[];
    stats: Stats;
    filters: {
        type?: string;
        priority?: string;
        is_resolved?: string;
    };
}

const typeConfig: Record<string, { label: string; icon: any; color: string; bg: string }> = {
    general: { label: 'Umum', icon: StickyNote, color: 'text-blue-600', bg: 'bg-blue-100' },
    handover: { label: 'Serah Terima', icon: ArrowRightLeft, color: 'text-purple-600', bg: 'bg-purple-100' },
    incident: { label: 'Kejadian', icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-100' },
    reminder: { label: 'Pengingat', icon: Bell, color: 'text-yellow-600', bg: 'bg-yellow-100' },
};

const priorityConfig: Record<string, { label: string; color: string; bg: string }> = {
    low: { label: 'Rendah', color: 'text-gray-600', bg: 'bg-gray-100' },
    normal: { label: 'Normal', color: 'text-blue-600', bg: 'bg-blue-100' },
    high: { label: 'Tinggi', color: 'text-orange-600', bg: 'bg-orange-100' },
    urgent: { label: 'Urgent', color: 'text-red-600', bg: 'bg-red-100' },
};

export default function Notes({ notes, checklists, templates, stats }: Props) {
    const [activeTab, setActiveTab] = useState<'notes' | 'checklists'>('notes');
    const [showNoteForm, setShowNoteForm] = useState(false);
    const [showChecklistForm, setShowChecklistForm] = useState(false);
    const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([
        { name: '', checked: false },
    ]);

    const noteForm = useForm({
        shift: 3,
        note_date: new Date().toISOString().split('T')[0],
        type: 'general',
        title: '',
        content: '',
        priority: 'normal',
    });

    const checklistForm = useForm({
        shift: 3,
        checklist_date: new Date().toISOString().split('T')[0],
        title: 'Checklist Shift',
        items: [] as ChecklistItem[],
        is_template: false,
    });

    const handleNoteSubmit = (e: FormEvent) => {
        e.preventDefault();
        noteForm.post('/notes', {
            onSuccess: () => {
                setShowNoteForm(false);
                noteForm.reset();
            },
        });
    };

    const handleChecklistSubmit = (e: FormEvent) => {
        e.preventDefault();
        const validItems = checklistItems.filter(item => item.name.trim() !== '');
        if (validItems.length === 0) return;
        router.post('/checklists', {
            shift: checklistForm.data.shift,
            checklist_date: checklistForm.data.checklist_date,
            title: checklistForm.data.title,
            items: validItems as any,
            is_template: checklistForm.data.is_template,
        }, {
            onSuccess: () => {
                setShowChecklistForm(false);
                setChecklistItems([{ name: '', checked: false }]);
                checklistForm.reset();
            },
        });
    };

    const addChecklistItem = () => {
        setChecklistItems([...checklistItems, { name: '', checked: false }]);
    };

    const removeChecklistItem = (index: number) => {
        setChecklistItems(checklistItems.filter((_, i) => i !== index));
    };

    const updateChecklistItem = (index: number, name: string) => {
        const updated = [...checklistItems];
        updated[index].name = name;
        setChecklistItems(updated);
    };

    const toggleChecklistItem = (checklistId: number, items: ChecklistItem[], index: number) => {
        const updated = [...items];
        updated[index].checked = !updated[index].checked;
        router.put(`/checklists/${checklistId}`, { items: updated }, { preserveScroll: true });
    };

    const loadTemplate = (template: Template) => {
        setChecklistItems(template.items.map(item => ({ ...item, checked: false })));
        checklistForm.setData('title', template.title);
        setShowChecklistForm(true);
    };

    return (
        <AppLayout>
            <Head title="Catatan & Checklist" />

            <div className="space-y-6">
                {/* Header */}
                <div className="bg-linear-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-2xl p-5 shadow-xl sm:p-8">
                    <div className="flex items-center gap-3 sm:gap-4">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center sm:w-16 sm:h-16">
                            <ClipboardList className="w-6 h-6 text-white sm:w-8 sm:h-8" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-white sm:text-4xl">Catatan & Checklist</h1>
                            <p className="text-white/80 text-sm sm:text-lg">Kelola catatan shift dan checklist tugas</p>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
                        <div className="flex items-center gap-2 mb-1">
                            <MessageSquare className="w-4 h-4 text-teal-600" />
                            <span className="text-xs font-semibold text-gray-500">Total Catatan</span>
                        </div>
                        <p className="text-2xl font-black text-gray-900">{stats.total_notes}</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
                        <div className="flex items-center gap-2 mb-1">
                            <Clock className="w-4 h-4 text-orange-600" />
                            <span className="text-xs font-semibold text-gray-500">Belum Selesai</span>
                        </div>
                        <p className="text-2xl font-black text-orange-600">{stats.unresolved}</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
                        <div className="flex items-center gap-2 mb-1">
                            <Flame className="w-4 h-4 text-red-600" />
                            <span className="text-xs font-semibold text-gray-500">Urgent</span>
                        </div>
                        <p className="text-2xl font-black text-red-600">{stats.urgent}</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
                        <div className="flex items-center gap-2 mb-1">
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                            <span className="text-xs font-semibold text-gray-500">Checklist Hari Ini</span>
                        </div>
                        <p className="text-2xl font-black text-green-600">{stats.today_checklists}</p>
                    </div>
                </div>

                {/* Tab Switcher */}
                <div className="flex gap-2 bg-gray-100 rounded-xl p-1">
                    <button
                        onClick={() => setActiveTab('notes')}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold transition-all ${
                            activeTab === 'notes'
                                ? 'bg-white text-teal-700 shadow-md'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        <StickyNote className="w-4 h-4" />
                        Catatan
                    </button>
                    <button
                        onClick={() => setActiveTab('checklists')}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold transition-all ${
                            activeTab === 'checklists'
                                ? 'bg-white text-teal-700 shadow-md'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        <ClipboardList className="w-4 h-4" />
                        Checklist
                    </button>
                </div>

                {/* Notes Tab */}
                {activeTab === 'notes' && (
                    <div className="space-y-4">
                        <Button onClick={() => setShowNoteForm(!showNoteForm)} className="bg-teal-600 hover:bg-teal-700 w-full sm:w-auto">
                            <Plus className="w-4 h-4 mr-2" />
                            Tambah Catatan
                        </Button>

                        {showNoteForm && (
                            <Card className="border-2 border-teal-200 shadow-lg">
                                <CardHeader className="bg-teal-50 border-b border-teal-100">
                                    <CardTitle className="text-lg font-bold text-teal-800">Catatan Baru</CardTitle>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    <form onSubmit={handleNoteSubmit} className="space-y-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <Label className="text-xs font-semibold text-gray-600">Judul</Label>
                                                <Input
                                                    value={noteForm.data.title}
                                                    onChange={e => noteForm.setData('title', e.target.value)}
                                                    className="mt-1"
                                                    placeholder="Judul catatan"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <Label className="text-xs font-semibold text-gray-600">Tanggal</Label>
                                                <Input
                                                    type="date"
                                                    value={noteForm.data.note_date}
                                                    onChange={e => noteForm.setData('note_date', e.target.value)}
                                                    className="mt-1"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label className="text-xs font-semibold text-gray-600">Tipe</Label>
                                                <select
                                                    value={noteForm.data.type}
                                                    onChange={e => noteForm.setData('type', e.target.value)}
                                                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                                                >
                                                    <option value="general">Umum</option>
                                                    <option value="handover">Serah Terima</option>
                                                    <option value="incident">Kejadian</option>
                                                    <option value="reminder">Pengingat</option>
                                                </select>
                                            </div>
                                            <div>
                                                <Label className="text-xs font-semibold text-gray-600">Prioritas</Label>
                                                <select
                                                    value={noteForm.data.priority}
                                                    onChange={e => noteForm.setData('priority', e.target.value)}
                                                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                                                >
                                                    <option value="low">Rendah</option>
                                                    <option value="normal">Normal</option>
                                                    <option value="high">Tinggi</option>
                                                    <option value="urgent">Urgent</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div>
                                            <Label className="text-xs font-semibold text-gray-600">Isi Catatan</Label>
                                            <textarea
                                                value={noteForm.data.content}
                                                onChange={e => noteForm.setData('content', e.target.value)}
                                                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm min-h-25"
                                                placeholder="Tulis catatan..."
                                                required
                                            />
                                        </div>
                                        <div className="flex gap-2">
                                            <Button type="submit" disabled={noteForm.processing} className="bg-teal-600 hover:bg-teal-700">
                                                {noteForm.processing ? 'Menyimpan...' : 'Simpan Catatan'}
                                            </Button>
                                            <Button type="button" variant="outline" onClick={() => setShowNoteForm(false)}>Batal</Button>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>
                        )}

                        {/* Notes List */}
                        <div className="space-y-3">
                            {notes.length > 0 ? (
                                notes.map((note) => {
                                    const config = typeConfig[note.type] || typeConfig.general;
                                    const pConfig = priorityConfig[note.priority] || priorityConfig.normal;
                                    const TypeIcon = config.icon;
                                    return (
                                        <Card key={note.id} className={`border-0 shadow-md hover:shadow-lg transition-all ${note.is_resolved ? 'opacity-60' : ''}`}>
                                            <CardContent className="p-4 sm:p-5">
                                                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                                    <div className="flex items-start gap-3 flex-1">
                                                        <div className={`w-10 h-10 ${config.bg} rounded-xl flex items-center justify-center shrink-0`}>
                                                            <TypeIcon className={`w-5 h-5 ${config.color}`} />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-2 flex-wrap mb-1">
                                                                <h3 className={`font-bold text-gray-900 ${note.is_resolved ? 'line-through' : ''}`}>{note.title}</h3>
                                                                <span className={`px-2 py-0.5 text-[10px] font-bold ${config.bg} ${config.color} rounded-full`}>{config.label}</span>
                                                                <span className={`px-2 py-0.5 text-[10px] font-bold ${pConfig.bg} ${pConfig.color} rounded-full`}>{pConfig.label}</span>
                                                                {note.is_resolved && (
                                                                    <span className="px-2 py-0.5 text-[10px] font-bold bg-green-100 text-green-700 rounded-full">Selesai</span>
                                                                )}
                                                            </div>
                                                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{note.content}</p>
                                                            <div className="flex items-center gap-3 mt-2 text-[10px] text-gray-400">
                                                                <span>Shift {note.shift}</span>
                                                                <span>{note.note_date}</span>
                                                                <span>{note.created_by}</span>
                                                                <span>{note.created_at}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-1 shrink-0">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className={note.is_resolved ? 'text-orange-500 border-orange-200' : 'text-green-500 border-green-200'}
                                                            onClick={() => router.patch(`/notes/${note.id}/toggle`, {}, { preserveScroll: true })}
                                                        >
                                                            {note.is_resolved ? <X className="w-3 h-3" /> : <Check className="w-3 h-3" />}
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="text-red-500 border-red-200 hover:bg-red-50"
                                                            onClick={() => {
                                                                if (confirm('Hapus catatan ini?')) {
                                                                    router.delete(`/notes/${note.id}`, { preserveScroll: true });
                                                                }
                                                            }}
                                                        >
                                                            <Trash2 className="w-3 h-3" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    );
                                })
                            ) : (
                                <Card className="border-2 border-dashed border-gray-300">
                                    <CardContent className="p-8 text-center">
                                        <StickyNote className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                        <h3 className="text-xl font-bold text-gray-700 mb-2">Belum Ada Catatan</h3>
                                        <p className="text-gray-500">Tambahkan catatan pertama untuk shift Anda</p>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>
                )}

                {/* Checklists Tab */}
                {activeTab === 'checklists' && (
                    <div className="space-y-4">
                        <div className="flex flex-col gap-2 sm:flex-row">
                            <Button onClick={() => setShowChecklistForm(!showChecklistForm)} className="bg-teal-600 hover:bg-teal-700">
                                <Plus className="w-4 h-4 mr-2" />
                                Buat Checklist
                            </Button>
                            {templates.length > 0 && (
                                <div className="flex gap-2 overflow-x-auto">
                                    {templates.map(t => (
                                        <Button key={t.id} variant="outline" size="sm" onClick={() => loadTemplate(t)} className="whitespace-nowrap">
                                            <ClipboardList className="w-3 h-3 mr-1" />
                                            {t.title}
                                        </Button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {showChecklistForm && (
                            <Card className="border-2 border-teal-200 shadow-lg">
                                <CardHeader className="bg-teal-50 border-b border-teal-100">
                                    <CardTitle className="text-lg font-bold text-teal-800">Checklist Baru</CardTitle>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    <form onSubmit={handleChecklistSubmit} className="space-y-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <Label className="text-xs font-semibold text-gray-600">Judul</Label>
                                                <Input
                                                    value={checklistForm.data.title}
                                                    onChange={e => checklistForm.setData('title', e.target.value)}
                                                    className="mt-1"
                                                    placeholder="Judul checklist"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <Label className="text-xs font-semibold text-gray-600">Tanggal</Label>
                                                <Input
                                                    type="date"
                                                    value={checklistForm.data.checklist_date}
                                                    onChange={e => checklistForm.setData('checklist_date', e.target.value)}
                                                    className="mt-1"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <Label className="text-xs font-semibold text-gray-600 mb-2 block">Item Checklist</Label>
                                            <div className="space-y-2">
                                                {checklistItems.map((item, i) => (
                                                    <div key={i} className="flex items-center gap-2">
                                                        <Input
                                                            value={item.name}
                                                            onChange={e => updateChecklistItem(i, e.target.value)}
                                                            placeholder={`Item ${i + 1}`}
                                                            className="flex-1"
                                                        />
                                                        {checklistItems.length > 1 && (
                                                            <Button type="button" size="sm" variant="ghost" onClick={() => removeChecklistItem(i)} className="text-red-500">
                                                                <X className="w-4 h-4" />
                                                            </Button>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                            <Button type="button" variant="outline" size="sm" onClick={addChecklistItem} className="mt-2">
                                                <Plus className="w-3 h-3 mr-1" /> Tambah Item
                                            </Button>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={checklistForm.data.is_template}
                                                onChange={e => checklistForm.setData('is_template', e.target.checked)}
                                                className="rounded"
                                            />
                                            <span className="text-sm text-gray-600">Simpan sebagai template</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button type="submit" disabled={checklistForm.processing} className="bg-teal-600 hover:bg-teal-700">
                                                {checklistForm.processing ? 'Menyimpan...' : 'Buat Checklist'}
                                            </Button>
                                            <Button type="button" variant="outline" onClick={() => setShowChecklistForm(false)}>Batal</Button>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>
                        )}

                        {/* Checklists List */}
                        <div className="space-y-3">
                            {checklists.length > 0 ? (
                                checklists.map((cl) => (
                                    <Card key={cl.id} className="border-0 shadow-md hover:shadow-lg transition-all">
                                        <CardContent className="p-4 sm:p-5">
                                            <div className="flex items-center justify-between mb-3">
                                                <div>
                                                    <h3 className="font-bold text-gray-900">{cl.title}</h3>
                                                    <div className="flex items-center gap-2 text-[10px] text-gray-400 mt-1">
                                                        <span>Shift {cl.shift}</span>
                                                        <span>{cl.checklist_date}</span>
                                                        <span>{cl.created_by}</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="text-right">
                                                        <p className="text-lg font-black text-teal-600">{cl.completion_percentage}%</p>
                                                        <p className="text-[10px] text-gray-400">{cl.completed_count}/{cl.total_count}</p>
                                                    </div>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="text-red-500 border-red-200 hover:bg-red-50"
                                                        onClick={() => {
                                                            if (confirm('Hapus checklist ini?')) {
                                                                router.delete(`/checklists/${cl.id}`, { preserveScroll: true });
                                                            }
                                                        }}
                                                    >
                                                        <Trash2 className="w-3 h-3" />
                                                    </Button>
                                                </div>
                                            </div>
                                            {/* Progress Bar */}
                                            <div className="w-full bg-gray-100 rounded-full h-2 mb-3">
                                                <div
                                                    className="bg-linear-to-r from-teal-500 to-cyan-500 h-2 rounded-full transition-all duration-500"
                                                    style={{ width: `${cl.completion_percentage}%` }}
                                                />
                                            </div>
                                            {/* Items */}
                                            <div className="space-y-1">
                                                {cl.items.map((item, i) => (
                                                    <button
                                                        key={i}
                                                        onClick={() => toggleChecklistItem(cl.id, cl.items, i)}
                                                        className={`w-full flex items-center gap-2 p-2 rounded-lg text-left text-sm transition-all hover:bg-gray-50 ${
                                                            item.checked ? 'text-gray-400 line-through' : 'text-gray-700'
                                                        }`}
                                                    >
                                                        {item.checked ? (
                                                            <CheckSquare className="w-4 h-4 text-teal-500 shrink-0" />
                                                        ) : (
                                                            <Square className="w-4 h-4 text-gray-300 shrink-0" />
                                                        )}
                                                        {item.name}
                                                    </button>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            ) : (
                                <Card className="border-2 border-dashed border-gray-300">
                                    <CardContent className="p-8 text-center">
                                        <ClipboardList className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                        <h3 className="text-xl font-bold text-gray-700 mb-2">Belum Ada Checklist</h3>
                                        <p className="text-gray-500">Buat checklist pertama untuk shift Anda</p>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
