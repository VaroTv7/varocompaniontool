import { NextRequest, NextResponse } from 'next/server';
import { getConfig, saveConfig } from '@/lib/config';

export async function GET() {
    const config = getConfig();
    // Start obfuscating the key for security in UI if needed, but for now simple local app.
    // Return masked key to show "Active" status without leaking full key if we wanted.
    return NextResponse.json(config);
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const current = getConfig();
        const newConfig = { ...current, ...body };
        saveConfig(newConfig);
        return NextResponse.json({ success: true });
    } catch (e) {
        return NextResponse.json({ error: "Failed to save config" }, { status: 500 });
    }
}
