// import { Route, Trip } from "@/types/index";

// export function findRoutesFrom(routes: Route[], location: string) : Route[]{
//   const matches = [];
//   for (let i = 0; i < routes.length; i++) {
//     if (routes[i].from === location) {
//       matches.push(routes[i]);
//     }
//   }
//   return matches;
// }


// export function findPath(routes: Route[], start: string, destination: string) : Route[] | null{
//   let currentLocation = start;
//   const path = [];
//   while(currentLocation !== destination){
//   const legs = findRoutesFrom(routes, currentLocation);
//   if(legs.length === 0){
//     return null;
//   }
//   const nextLeg = legs[0]; 
//   path.push(nextLeg) 
//   currentLocation = nextLeg.to; 
//   }
//   return path;
// }

// export function findAllPaths(routes: Route[], currentLocation: string, destination: string, pathSoFar: Route) : Route[] {
//   if (currentLocation === destination) {
//     return [pathSoFar];
//   }

//   const legs = findRoutesFrom(routes, currentLocation); 
//   let allPaths: Route[] = [];

//   for (let i = 0; i < legs.length; i++) {
//     const leg = legs[i];
//     const newPathSoFar = pathSoFar.concat([leg]);
//     const pathsFromHere = findAllPaths(routes, leg.to, destination, newPathSoFar);
//     allPaths = allPaths.concat(pathsFromHere);
//   }

//   return allPaths;
// }



// export function calculateFare(trip: Route[]) : number{
// let total = 0;
// for(let i = 0; i < trip.length; i++){
//   total = total + trip[i].fare;
// }
// return total
// }

// export function calculateTravelTime(trip: Route[]) : number{
// let totalTime = 0;
// for(let i = 0; i < trip.length; i++){
//   totalTime = totalTime + trip[i].travelTime;
// }
// return totalTime;
// }

// export function calculateTransfers(trip: Route[]) : number{
//  let transfer = trip.length;
//  transfer = transfer - 1;
//  return transfer;
// }


// export function rankRoutes(paths: Route[], criteria: string ) : Route[]{
//   const sorted = paths.slice();
//   sorted.sort((a, b) => {
//   if(criteria === "fare"){
//   return calculateFare(a) - calculateFare(b);
//   }else if(criteria === "time"){
//   return calculateTravelTime(a) - calculateTravelTime(b);
//   }else if(criteria === "transfers"){
//   return calculateTransfers(a) - calculateTransfers(b);
//   }
//   return 0
//   });
//   return sorted;
// }

// export function recommendRoute(paths: Trip[], criteria: string) : Route | undefined{
//   const ranked = rankRoutes(paths, criteria);
//   return ranked[0];
// }



import { Route } from "@/types/index";

export function findRoutesFrom(routes: Route[], location: string): Route[] {
  const matches: Route[] = [];
  for (let i = 0; i < routes.length; i++) {
    if (routes[i].from === location) {
      matches.push(routes[i]);
    }
  }
  return matches;
}

export function findPath(routes: Route[], start: string, destination: string): Route[] | null {
  let currentLocation = start;
  const path: Route[] = [];
  while (currentLocation !== destination) {
    const legs = findRoutesFrom(routes, currentLocation);
    if (legs.length === 0) return null;
    const nextLeg = legs[0];
    path.push(nextLeg);
    currentLocation = nextLeg.to;
  }
  return path;
}

export function findAllPaths(routes: Route[], currentLocation: string, destination: string, pathSoFar: Route[]): Route[][] {
  if (currentLocation === destination) {
    return [pathSoFar];
  }
  const legs = findRoutesFrom(routes, currentLocation);
  let allPaths: Route[][] = [];
  for (let i = 0; i < legs.length; i++) {
    const leg = legs[i];
    const newPathSoFar = pathSoFar.concat([leg]);
    const pathsFromHere = findAllPaths(routes, leg.to, destination, newPathSoFar);
    allPaths = allPaths.concat(pathsFromHere);
  }
  return allPaths;
}

export function calculateFare(trip: Route[]): number {
  let total = 0;
  for (let i = 0; i < trip.length; i++) {
    total = total + trip[i].fare;
  }
  return total;
}

export function calculateTravelTime(trip: Route[]): number {
  let totalTime = 0;
  for (let i = 0; i < trip.length; i++) {
    totalTime = totalTime + trip[i].travelTime;
  }
  return totalTime;
}

export function calculateTransfers(trip: Route[]): number {
  return trip.length - 1;
}

export function rankRoutes(paths: Route[][], criteria: string): Route[][] {
  const sorted = paths.slice();
  sorted.sort((a, b) => {
    if (criteria === "fare") return calculateFare(a) - calculateFare(b);
    if (criteria === "time") return calculateTravelTime(a) - calculateTravelTime(b);
    if (criteria === "transfers") return calculateTransfers(a) - calculateTransfers(b);
    return 0;
  });
  return sorted;
}

export function recommendRoute(paths: Route[][], criteria: string): Route[] | undefined {
  const ranked = rankRoutes(paths, criteria);
  return ranked[0];
}