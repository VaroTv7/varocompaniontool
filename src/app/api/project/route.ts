import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Store state in the persistent assets volume so it works across restarts/rebuilds if needed
// and acts as a simple database.
const DB_PATH = path.join(process.cwd(), 'public', 'assets', 'live.json');

// Ensure directory exists
try {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
} catch (e) {
    console.error("Init Error", e);
}

export async function GET() {
    try {
        if (!fs.existsSync(DB_PATH)) {
            return NextResponse.json({ active: null });
        }
        const data = fs.readFileSync(DB_PATH, 'utf-8');
        return NextResponse.json(JSON.parse(data));
    } catch (error) {
        return NextResponse.json({ active: null });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        // body expected: { active: Asset | null }

        fs.writeFileSync(DB_PATH, JSON.stringify(body), 'utf-8');

        return NextResponse.json({ success: true, body });
    } catch (error) {
        console.error("Project Error", error);
        return NextResponse.json({ error: "Failed to update state" }, { status: 500 });
    }
}
