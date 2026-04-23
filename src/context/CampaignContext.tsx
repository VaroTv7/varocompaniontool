'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Campaign, Asset, Act, Scene } from '@/types/dnd';

interface CampaignContextType {
    campaign: Campaign | null;
    setCampaign: (c: Campaign) => void;
    mode: 'DM' | 'PLAYER';
    toggleMode: () => void;
    activeAsset: Asset | null;
    setActiveAsset: (a: Asset | null) => void;
    updateAssetStatus: (actId: string, sceneId: string, assetId: string, status: Asset['status'], data?: string) => void;
    saveCampaign: (title?: string) => Promise<void>;
    loadCampaign: (id: string) => Promise<void>;
    addAct: (title: string) => void;
    addScene: (actId: string, title: string) => void;
    addAsset: (actId: string, sceneId: string, asset: Asset) => void;
    deleteAsset: (actId: string, sceneId: string, assetId: string) => void;
    updateAsset: (actId: string, sceneId: string, asset: Asset) => void;
    updateCampaignTitle: (title: string) => void;
    updateActTitle: (actId: string, title: string) => void;
    updateSceneTitle: (actId: string, sceneId: string, title: string) => void;
    updateMusic: (url: string, playing: boolean, volume?: number) => void;
}

const CampaignContext = createContext<CampaignContextType | undefined>(undefined);

