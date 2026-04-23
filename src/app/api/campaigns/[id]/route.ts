import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const CAMPAIGNS_DIR = path.join(process.cwd(), 'public', 'assets', 'campaigns');

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        const filePath = path.join(CAMPAIGNS_DIR, `${id}.json`);
        if (!fs.existsSync(filePath)) return NextResponse.json({ error: "Not Found" }, { status: 404 });

        const data = fs.readFileSync(filePath, 'utf-8');
        return NextResponse.json(JSON.parse(data));
    } catch (error) {
        return NextResponse.json({ error: "Failed to load" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        const filePath = path.join(CAMPAIGNS_DIR, `${id}.json`);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
    }
}
