import {routes} from "@/data/routes";

export default function Home() {
  console.log(routes);
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <h1>Gambia transit app</h1>
    </div>
  );
}
