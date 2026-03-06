import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { restaurant_id } = body;

  if (!restaurant_id) {
    return NextResponse.json({ error: "Missing restaurant_id" }, { status: 400 });
  }

  const now = new Date();
  const hour = now.getHours();
  const period = hour < 12 ? "morning" : "afternoon";

  const supabase = getServiceClient();

  await supabase.from("scans").insert({
    restaurant_id,
    scanned_at: now.toISOString(),
    period,
  });

  return NextResponse.json({ ok: true });
}
