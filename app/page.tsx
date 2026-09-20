
"use client"
import {routes} from "@/data/routes";
import {findAllPaths, recommendRoute} from "@/utils/routeEngine"
import { useState, useEffect } from "react";
export default function Home() {
const [from, setFrom] = useState("");
const [to, setTo] = useState("");
const [criteria, setCriteria] = useState("fare"); 
const [results, setResults] = useState<any[]>([]);
const [isSearch, setIsSearch] = useState(false);

useEffect(() => {
  const savedFrom = localStorage.getItem("lastFrom");
  const savedTo = localStorage.getItem("lastTo");
  if (savedFrom) setFrom(savedFrom);
  if (savedTo) setTo(savedTo);
}, []);

const  handleClick = () =>{
setIsSearch(true);
localStorage.setItem("lastFrom", from);
localStorage.setItem("lastTo", to);
const allPaths = findAllPaths(routes, from, to, []);
const bestTrip = recommendRoute(allPaths, criteria);
if (bestTrip === undefined) {
    setResults([]);
  } else {
    setResults(bestTrip);
  }
}
  return (
    <div className="font-sans bg-gray-950 min-h-screen flex flex-col p-10 items-center text-[#f5f5f5]">
      <input type="text"
      className="p-2 m-2 border font-semibold border-[#333] rounded-md text-white bg-[#1e1e1e]"
      value={from}
      placeholder="From"
      onChange={(e) => setFrom(e.target.value)}
      >

      </input>
      <input type="text"
      className="p-2 font-semibold m-2 border border-[#333] rounded-md text-white bg-[#1e1e1e]"
      value={to}
      placeholder="To"
      onChange={(e) => setTo(e.target.value)}
      >
      </input>
  
    <select  
    className="p-2.5 m-5 border border-[#333] rounded-md bg-[#1e1e1e] text-[#f5f5f5] text-base cursor-pointer"
      value={criteria} 
      onChange={(e) => setCriteria(e.target.value)}
      >
      <option value="fare">Cheapest</option>
      <option value="time">Fastest</option>
      <option value="transfers">Fewest Transfer</option>
    </select>
    <button 
    className="px-5 py-2 m-1 border-none rounded-md bg-[#14b8a6] text-[#121212] text-base font-bold cursor-pointer" 
    onClick={handleClick}>search</button>
    
    <div className="mt-5 w-full max-w-3xl">
     {isSearch && results.length === 0 ? (
          <p className="bg-[#1e1e1e] border-l-4 border-[#14b8a6] p-3 mb-2 rounded">No route available.</p>
        ) : (
        results.map((leg, i) => (
        <p
        className="bg-[#1e1e1e] border-l-4 border-[#14b8a6] p-3 mb-2 rounded" 
        key={i}>
          {leg.from} → {leg.to} | Vehicle: {leg.vehicle} | Fare: {leg.fare} | Time: {leg.travelTime} mins
        </p>
      ))
        )
      }
  </div> 
    </div>
  );
}
