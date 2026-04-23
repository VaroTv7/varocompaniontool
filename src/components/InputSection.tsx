'use client';

import React, { useState } from 'react';
import { useCampaign } from '@/context/CampaignContext';
import { Loader2, ScrollText } from 'lucide-react';
import { AnalyzeResponse } from '@/types/dnd';

export const InputSection = () => {
    const { setCampaign } = useCampaign();
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);

    const handleAnalyze = async () => {
        if (!text.trim()) return;
        setLoading(true);
        try {
            const res = await fetch('/api/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text }),
            });
            const data: AnalyzeResponse = await res.json();

            // Transform data to include initial status
            const acts = data.acts.map(act => ({
                ...act,
                scenes: act.scenes.map(scene => ({
                    ...scene,
                    assets: scene.assets.map((asset, idx) => ({
                        ...asset,
                        id: asset.id || `asset-${Date.now()}-${idx}`, // Ensure ID
                        status: 'pending' as const,
                        revealed: false
                    }))
                }))
            }));

            setCampaign({ title: "New Campaign", acts });
        } catch (error) {
            console.error("Analysis failed", error);
            alert("Failed to analyze campaign. check console.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-6 bg-card rounded-xl border border-border shadow-2xl">
            <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-primary/20 rounded-full">
                    <ScrollText className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-2xl font-serif text-primary">Campaign Scripture</h2>
            </div>

            <textarea
                className="w-full h-64 bg-black/50 border border-border rounded-lg p-4 text-foreground focus:ring-2 focus:ring-primary outline-none resize-none font-mono text-sm"
                placeholder="Paste your campaign notes here... (Acts, Scenes, Descriptions)"
                value={text}
                onChange={(e) => setText(e.target.value)}
                disabled={loading}
            />

            <div className="flex justify-end mt-4">
                <button
                    onClick={handleAnalyze}
                    disabled={loading || !text}
                    className="flex items-center gap-2 px-8 py-3 bg-primary text-black font-bold rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
                >
                    {loading && <Loader2 className="animate-spin" />}
                    {loading ? 'Consulting the Oracle...' : 'Analyze Campaign'}
                </button>
            </div>
        </div>
    );
};
