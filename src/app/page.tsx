'use client';

import React, { useState, useEffect } from 'react';
import { CampaignProvider, useCampaign } from '@/context/CampaignContext';
import { TarotCard } from '@/components/TarotCard';
import { MusicController } from '@/components/MusicController';
import { YoutubePlayer } from '@/components/YoutubePlayer';
import { ConfigModal } from '@/components/ConfigModal';
import { CampaignManager } from '@/components/CampaignManager';
import { AssetEditor } from '@/components/AssetEditor';
import { Asset } from '@/types/dnd';
import { Monitor, Shield, Swords, Settings, BookOpen, Plus, Trash, Layout, Pencil } from 'lucide-react';
import { cn } from '@/lib/utils';

// Helper to make any title editable
const EditableTitle = ({
  initialTitle,
  onSave,
  className,
  tag: Tag = 'h2'
}: {
  initialTitle: string,
  onSave: (t: string) => void,
  className?: string,
  tag?: any
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(initialTitle);

  useEffect(() => { setTitle(initialTitle); }, [initialTitle]);

  if (isEditing) {
    return (
      <input
        autoFocus
        value={title}
        onChange={e => setTitle(e.target.value)}
        onBlur={() => { setIsEditing(false); onSave(title); }}
        onKeyDown={e => e.key === 'Enter' && (e.currentTarget.blur())}
        className={cn("bg-background border border-primary rounded px-2 outline-none h-fit max-w-full", className)}
      />
    );
  }

  return (
    <Tag
      onClick={() => setIsEditing(true)}
      className={cn("cursor-pointer hover:text-primary transition-colors flex items-center gap-2 group", className)}
    >
      <span className="truncate">{title}</span>
      <Pencil size={14} className="opacity-0 group-hover:opacity-50 flex-shrink-0" />
    </Tag>
  );
};

const DashboardContent = () => {
  const {
    campaign, mode, toggleMode, activeAsset,
    addAct, addScene, addAsset, updateAsset,
    updateCampaignTitle, updateActTitle, updateSceneTitle
  } = useCampaign();

  const [showConfig, setShowConfig] = useState(false);
  const [showCampaigns, setShowCampaigns] = useState(false);

  const [editorState, setEditorState] = useState<{
    open: boolean;
    actId: string;
    sceneId: string;
    asset?: Asset;
  }>({ open: false, actId: '', sceneId: '' });

  const isPlayerMode = mode === 'PLAYER';

  const handleEditAsset = (actId: string, sceneId: string, asset: Asset) => {
    setEditorState({ open: true, actId, sceneId, asset });
  };

  const onSaveAsset = (asset: Asset) => {
    if (editorState.asset) {
      updateAsset(editorState.actId, editorState.sceneId, asset);
    } else {
      addAsset(editorState.actId, editorState.sceneId, asset);
    }
    setEditorState({ ...editorState, open: false });
  };

  return (
    <main className={cn("min-h-screen pb-32 transition-colors duration-500", isPlayerMode ? 'bg-black' : 'bg-background')}>

      {/* HEADER (DM ONLY) */}
      {!isPlayerMode && (
        <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6 sticky top-0 z-40 shadow-md">
          <div className="flex items-center gap-4 group">
            <h1 className="text-xl font-bold font-serif text-primary tracking-widest hidden md:block border-r border-border pr-4 mr-2">D&D IMMERSIVE</h1>
            {campaign && (
              <EditableTitle
                initialTitle={campaign.title}
                onSave={updateCampaignTitle}
                className="text-lg font-bold text-foreground/80 max-w-[200px] md:max-w-md"
                tag="span"
              />
            )}
          </div>

          <div className="flex items-center gap-2">
            <button onClick={() => setShowCampaigns(true)} className="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground" title="Campaigns">
              <BookOpen size={20} />
            </button>
            <button onClick={() => setShowConfig(true)} className="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground" title="Settings">
              <Settings size={20} />
            </button>
            <div className="h-6 w-px bg-border mx-2" />
            <button
              onClick={toggleMode}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-black font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/10"
            >
              <Monitor size={18} /> <span className="hidden sm:inline">Player View</span>
            </button>
          </div>
        </header>
      )}

      {/* MODALS */}
      {showConfig && <ConfigModal onClose={() => setShowConfig(false)} />}
      {showCampaigns && <CampaignManager onClose={() => setShowCampaigns(false)} />}

      {editorState.open && (
        <AssetEditor
          actId={editorState.actId}
          sceneId={editorState.sceneId}
          initialAsset={editorState.asset}
          onSave={onSaveAsset}
          onClose={() => setEditorState({ ...editorState, open: false })}
        />
      )}

      {/* CONTENT AREA */}
      <div className="p-6">
        {!campaign && !isPlayerMode && (
          <div className="flex flex-col items-center justify-center mt-20 gap-6">
            <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
              <Layout size={48} />
            </div>
            <h2 className="text-2xl font-serif text-muted-foreground">No Campaign Active</h2>
            <button
              onClick={() => addAct("Act I: The Beginning")}
              className="px-8 py-3 bg-primary text-black font-bold rounded-full hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
            >
              Create New Campaign
            </button>
          </div>
        )}

        {campaign && (
          <div className="space-y-12 max-w-7xl mx-auto">
            {campaign.acts.map((act) => (
              <section key={act.id} className="space-y-6">
                {!isPlayerMode && (
                  <div className="flex items-center gap-4 group">
                    <div className="h-px flex-1 bg-border" />
                    <EditableTitle
                      initialTitle={act.title}
                      onSave={(t) => updateActTitle(act.id, t)}
                      className="text-2xl font-serif text-foreground/80"
                    />
                    <button
                      onClick={() => addScene(act.id, "New Scene")}
                      className="p-1 rounded-full bg-muted text-muted-foreground hover:bg-primary hover:text-black transition-colors opacity-0 group-hover:opacity-100"
                      title="Add Scene"
                    >
                      <Plus size={16} />
                    </button>
                    <div className="h-px flex-1 bg-border" />
                  </div>
                )}

                {act.scenes.map(scene => (
                  <div key={scene.id} className="space-y-4">
                    {!isPlayerMode && (
                      <EditableTitle
                        initialTitle={scene.title}
                        onSave={(t) => updateSceneTitle(act.id, scene.id, t)}
                        className="text-sm font-bold text-muted-foreground uppercase tracking-wider pl-1 border-l-2 border-primary/30"
                        tag="h3"
                      />
                    )}

                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                      {scene.assets.map(asset => (
                        <TarotCard
                          key={asset.id}
                          asset={asset}
                          actId={act.id}
                          sceneId={scene.id}
                          onEdit={() => handleEditAsset(act.id, scene.id, asset)}
                        />
                      ))}
                      {!isPlayerMode && (
                        <button
                          onClick={() => setEditorState({ open: true, actId: act.id, sceneId: scene.id })}
                          className="aspect-[2/3] rounded-lg border-2 border-dashed border-muted hover:border-primary hover:bg-muted/10 flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-primary transition-all group"
                        >
                          <div className="p-3 rounded-full bg-muted group-hover:bg-primary/20 transition-colors">
                            <Plus size={24} />
                          </div>
                          <span className="text-xs font-bold">Add Asset</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </section>
            ))}
            {!isPlayerMode && (
              <button
                onClick={() => addAct("New Act")}
                className="w-full py-4 border-2 border-dashed border-border rounded-xl text-muted-foreground hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2 font-serif text-lg"
              >
                <Plus size={20} /> Add Act
              </button>
            )}
          </div>
        )}

        {isPlayerMode && (
          <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center animate-in fade-in duration-1000 overflow-hidden w-screen h-screen m-0 p-0 border-none">
            <YoutubePlayer />
            {activeAsset ? (
              <div className="w-full h-full flex items-center justify-center relative bg-black overflow-hidden">
                {activeAsset.type === 'NARRATION' || activeAsset.type === 'TEXT' ? (
                  <div className="p-12 md:p-24 w-full h-full flex items-center justify-center overflow-hidden">
                    <p className="text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-serif italic text-primary/95 leading-tight drop-shadow-[0_10px_30px_rgba(0,0,0,1)] text-pretty text-center max-w-7xl animate-in slide-in-from-bottom-10 duration-1000">
                      "{activeAsset.content}"
                    </p>
                  </div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-black overflow-hidden">
                    <img
                      src={activeAsset.data || activeAsset.content}
                      alt="Projected"
                      className="w-full h-full object-contain pointer-events-none select-none flex-shrink-0"
                      style={{ maxWidth: '100vw', maxHeight: '100vh', width: '100vw', height: '100vh' }}
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center opacity-10 animate-pulse">
                <div className="w-48 h-48 rounded-full border-8 border-primary/20 mx-auto mb-8 flex items-center justify-center">
                  <div className="w-32 h-32 rounded-full border-4 border-primary/30" />
                </div>
              </div>
            )}

            <button
              onClick={toggleMode}
              className="fixed bottom-10 left-1/2 -translate-x-1/2 px-10 py-4 bg-zinc-900/90 backdrop-blur-xl text-white font-bold rounded-full border border-white/10 hover:border-primary/50 hover:text-primary shadow-2xl transition-all duration-300 z-[110] flex items-center gap-3 group opacity-0 hover:opacity-100 focus:opacity-100 focus-within:opacity-100"
            >
              <Shield className="group-hover:scale-110 transition-transform" />
              <span className="tracking-[0.2em] text-xs uppercase">Return to DM Dashboard</span>
            </button>
          </div>
        )}
      </div>

      {!isPlayerMode && <MusicController />}
    </main>
  );
};

export default function Home() {
  return (
    <CampaignProvider>
      <DashboardContent />
    </CampaignProvider>
  );
}
