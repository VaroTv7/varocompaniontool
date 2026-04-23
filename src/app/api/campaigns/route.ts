import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const CAMPAIGNS_DIR = path.join(process.cwd(), 'public', 'assets', 'campaigns');

if (!fs.existsSync(CAMPAIGNS_DIR)) {
    try {
        fs.mkdirSync(CAMPAIGNS_DIR, { recursive: true });
    } catch (e) { }
}

export async function GET() {
    try {
        if (!fs.existsSync(CAMPAIGNS_DIR)) return NextResponse.json([]);

        const files = fs.readdirSync(CAMPAIGNS_DIR).filter(f => f.endsWith('.json'));
        const campaigns = files.map(f => {
            const data = fs.readFileSync(path.join(CAMPAIGNS_DIR, f), 'utf-8');
            try {
                const json = JSON.parse(data);
                return { id: f.replace('.json', ''), title: json.title || 'Untitled', actsCount: json.acts?.length || 0 };
            } catch (e) { return null; }
        }).filter(Boolean);

        return NextResponse.json(campaigns);
    } catch (error) {
        return NextResponse.json({ error: "Failed to list campaigns" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const id = body.id || `campaign-${Date.now()}`;
        const filePath = path.join(CAMPAIGNS_DIR, `${id}.json`);

        fs.writeFileSync(filePath, JSON.stringify(body, null, 2), 'utf-8');
        return NextResponse.json({ success: true, id });
    } catch (error) {
        return NextResponse.json({ error: "Failed to save campaign" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');
        if (!id) return NextResponse.json({ error: "No ID provided" }, { status: 400 });

        const filePath = path.join(CAMPAIGNS_DIR, `${id}.json`);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete campaign" }, { status: 500 });
    }
}
