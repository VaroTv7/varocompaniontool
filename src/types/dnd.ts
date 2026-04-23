export type AssetType = 'LOCATION' | 'BATTLEMAP' | 'CHARACTER' | 'ITEM' | 'NARRATION' | 'IMAGE' | 'TEXT';

export interface Asset {
    id: string;
    type: AssetType;
    label: string;
    content: string; // Prompt for images, Text for narration
    status: 'pending' | 'generating' | 'ready' | 'error';
    revealed: boolean;
    data?: string; // Base64 url or text
}

export interface Scene {
    id: string;
    title: string;
    assets: Asset[];
}

export interface Act {
    id: string;
    title: string;
    scenes: Scene[];
}

export interface Campaign {
    id?: string;
    title: string;
    acts: Act[];
    musicUrl?: string;
    musicPlaying?: boolean;
    musicVolume?: number;
}

export interface AnalyzeResponse {
    acts: Act[];
}
