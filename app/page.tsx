
"use client"
import {routes} from "@/data/routes";
import {findAllPaths, recommendRoute} from "@/utils/routeEngine"
import { useState } from "react";
export default function Home() {
const [from, setFrom] = useState("");
const [to, setTo] = useState("");
const [criteria, setCriteria] = useState("fare"); 
const [results, setResults] = useState<any[]>([]);
const [isSearch, setIsSearch] = useState(false);

const  handleClick = () =>{
setIsSearch(true);
const allPaths = findAllPaths(routes, from, to, []);
const bestTrip = recommendRoute(allPaths, criteria);
if (bestTrip === undefined) {
    setResults([]);
  } else {
    setResults(bestTrip);
  }
}
  return (
    <div className="font-sans">
      <input type="text"
      value={from}
      placeholder="From"
      onChange={(e) => setFrom(e.target.value)}
      >
      </input>
      <input type="text"
      value={to}
      placeholder="To"
      onChange={(e) => setTo(e.target.value)}
      >
      </input>
    <select  
      value={criteria} 
      onChange={(e) => setCriteria(e.target.value)}
      >
      <option value="fare">Cheapest</option>
      <option value="time">Fastest</option>
      <option value="transfers">Fewest Transfer</option>
    </select>
    <button onClick={handleClick}>search</button>
    <div>
     {isSearch && results.length === 0 ? (
          <p>No route available.</p>
        ) : (
        results.map((leg, i) => (
        <p key={i}>
          {leg.from} → {leg.to} | Vehicle: {leg.vehicle} | Fare: {leg.fare} | Time: {leg.travelTime} mins
        </p>
      ))
        )
      }
  </div> 
    </div>
  );
}
