export type Route = {
  from: string;
  to: string;
  vehicle: string;
  fare: number;
  currency: string;
  travelTime: number;
};

export type Stop = {
    id:number;
    name: string;
    latitude: number;
    longitude: number;
}
// export type Trip = Route[]; 