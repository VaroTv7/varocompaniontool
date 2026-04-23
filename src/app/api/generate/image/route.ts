import { NextRequest, NextResponse } from 'next/server';
import { generateImage } from '@/lib/ai';

export async function POST(req: NextRequest) {
    try {
        const { prompt } = await req.json();
        if (!prompt) {
            return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
        }

        // TODO: Implement real image gen
        const base64Image = await generateImage(prompt);

        return NextResponse.json({ image: base64Image });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to generate image" }, { status: 500 });
    }
}
