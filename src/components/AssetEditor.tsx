import React, { useState } from 'react';
import { Asset, AssetType } from '@/types/dnd';
import { X, Upload, Link, Type, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AssetEditorProps {
    actId: string;
    sceneId: string;
    initialAsset?: Asset;
    onSave: (asset: Asset) => void;
    onClose: () => void;
}

export const AssetEditor = ({ actId, sceneId, initialAsset, onSave, onClose }: AssetEditorProps) => {
    const [type, setType] = useState<AssetType>(initialAsset?.type || 'IMAGE');
    const [label, setLabel] = useState(initialAsset?.label || '');
    const [content, setContent] = useState(initialAsset?.content || ''); // Prompt/Text/Caption
    const [data, setData] = useState(initialAsset?.data || ''); // URL or Blob
    const [uploading, setUploading] = useState(false);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });
            const json = await res.json();
            if (json.success) {
                setData(json.url);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setUploading(false);
        }
    };

    const handleSave = () => {
        const asset: Asset = {
            id: initialAsset?.id || `asset-${Date.now()}`,
            type,
            label,
            content,
            data: type === 'TEXT' ? content : data, // For TEXT assets, content is data
            status: 'ready',
            revealed: false
        };
        onSave(asset);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center p-4 border-b border-border bg-muted/50">
                    <h3 className="font-serif text-xl font-bold text-foreground">
                        {initialAsset ? 'Edit Asset' : 'New Asset'}
                    </h3>
                    <button onClick={onClose} className="p-1 hover:bg-muted rounded-full">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* TYPE SELECTOR */}
                    <div className="flex gap-2">
                        {(['IMAGE', 'TEXT', 'BATTLEMAP', 'CHARACTER', 'LOCATION', 'ITEM'] as AssetType[]).map(t => (
                            <button
                                key={t}
                                onClick={() => setType(t)}
                                className={cn(
                                    "px-3 py-1 rounded-md text-xs font-bold transition-colors border",
                                    type === t
                                        ? "bg-primary text-primary-foreground border-primary"
                                        : "bg-muted text-muted-foreground border-transparent hover:border-border"
                                )}
                            >
                                {t}
                            </button>
                        ))}
                    </div>

                    {/* LABEL INPUT */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold tracking-wider text-muted-foreground">LABEL</label>
                        <input
                            value={label}
                            onChange={e => setLabel(e.target.value)}
                            placeholder="e.g. Ancient Dragon"
                            className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary/50 outline-none"
                        />
                    </div>

                    {/* CONTENT INPUT */}
                    {type === 'TEXT' ? (
                        <div className="space-y-2">
                            <label className="text-xs font-bold tracking-wider text-muted-foreground">NARRATION TEXT</label>
                            <textarea
                                value={content}
                                onChange={e => setContent(e.target.value)}
                                rows={5}
                                placeholder="Enter the narration text to display..."
                                className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary/50 outline-none resize-none"
                            />
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {/* IMAGE PREVIEW */}
                            <div className="aspect-video bg-black/50 rounded-lg border-2 border-dashed border-border flex items-center justify-center overflow-hidden relative group">
                                {data ? (
                                    <img
                                        src={data.startsWith('/assets/uploads/') ? data.replace('/assets/uploads/', '/api/media/') : data}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="text-center text-muted-foreground">
                                        <ImageIcon className="mx-auto mb-2 opacity-50" size={32} />
                                        <span className="text-sm">No Image Selected</span>
                                    </div>
                                )}

                                {uploading && (
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                                    </div>
                                )}
                            </div>

                            {/* UPLOAD / URL TABS */}
                            <div className="grid grid-cols-2 gap-4">
                                <label className="cursor-pointer flex items-center justify-center gap-2 p-3 rounded-lg border border-border hover:bg-muted transition-colors">
                                    <Upload size={18} />
                                    <span className="text-sm font-bold">Upload File</span>
                                    <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                                </label>
                                <div className="flex items-center gap-2 border border-border rounded-lg px-3 focus-within:ring-2 ring-primary/50">
                                    <Link size={18} className="text-muted-foreground" />
                                    <input
                                        type="text"
                                        placeholder="Or paste URL..."
                                        value={data}
                                        onChange={e => setData(e.target.value)}
                                        className="w-full bg-transparent border-none py-3 outline-none text-sm"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-border bg-muted/30 flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground">
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={!label || (!data && !content)}
                        className="px-6 py-2 rounded-lg bg-primary text-primary-foreground font-bold hover:opacity-90 disabled:opacity-50"
                    >
                        Save Asset
                    </button>
                </div>
            </div>
        </div>
    );
};
