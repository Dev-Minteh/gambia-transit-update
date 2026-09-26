import {  Route } from "@/types/index"
type ResultsList = {
    results: Route[];
    isSearch: boolean;
}
export default function ResultsList({results, isSearch} : ResultsList) {
  return (
   <div className="mt-5 w-full max-w-3xl">
     {isSearch && results.length === 0 ? (
          <p className="bg-[#1e1e1e] border-l-4 border-[#14b8a6] p-3 mb-2 rounded">No route available.</p>
        ) : (
        results.map((leg: Route, i: number) => (
        <p
        className="bg-[#1e1e1e] border-l-4 border-[#14b8a6] p-3 mb-2 rounded" 
        key={i}>
          {leg.from} → {leg.to} | Vehicle: {leg.vehicle} | Fare: {leg.fare} | Time: {leg.travelTime} mins
        </p>
      ))
        )
      }
  </div> 
  )
}
