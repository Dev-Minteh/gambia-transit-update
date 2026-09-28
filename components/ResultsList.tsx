import {  Route } from "@/types/index"
import { calculateFare, calculateTransfers, calculateTravelTime } from "@/utils/routeEngine"
type ResultsList = {
    results: Route[][];
    isSearch: boolean;
}
export default function ResultsList({results, isSearch} : ResultsList) {
  return (
   <div className="mt-5 w-full max-w-3xl">
     {isSearch && results.length === 0 ? (
          <p className="bg-[#1e1e1e] border-l-4 border-[#14b8a6] p-3 mb-2 rounded">No route available.</p>
        ) : (
       results.map((trip: Route[], i: number) => (
      <div key={i} className="bg-[#1e1e1e] border-l-4 border-[#14b8a6] p-4 mb-3 rounded">
        <p className="font-bold text-[#14b8a6] mb-2">Option {i + 1}</p>
        <p>🛣️ {trip[0].from} → {trip[trip.length - 1].to}</p>
        <p>💰 Fare: {calculateFare(trip)} GMD</p>
        <p>⏱️ Time: {calculateTravelTime(trip)} mins</p>
        <p>🔄 Transfers: {calculateTransfers(trip)}</p>
        <p className="mt-2 text-sm text-gray-400">
          Via: {trip.map(leg => leg.from).join(" → ")} → {trip[trip.length - 1].to}
        </p>
      </div>
    ))
        )
      }
  </div> 
  )
}
