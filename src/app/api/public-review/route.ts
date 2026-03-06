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
  const { restaurant_id, rating, meal, service, atmosphere, cleanliness, comment } = body;

  if (!restaurant_id || !rating) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const supabase = getServiceClient();

  const { error } = await supabase.from("reviews").insert({
    restaurant_id,
    rating,
    meal: meal || 0,
    service: service || 0,
    atmosphere: atmosphere || 0,
    cleanliness: cleanliness || 0,
    comment: comment || null,
  });

  if (error) {
    return NextResponse.json({ error: "Failed to save review" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
