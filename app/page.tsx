
"use client"
import {Route} from "@/types/index";
import ResultsList from "@/components/ResultsList";
import SearchForm from "@/components/SearchForm";
import {findAllPaths, rankRoutes} from "@/utils/routeEngine"
import { useState, useEffect } from "react";
export default function Home() {
const [routes, setRoutes] = useState<Route[]>([]);
const [from, setFrom] = useState("");
const [to, setTo] = useState("");
const [criteria, setCriteria] = useState("fare"); 
const [results, setResults] = useState<Route[][]>([]);
const [isSearch, setIsSearch] = useState(false);
const [routesLoaded, setRoutesLoaded] = useState(false);

useEffect(() => {
  fetch("/api/routes")
  .then((res) => res.json())
  .then((data) => setRoutes(data))
  .finally(() => setRoutesLoaded(true));
},[]);

useEffect(() => {
  const savedFrom = localStorage.getItem("lastFrom");
  const savedTo = localStorage.getItem("lastTo");
  // if (savedFrom) setFrom(savedFrom);
  // if (savedTo) setTo(savedTo);
   Promise.resolve().then(() => {
    if (savedFrom) setFrom(savedFrom);
    if (savedTo) setTo(savedTo);
  });
}, []);


const  handleClick = () =>{
if (!routesLoaded) return;
setIsSearch(true);
localStorage.setItem("lastFrom", from);
localStorage.setItem("lastTo", to);
const allPaths: Route[][] = findAllPaths(routes, from, to);
const ranked = rankRoutes(allPaths, criteria);
// setResults(ranked.slice(0, 3)); 
if (ranked === undefined) {
    setResults([]);
  } else {
      const seen = new Set<string>();
      const unique = ranked.filter((trip) => {
      const key = trip.map(leg => leg.from).join("-");
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    setResults(unique.slice(0, 3));
  }
}


  return (
  <div className="font-sans bg-gray-950 min-h-screen flex flex-col p-10 items-center text-[#f5f5f5]">
    <SearchForm
    from={from}
    to={to}
    criteria={criteria}
    setFrom={setFrom}
    setTo={setTo}
    setCriteria={setCriteria}
    onSearch={handleClick}
    searchDisabled={!routesLoaded}
  />
  <ResultsList results={results} isSearch={isSearch}/>
    </div>
  );
}

