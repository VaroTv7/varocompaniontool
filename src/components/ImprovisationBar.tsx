'use client';

import React, { useState, useRef } from 'react';
import { Mic, Play, Square, Loader2 } from 'lucide-react';

export const ImprovisationBar = () => {
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [playing, setPlaying] = useState(false);

    const handleSpeak = async () => {
        if (!text.trim()) return;
        setLoading(true);
        try {
            const res = await fetch('/api/generate/speech', {
                method: 'POST',
                body: JSON.stringify({ text, voice: 'Fenrir' }) // Default monster voice?
            });
            const data = await res.json();
            if (data.audio) {
                const audioSrc = `data:audio/mp3;base64,${data.audio}`;
                if (audioRef.current) {
                    audioRef.current.src = audioSrc;
                    audioRef.current.play();
                    setPlaying(true);
                }
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 h-16 bg-black/90 border-t border-primary/30 flex items-center px-6 gap-4 backdrop-blur-md z-50">
            <div className="flex items-center gap-2 text-primary font-bold whitespace-nowrap">
                <Mic size={20} />
                <span>DM Voice</span>
            </div>

            <input
                type="text"
                className="flex-1 bg-zinc-900 border border-zinc-700 rounded-full px-4 py-2 text-sm focus:border-primary outline-none"
                placeholder="Type what the monster says..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSpeak()}
            />

            <button
                onClick={handleSpeak}
                disabled={loading || !text}
                className="p-2 bg-primary rounded-full hover:bg-primary/80 disabled:opacity-50"
            >
                {loading ? <Loader2 className="animate-spin text-black" /> : <Play className="fill-black text-black ml-1" />}
            </button>

            <audio
                ref={audioRef}
                className="hidden"
                onEnded={() => setPlaying(false)}
                onPlay={() => setPlaying(true)}
            />
        </div>
    );
};
