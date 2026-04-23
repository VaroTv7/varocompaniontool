'use client';

import React, { useState, useEffect } from 'react';
import { X, Save, Key } from 'lucide-react';

interface ConfigModalProps {
    onClose: () => void;
}

export const ConfigModal: React.FC<ConfigModalProps> = ({ onClose }) => {
    const [apiKey, setApiKey] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetch('/api/config')
            .then(res => res.json())
            .then(data => {
                if (data.apiKey) setApiKey(data.apiKey);
            });
    }, []);

    const handleSave = async () => {
        setLoading(true);
        try {
            await fetch('/api/config', {
                method: 'POST',
                body: JSON.stringify({ apiKey })
            });
            onClose();
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4">
            <div className="bg-card w-full max-w-md rounded-xl border border-border p-6 shadow-2xl relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-white">
                    <X />
                </button>

                <h2 className="text-xl font-bold font-serif text-primary mb-6 flex items-center gap-2">
                    <Key size={20} /> Configuration
                </h2>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm text-muted-foreground mb-2">Google Gemini API Key</label>
                        <input
                            type="password"
                            className="w-full bg-black/50 border border-border rounded-lg p-3 text-foreground outline-none focus:border-primary"
                            placeholder="AIzaSy..."
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                        />
                        <p className="text-xs text-zinc-500 mt-2">Required for Campaign Analysis, Image Gen, and TTS.</p>
                    </div>
                </div>

                <div className="mt-8 flex justify-end">
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="flex items-center gap-2 px-6 py-2 bg-primary text-black rounded-lg font-bold hover:bg-primary/90"
                    >
                        <Save size={18} /> Save Settings
                    </button>
                </div>
            </div>
        </div>
    );
};
