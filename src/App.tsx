import "./App.css";
import "@google/model-viewer";
import { MainPage } from "@/pages/MainPage";
import { useMetadata } from "./hooks/useMetadata";

function App() {
  const { data } = useMetadata();

  return data ? <MainPage allMetadata={data} /> : null;
}

export default App;
