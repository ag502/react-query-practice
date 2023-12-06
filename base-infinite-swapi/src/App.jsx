import "./App.css";
import { InfinitePeople } from "./people/InfinitePeople";
import { InfiniteSpecies } from "./species/InfiniteSpecies";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

function App() {
  return (
    <div className="App">
      <h1>Infinite SWAPI</h1>
      {/* <InfinitePeople /> */}
      <InfiniteSpecies />
    </div>
  );
}

export default App;
