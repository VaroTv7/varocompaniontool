'use client';

import React, { useState, useEffect } from 'react';
import { useCampaign } from '@/context/CampaignContext';
import { Book, Check, FolderOpen, Save, Trash2, Pencil, X, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CampaignListProps {
    onClose: () => void;
}

export const CampaignManager: React.FC<CampaignListProps> = ({ onClose }) => {
    const { loadCampaign, saveCampaign, campaign, setCampaign } = useCampaign();
    const [campaigns, setCampaigns] = useState<any[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editTitle, setEditTitle] = useState('');

    const refreshList = () => {
        fetch('/api/campaigns')
            .then(res => res.json())
            .then(setCampaigns);
    };

    useEffect(() => {
        refreshList();
    }, []);

    const handleLoad = async (id: string) => {
        await loadCampaign(id);
        onClose();
    };

    const handleDelete = async (id: string) => {
        if (confirm("¿Estás seguro de que quieres borrar esta campaña?")) {
            await fetch(`/api/campaigns?id=${id}`, { method: 'DELETE' });
            refreshList();
        }
    };

    const handleRenameStart = (c: any) => {
        setEditingId(c.id);
        setEditTitle(c.title);
    };

    const handleRenameSave = async (id: string) => {
        // Load the full JSON first to preserve content
        const res = await fetch(`/api/campaigns/${id}`);
        if (res.ok) {
            const fullData = await res.json();
            fullData.title = editTitle;
            fullData.id = id;

            await fetch('/api/campaigns', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(fullData)
            });

            setEditingId(null);
            refreshList();

            // If current campaign is the one we renamed, update local state
            if (campaign?.id === id) {
                setCampaign({ ...campaign, title: editTitle });
            }
        }
    };

    const handleSaveCurrent = async () => {
        if (campaign) {
            await saveCampaign();
            refreshList();
        }
    };

    return (
        <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-card w-full max-w-2xl rounded-xl border border-border p-6 shadow-2xl relative animate-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center mb-6 border-b border-border pb-4">
                    <h2 className="text-2xl font-serif text-primary flex items-center gap-2">
                        <Book className="text-primary" /> Grimoire Shelf
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors">
                        <Check className="text-primary" />
                    </button>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* LEFT: LIST */}
                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Saved Campaigns</h3>
                        {campaigns.map(c => (
                            <div key={c.id} className="flex items-center justify-between p-3 bg-zinc-900/50 rounded-lg border border-transparent hover:border-primary/20 transition-all group">
                                <div className="flex-1 min-w-0 pr-4">
                                    {editingId === c.id ? (
                                        <div className="flex items-center gap-2">
                                            <input
                                                autoFocus
                                                value={editTitle}
                                                onChange={e => setEditTitle(e.target.value)}
                                                onKeyDown={e => e.key === 'Enter' && handleRenameSave(c.id)}
                                                className="w-full bg-background border border-primary rounded px-2 py-1 text-sm outline-none"
                                            />
                                            <button onClick={() => handleRenameSave(c.id)} className="text-primary hover:text-primary/80"><Check size={16} /></button>
                                            <button onClick={() => setEditingId(null)} className="text-red-500 hover:text-red-400"><X size={16} /></button>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="font-bold text-foreground truncate">{c.title}</div>
                                            <div className="text-[10px] text-muted-foreground uppercase tracking-tight">{c.actsCount} Acts • {c.id}</div>
                                        </>
                                    )}
                                </div>

                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => handleRenameStart(c)} className="p-2 hover:bg-muted rounded-md text-muted-foreground hover:text-white" title="Rename">
                                        <Pencil size={14} />
                                    </button>
                                    <button onClick={() => handleDelete(c.id)} className="p-2 hover:bg-red-500/20 rounded-md text-muted-foreground hover:text-red-500" title="Delete">
                                        <Trash2 size={14} />
                                    </button>
                                    <button onClick={() => handleLoad(c.id)} className="p-2 bg-primary/20 text-primary border border-primary/30 hover:bg-primary hover:text-black rounded-md transition-all shadow-lg shadow-primary/5" title="Load">
                                        <FolderOpen size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}

                        {campaigns.length === 0 && (
                            <div className="text-center py-10 border-2 border-dashed border-border rounded-xl">
                                <p className="text-muted-foreground text-sm italic">The shelf is empty...</p>
                            </div>
                        )}
                    </div>

                    {/* RIGHT: CURRENT ACTIONS */}
                    <div className="md:border-l md:border-border md:pl-8 flex flex-col justify-center space-y-4">
                        {campaign ? (
                            <div className="text-center bg-muted/30 p-6 rounded-xl border border-border">
                                <h4 className="text-xl font-serif text-white mb-2 truncate">{campaign.title}</h4>
                                <p className="text-xs text-muted-foreground mb-6 uppercase tracking-widest font-bold">Active Campaign</p>

                                <button
                                    onClick={handleSaveCurrent}
                                    className="w-full py-4 bg-primary text-black rounded-xl flex items-center justify-center gap-3 hover:bg-primary/90 font-bold transition-all shadow-xl shadow-primary/10 active:scale-95"
                                >
                                    <Save size={20} /> Save Progress
                                </button>
                                <p className="text-[10px] text-muted-foreground mt-4 italic">Saving will update the existing file or create a new one if it's new.</p>
                            </div>
                        ) : (
                            <div className="text-center p-6 border-2 border-dashed border-border rounded-xl">
                                <Plus className="mx-auto mb-4 opacity-20" size={48} />
                                <p className="text-muted-foreground text-sm">No campaign active in your mind.</p>
                                <p className="text-[10px] mt-2 text-muted-foreground/60">Load one from the left or create one in the main view.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
