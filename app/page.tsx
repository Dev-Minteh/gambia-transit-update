
"use client"
import ResultsList from "@/components/ResultsList";
import SearchForm from "@/components/SearchForm";
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
    <SearchForm
    from={from}
    to={to}
    criteria={criteria}
    setFrom={setFrom}
    setTo={setTo}
    setCriteria={setCriteria}
    onSearch={handleClick}
  />
  <ResultsList results={results} isSearch={isSearch}/>
    </div>
  );
}
