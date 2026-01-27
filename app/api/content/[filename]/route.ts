import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ filename: string }> },
) {
  try {
    const { filename } = await params;
    const filePath = path.join(
      process.cwd(),
      "app",
      "data",
      "content",
      filename,
    );
    const content = await fs.readFile(filePath, "utf-8");

    return NextResponse.json({ content });
  } catch (error) {
    return NextResponse.json({ error: "Content not found" }, { status: 404 });
  }
}
