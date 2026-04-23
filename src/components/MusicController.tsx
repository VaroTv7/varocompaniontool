'use client';

import React, { useState, useEffect } from 'react';
import { Music, Play, Pause, Volume2, Link2, X } from 'lucide-react';
import { useCampaign } from '@/context/CampaignContext';

export const MusicController = () => {
    const { campaign, updateMusic } = useCampaign();
    const [url, setUrl] = useState(campaign?.musicUrl || '');
    const [volume, setVolume] = useState(campaign?.musicVolume || 70);
    const [isPlaying, setIsPlaying] = useState(campaign?.musicPlaying || false);

    useEffect(() => {
        if (campaign?.musicUrl !== undefined) setUrl(campaign.musicUrl);
        if (campaign?.musicPlaying !== undefined) setIsPlaying(campaign.musicPlaying);
        if (campaign?.musicVolume !== undefined) setVolume(campaign.musicVolume);
    }, [campaign]);

    const handleApply = () => {
        updateMusic(url, true, volume);
    };

    const handleToggle = () => {
        updateMusic(url, !isPlaying, volume);
    };

    const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
        const v = parseInt(e.target.value);
        setVolume(v);
        updateMusic(url, isPlaying, v);
    };

    const handleClear = () => {
        setUrl('');
        updateMusic('', false, volume);
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 h-16 bg-zinc-950/95 border-t border-primary/20 flex items-center px-6 gap-6 backdrop-blur-md z-50">
            <div className="flex items-center gap-3 text-primary font-bold min-w-max">
                <Music size={22} className={isPlaying ? "animate-pulse" : ""} />
                <span className="hidden sm:inline">Banda Sonora</span>
            </div>

            <div className="flex-1 flex items-center gap-2 max-w-3xl">
                <div className="relative flex-1">
                    <Link2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                        type="text"
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg pl-10 pr-10 py-2 text-sm focus:border-primary outline-none text-zinc-200"
                        placeholder="Link de YouTube (Música de fondo)..."
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleApply()}
                    />
                    {url && (
                        <button onClick={handleClear} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white">
                            <X size={16} />
                        </button>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-6">
                <button
                    onClick={handleToggle}
                    className="p-3 bg-primary rounded-full hover:bg-primary/80 transition-all shadow-lg shadow-primary/10 group"
                >
                    {isPlaying ? <Pause size={20} className="fill-black text-black" /> : <Play size={20} className="fill-black text-black ml-1" />}
                </button>

                <div className="flex items-center gap-3 w-32 group">
                    <Volume2 size={18} className="text-muted-foreground group-hover:text-primary transition-colors" />
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={volume}
                        onChange={handleVolume}
                        className="w-full h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                </div>
            </div>
        </div>
    );
};
