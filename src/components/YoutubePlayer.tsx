'use client';

import React, { useEffect, useRef } from 'react';
import { useCampaign } from '@/context/CampaignContext';

export const YoutubePlayer = () => {
    const { campaign } = useCampaign();
    const iframeRef = useRef<HTMLIFrameElement>(null);

    const getYoutubeId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const videoId = campaign?.musicUrl ? getYoutubeId(campaign.musicUrl) : null;
    const isPlaying = campaign?.musicPlaying;
    const volume = campaign?.musicVolume ?? 70;

    useEffect(() => {
        if (!iframeRef.current || !videoId) return;

        // Post message to YouTube IFrame API to control volume and play/pause
        const iframe = iframeRef.current.contentWindow;
        if (iframe) {
            iframe.postMessage(JSON.stringify({
                event: 'command',
                func: isPlaying ? 'playVideo' : 'pauseVideo',
                args: []
            }), '*');

            iframe.postMessage(JSON.stringify({
                event: 'command',
                func: 'setVolume',
                args: [volume]
            }), '*');
        }
    }, [isPlaying, volume, videoId]);

    if (!videoId) return null;

    return (
        <div className="fixed -top-full -left-full pointer-events-none opacity-0">
            <iframe
                ref={iframeRef}
                src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1&autoplay=1&mute=0&controls=0&loop=1&playlist=${videoId}`}
                allow="autoplay; encrypted-media"
                className="w-0 h-0"
            />
        </div>
    );
};
