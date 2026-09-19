import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Setup from "./pages/Setup";
import MasterResume from "./pages/MasterResume";
import Workspace from "./pages/Workspace";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/setup" element={<Setup />} />
        <Route path="/master" element={<MasterResume />} />
        <Route path="/workspace" element={<Workspace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
