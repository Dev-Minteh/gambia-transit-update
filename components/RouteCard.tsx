import { useState } from "react";
import { Route } from "@/types/index";
import { calculateFare, calculateTravelTime, calculateTransfers } from "@/utils/routeEngine";

type RouteCardProps = {
  trip: Route[];
  index: number;
};

export default function RouteCard({ trip, index }: RouteCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className="bg-[#1e1e1e] border-l-4 border-[#14b8a6] p-4 mb-3 rounded cursor-pointer"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      
      <p className="font-bold text-[#14b8a6] mb-2">Option {index + 1}</p>
      <p>🛣️ {trip[0].from} → {trip[trip.length - 1].to}</p>
      <p>💰 Fare: {calculateFare(trip)} GMD</p>
      <p>⏱️ Time: {calculateTravelTime(trip)} mins</p>
      <p>🔄 Transfers: {calculateTransfers(trip)}</p>
      <p className="mt-2 text-sm text-gray-400">
        Via: {trip.map(leg => leg.from).join(" → ")} → {trip[trip.length - 1].to}
      </p>

      {isExpanded && (
        <div className="mt-4 border-t border-gray-700 pt-3">
          {trip.map((leg, i) => (
            <div key={i} className="flex items-center gap-2 text-sm py-1">
              <span className="text-[#14b8a6]">●</span>
              <span>{leg.from} → {leg.to}</span>
              <span className="text-gray-400">| {leg.vehicle} | {leg.fare} GMD | {leg.travelTime} mins</span>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-gray-500 mt-2">
        {isExpanded ? "▲ Click to collapse" : "▼ Click to expand"}
      </p>
    </div>
  );
}