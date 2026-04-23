import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    const { path: pathSegments } = await params;
    const filePath = path.join(process.cwd(), "public", "assets", "uploads", ...pathSegments);

    if (!fs.existsSync(filePath)) {
        return new NextResponse("Not Found", { status: 404 });
    }

    const fileBuffer = fs.readFileSync(filePath);
    const extension = path.extname(filePath).toLowerCase();

    let contentType = "application/octet-stream";
    if (extension === ".png") contentType = "image/png";
    if (extension === ".jpg" || extension === ".jpeg") contentType = "image/jpeg";
    if (extension === ".webp") contentType = "image/webp";
    if (extension === ".gif") contentType = "image/gif";

    return new NextResponse(fileBuffer, {
        headers: {
            "Content-Type": contentType,
            "Cache-Control": "public, max-age=3600",
        },
    });
}
