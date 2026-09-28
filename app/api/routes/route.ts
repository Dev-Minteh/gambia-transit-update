import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

type RouteRow = {
  from_location: string;
  to_location: string;
  vehicle: string;
  fare: number;
  currency: string;
  travel_time: number;
};

export async function GET() {
  const { data, error } = await supabase
    .from("routes")
    .select("*");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const transformed = ((data as RouteRow[] | null) ?? []).map((row) => ({
    from: row.from_location,
    to: row.to_location,
    vehicle: row.vehicle,
    fare: row.fare,
    currency: row.currency,
    travelTime: row.travel_time,
  }));

  const distinctRoutes = Array.from(
    new Map(
      transformed.map((route) => [
        JSON.stringify([route.from, route.to, route.vehicle, route.fare, route.currency, route.travelTime]),
        route,
      ]),
    ).values(),
  );

  return NextResponse.json(distinctRoutes);
}
