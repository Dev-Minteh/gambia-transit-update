import { Route } from "@/types/index";

/** Makes user-entered place names comparable with values returned by the API. */
export function normalizeLocation(location: string): string {
  return location.trim().replace(/\s+/g, " ").toLocaleLowerCase();
}

function routeKey(route: Route): string {
  return JSON.stringify([
    normalizeLocation(route.from),
    normalizeLocation(route.to),
    route.vehicle,
    route.fare,
    route.currency,
    route.travelTime,
  ]);
}

function indexRoutes(routes: Route[]): Map<string, Route[]> {
  const routesFrom = new Map<string, Route[]>();
  const seenRoutes = new Set<string>();

  for (const route of routes) {
    const from = normalizeLocation(route.from);
    const to = normalizeLocation(route.to);
    if (!from || !to) continue;
    const key = routeKey(route);
    if (seenRoutes.has(key)) continue;
    seenRoutes.add(key);

    const legs = routesFrom.get(from);
    if (legs) legs.push(route);
    else routesFrom.set(from, [route]);
  }

  return routesFrom;
}

/** Minimum remaining legs from each location to the destination. */
function distancesToDestination(routes: Route[], destination: string): Map<string, number> {
  const routesTo = new Map<string, string[]>();

  for (const route of routes) {
    const from = normalizeLocation(route.from);
    const to = normalizeLocation(route.to);
    if (!from || !to) continue;

    const previousLocations = routesTo.get(to);
    if (previousLocations) previousLocations.push(from);
    else routesTo.set(to, [from]);
  }

  const distances = new Map<string, number>([[destination, 0]]);
  const queue = [destination];
  for (let index = 0; index < queue.length; index++) {
    const location = queue[index];
    const distance = distances.get(location)!;
    for (const previous of routesTo.get(location) ?? []) {
      if (!distances.has(previous)) {
        distances.set(previous, distance + 1);
        queue.push(previous);
      }
    }
  }

  return distances;
}

export function findRoutesFrom(routes: Route[], location: string): Route[] {
  return indexRoutes(routes).get(normalizeLocation(location)) ?? [];
}

export function findPath(routes: Route[], start: string, destination: string): Route[] | null {
  const paths = findAllPaths(routes, start, destination, {
    maxLegs: Number.MAX_SAFE_INTEGER,
    maxResults: 1,
    maxStates: 10_000,
  });
  return paths[0] ?? null;
}

export type PathSearchOptions = {
  /** Maximum legs in a suggestion. Defaults to 15. */
  maxLegs?: number;
  /** Maximum suggestions returned. Defaults to 100. */
  maxResults?: number;
  /** Safety limit for explored path states. Defaults to 10,000. */
  maxStates?: number;
};

/**
 * Finds loop-free suggestions in breadth-first order (fewest transfers first).
 * Every-simple-path enumeration is exponential, so finite defaults are deliberate.
 */
export function findAllPaths(
  routes: Route[],
  start: string,
  destination: string,
  options: PathSearchOptions = {},
): Route[][] {
  const startKey = normalizeLocation(start);
  const destinationKey = normalizeLocation(destination);
  if (!startKey || !destinationKey || startKey === destinationKey) return [];

  const maxLegs = options.maxLegs ?? 15;
  const maxResults = options.maxResults ?? 100;
  const maxStates = options.maxStates ?? 10_000;
  if (maxLegs < 1 || maxResults < 1 || maxStates < 1) return [];

  const routesFrom = indexRoutes(routes);
  const remainingLegs = distancesToDestination(routes, destinationKey);
  if (!remainingLegs.has(startKey)) return [];

  const results: Route[][] = [];
  type SearchState = { location: string; path: Route[]; visited: Set<string>; priority: number };
  const queue: SearchState[] = [];

  const enqueue = (state: SearchState) => {
    queue.push(state);
    let child = queue.length - 1;
    while (child > 0) {
      const parent = Math.floor((child - 1) / 2);
      if (queue[parent].priority <= state.priority) break;
      queue[child] = queue[parent];
      child = parent;
    }
    queue[child] = state;
  };

  const dequeue = (): SearchState | undefined => {
    const first = queue[0];
    const last = queue.pop();
    if (!first || !last || queue.length === 0) return first;

    let parent = 0;
    while (true) {
      const left = parent * 2 + 1;
      const right = left + 1;
      let smallest = parent;
      if (left < queue.length && queue[left].priority < last.priority) smallest = left;
      const smallestPriority = smallest === parent ? last.priority : queue[smallest].priority;
      if (right < queue.length && queue[right].priority < smallestPriority) smallest = right;
      if (smallest === parent) break;
      queue[parent] = queue[smallest];
      parent = smallest;
    }
    queue[parent] = last;
    return first;
  };

  enqueue({ location: startKey, path: [], visited: new Set([startKey]), priority: remainingLegs.get(startKey)! });
  let explored = 0;

  // Priority is path length + known minimum remaining legs, so viable routes win.
  while (queue.length > 0 && results.length < maxResults && explored < maxStates) {
    const { location, path, visited } = dequeue()!;
    explored++;

    if (location === destinationKey) {
      results.push(path);
      continue;
    }
    if (path.length >= maxLegs) continue;

    for (const leg of routesFrom.get(location) ?? []) {
      const nextLocation = normalizeLocation(leg.to);
      const remaining = remainingLegs.get(nextLocation);
      if (!nextLocation || remaining === undefined || visited.has(nextLocation)) continue;

      enqueue({
        location: nextLocation,
        path: [...path, leg],
        visited: new Set([...visited, nextLocation]),
        priority: path.length + 1 + remaining,
      });
    }
  }

  return results;
}

export function calculateFare(trip: Route[]): number {
  return trip.reduce((total, leg) => total + leg.fare, 0);
}

export function calculateTravelTime(trip: Route[]): number {
  return trip.reduce((total, leg) => total + leg.travelTime, 0);
}

export function calculateTransfers(trip: Route[]): number {
  return Math.max(0, trip.length - 1);
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
  return rankRoutes(paths, criteria)[0];
}
