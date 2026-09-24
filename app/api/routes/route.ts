import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET() {
  const { data, error } = await supabase
    .from("routes")
    .select("*");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const transformed = data.map((row: any) => ({
    from: row.from_location,
    to: row.to_location,
    vehicle: row.vehicle,
    fare: row.fare,
    currency: row.currency,
    travelTime: row.travel_time,
  }));

  return NextResponse.json(transformed);
}