import { NextRequest, NextResponse } from 'next/server';
import { generateTTS } from '@/lib/ai';

export async function POST(req: NextRequest) {
    try {
        const { text, voice } = await req.json();
        if (!text) return NextResponse.json({ error: "Text required" }, { status: 400 });

        const audioBuffer = await generateTTS(text, voice);

        // Convert ArrayBuffer to Base64
        const base64Audio = Buffer.from(audioBuffer).toString('base64');

        return NextResponse.json({ audio: base64Audio });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to generate speech" }, { status: 500 });
    }
}
