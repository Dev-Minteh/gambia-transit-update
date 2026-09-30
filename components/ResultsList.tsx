import {  Route, Stop } from "@/types/index"  
import RouteCard from "./RouteCard";
type ResultsList = {
    results: Route[][];
    isSearch: boolean;
    stops: Stop[];
}
export default function ResultsList({results, isSearch, stops} : ResultsList) {
  return (
   <div className="mt-5 w-full max-w-3xl">
     {isSearch && results.length === 0 ? (
          <p className="bg-[#1e1e1e] border-l-4 border-[#14b8a6] p-3 mb-2 rounded">No route available.</p>
        ) : (
       results.map((trip, i) => (
      <RouteCard key={i} trip={trip} index={i} stops={stops}/>
    ))
        )
      }
  </div> 
  )
}