export const CampaignProvider = ({ children }: { children: ReactNode }) => {
    const [campaign, setCampaign] = useState<Campaign | null>(null);
    const [mode, setMode] = useState<'DM' | 'PLAYER'>('DM');
    const [activeAsset, setActiveAsset] = useState<Asset | null>(null);

    const toggleMode = () => setMode((prev) => (prev === 'DM' ? 'PLAYER' : 'DM'));

    const updateAssetStatus = (actId: string, sceneId: string, assetId: string, status: Asset['status'], data?: string) => {
        setCampaign((prev) => {
            if (!prev) return null;
            const newActs = prev.acts.map(act => {
                if (act.id !== actId) return act;
                const newScenes = act.scenes.map(scene => {
                    if (scene.id !== sceneId) return scene;
                    const newAssets = scene.assets.map(asset => {
                        if (asset.id !== assetId) return asset;
                        return { ...asset, status, data: data || asset.data };
                    });
                    return { ...scene, assets: newAssets };
                });
                return { ...act, scenes: newScenes };
            });
            return { ...prev, acts: newActs };
        });
    };

    // POLLING LOGIC FOR PLAYER MODE
    React.useEffect(() => {
        if (mode === 'DM') return;

        const interval = setInterval(async () => {
            try {
                const res = await fetch('/api/project');
                const data = await res.json();
                setActiveAsset(prev => {
                    if (data.active?.id !== prev?.id) return data.active;
                    return prev;
                });
                // Sync music state
                if (data.musicUrl !== undefined) {
                    setCampaign(prev => {
                        if (!prev) {
                            return { title: 'Remote Session', acts: [], musicUrl: data.musicUrl, musicPlaying: data.musicPlaying, musicVolume: data.musicVolume };
                        }
                        if (prev.musicUrl !== data.musicUrl || prev.musicPlaying !== data.musicPlaying || prev.musicVolume !== data.musicVolume) {
                            return { ...prev, musicUrl: data.musicUrl, musicPlaying: data.musicPlaying, musicVolume: data.musicVolume };
                        }
                        return prev;
                    });
                }
            } catch (e) {
                console.error("Sync error", e);
            }
        }, 2000);

        return () => clearInterval(interval);
    }, [mode]);

    // WRAPPER FOR DM ACTIONS
    const projectAsset = async (asset: Asset | null) => {
        setActiveAsset(asset);
        try {
            await fetch('/api/project', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    active: asset,
                    musicUrl: campaign?.musicUrl,
                    musicPlaying: campaign?.musicPlaying,
                    musicVolume: campaign?.musicVolume
                })
            });
        } catch (e) {
            console.error("Broadcast failed", e);
        }
    };


    // SAVE LOGIC
    const saveCampaign = async (title?: string) => {
        if (!campaign) return;
        try {
            const payload = { ...campaign, title: title || campaign.title };
            const res = await fetch('/api/campaigns', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (data.success) {
                // Update local campaign with the ID if it was newly created
                if (!campaign.id) {
                    setCampaign(prev => prev ? { ...prev, id: data.id } : null);
                }
            }
        } catch (e) {
            console.error("Save failed", e);
        }
    };

    // LOAD LOGIC
    const loadCampaign = async (id: string) => {
        try {
            const res = await fetch(`/api/campaigns/${id}`);
            if (res.ok) {
                const data = await res.json();
                // Ensure the loaded data has the ID
                setCampaign({ ...data, id });
            }
        } catch (e) {
            console.error("Load failed", e);
        }
    };

    // --- MANUAL MANAGEMENT ACTIONS ---

    const addAct = (title: string) => {
        setCampaign(prev => {
            const newAct: Act = { id: `act-${Date.now()}`, title, scenes: [] };
            if (!prev) return { title: 'New Campaign', acts: [newAct] }; // New campaign
            return { ...prev, acts: [...prev.acts, newAct] };
        });
    };

    const addScene = (actId: string, title: string) => {
        setCampaign(prev => {
            if (!prev) return null;
            return {
                ...prev,
                acts: prev.acts.map(act => act.id === actId ? {
                    ...act,
                    scenes: [...act.scenes, { id: `scene-${Date.now()}`, title, assets: [] }]
                } : act)
            };
        });
    };

    const addAsset = (actId: string, sceneId: string, asset: Asset) => {
        setCampaign(prev => {
            if (!prev) return null;
            return {
                ...prev,
                acts: prev.acts.map(act => act.id === actId ? {
                    ...act,
                    scenes: act.scenes.map(scene => scene.id === sceneId ? {
                        ...scene,
                        assets: [...scene.assets, asset]
                    } : scene)
                } : act)
            };
        });
    };

    const deleteAsset = (actId: string, sceneId: string, assetId: string) => {
        setCampaign(prev => {
            if (!prev) return null;
            return {
                ...prev,
                acts: prev.acts.map(act => act.id === actId ? {
                    ...act,
                    scenes: act.scenes.map(scene => scene.id === sceneId ? {
                        ...scene,
                        assets: scene.assets.filter(a => a.id !== assetId)
                    } : scene)
                } : act)
            };
        });
    };

    const updateAsset = (actId: string, sceneId: string, asset: Asset) => {
        setCampaign(prev => {
            if (!prev) return null;
            return {
                ...prev,
                acts: prev.acts.map(act => act.id === actId ? {
                    ...act,
                    scenes: act.scenes.map(scene => scene.id === sceneId ? {
                        ...scene,
                        assets: scene.assets.map(a => a.id === asset.id ? asset : a)
                    } : scene)
                } : act)
            };
        });
    };

    const updateCampaignTitle = (title: string) => {
        setCampaign(prev => prev ? { ...prev, title } : null);
    };

    const updateActTitle = (actId: string, title: string) => {
        setCampaign(prev => {
            if (!prev) return null;
            return {
                ...prev,
                acts: prev.acts.map(act => act.id === actId ? { ...act, title } : act)
            };
        });
    };

    const updateSceneTitle = (actId: string, sceneId: string, title: string) => {
        setCampaign(prev => {
            if (!prev) return null;
            return {
                ...prev,
                acts: prev.acts.map(act => act.id === actId ? {
                    ...act,
                    scenes: act.scenes.map(scene => scene.id === sceneId ? { ...scene, title } : scene)
                } : act)
            };
        });
    };

    const updateMusic = (url: string, playing: boolean, volume: number = 70) => {
        setCampaign(prev => {
            if (!prev) return null;
            const updated = { ...prev, musicUrl: url, musicPlaying: playing, musicVolume: volume };
            // Broadcast the new music state immediately
            fetch('/api/project', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    active: activeAsset,
                    musicUrl: updated.musicUrl,
                    musicPlaying: updated.musicPlaying,
                    musicVolume: updated.musicVolume
                })
            }).catch(e => console.error("Sync music failed", e));
            return updated;
        });
    };

    return (
        <CampaignContext.Provider value={{
            campaign, setCampaign, mode, toggleMode, activeAsset, setActiveAsset: projectAsset, updateAssetStatus, saveCampaign, loadCampaign,
            addAct, addScene, addAsset, deleteAsset, updateAsset,
            updateCampaignTitle, updateActTitle, updateSceneTitle,
            updateMusic
        }}>
            {children}
        </CampaignContext.Provider>
    );
};

export const useCampaign = () => {
    const context = useContext(CampaignContext);
    if (!context) throw new Error('useCampaign must be used within a CampaignProvider');
    return context;
};
