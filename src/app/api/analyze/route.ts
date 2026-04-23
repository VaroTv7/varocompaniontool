import { NextRequest, NextResponse } from 'next/server';
import { analyzeCampaign } from '@/lib/ai';

export async function POST(req: NextRequest) {
    try {
        const { text } = await req.json();
        if (!text) {
            return NextResponse.json({ error: "Text is required" }, { status: 400 });
        }

        const data = await analyzeCampaign(text);
        return NextResponse.json(data);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to analyze campaign" }, { status: 500 });
    }
}
