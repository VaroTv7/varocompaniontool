'use client';

import React from 'react';
import { Asset } from '@/types/dnd';
import { useCampaign } from '@/context/CampaignContext';
import { Eye, EyeOff, Cast, Pencil, Trash } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface TarotCardProps {
    asset: Asset;
    actId: string;
    sceneId: string;
}

export const TarotCard: React.FC<TarotCardProps & { onEdit: () => void }> = ({ asset, actId, sceneId, onEdit }) => {
    const { mode, activeAsset, setActiveAsset, deleteAsset } = useCampaign();

    const isHidden = mode === 'PLAYER' && !asset.revealed;
    const isActive = activeAsset?.id === asset.id;

    const assetUrl = asset.data || asset.content;
    const isLocalUpload = assetUrl?.startsWith('/assets/uploads/');
    const displayUrl = isLocalUpload
        ? assetUrl.replace('/assets/uploads/', '/api/media/')
        : assetUrl;

    return (
        <div className={cn(
            "relative w-full aspect-[2/3] rounded-lg border-2 border-border bg-card overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 group",
        )}>

            {/* CARD BACK (Hidden State) */}
            {(asset.status === 'pending' || isHidden) && (
                <div className="absolute inset-0 bg-[url('/patterns/tarot-back.png')] bg-cover bg-center opacity-80 flex items-center justify-center">
                    <div className="bg-background/80 p-4 rounded-full border border-primary/50">
                        {asset.type === 'NARRATION' ? <span className="text-2xl">🔊</span> :
                            asset.type === 'TEXT' ? <span className="text-2xl">📜</span> :
                                <span className="text-2xl">👁️</span>}
                    </div>
                </div>
            )}

            {/* CARD FRONT (Content) */}
            {asset.status === 'ready' && !isHidden && (
                <div className="absolute inset-0 flex flex-col">
                    {asset.type === 'NARRATION' || asset.type === 'TEXT' ? (
                        <div className="flex-1 flex items-center justify-center bg-zinc-900 p-4 text-center text-sm italic text-muted-foreground whitespace-pre-wrap">
                            "{asset.content.substring(0, 150)}{asset.content.length > 150 && '...'}"
                        </div>
                    ) : (
                        <div className="relative w-full h-full">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={displayUrl} alt={asset.label} className="object-cover w-full h-full" />
                        </div>
                    )}
                </div>
            )}

            {/* OVERLAY / ACTIONS (DM ONLY) */}
            {mode === 'DM' && (
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-4">
                    <h4 className="text-primary font-bold text-center mb-2">{asset.label}</h4>

                    <div className="flex gap-2 mb-4">
                        <button
                            onClick={() => setActiveAsset(isActive ? null : asset)}
                            className={cn(
                                "p-2 rounded-full transition-colors border",
                                isActive ? "bg-red-500/20 text-red-500 border-red-500" : "bg-primary/20 text-primary border-primary hover:bg-primary/40"
                            )}
                            title="Project to TV"
                        >
                            <Cast size={20} />
                        </button>
                    </div>

                    <div className="flex gap-2 absolute bottom-4">
                        <button
                            onClick={onEdit}
                            className="p-2 hover:bg-muted rounded-full text-muted-foreground hover:text-white transition-colors"
                            title="Edit"
                        >
                            <Pencil size={16} />
                        </button>
                        <button
                            onClick={() => deleteAsset(actId, sceneId, asset.id)}
                            className="p-2 hover:bg-red-500/20 rounded-full text-muted-foreground hover:text-red-500 transition-colors"
                            title="Delete"
                        >
                            <Trash size={16} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

