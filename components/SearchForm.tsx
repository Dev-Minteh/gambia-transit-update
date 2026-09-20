type SearchFormProp = {
from: string;
  to: string;
  criteria: string;
  setFrom: (value: string) => void;
  setTo: (value: string) => void;
  setCriteria: (value: string) => void;
  onSearch: () => void;
};

export default function SearchForm({from, to, setFrom, setTo, criteria, setCriteria, onSearch} : SearchFormProp) {
  return (
    <>
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
    onClick={onSearch}>search</button>
    </>
  )
}
