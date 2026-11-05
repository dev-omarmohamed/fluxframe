import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken } from "@/lib/firebase/admin";

export async function GET(req: NextRequest) {
  const result = await verifyAdminToken(req);
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  return NextResponse.json({
    uid: result.user.uid,
    email: result.user.email,
    admin: true,
  });
}

export async function POST(req: NextRequest) {
  return GET(req);
}
