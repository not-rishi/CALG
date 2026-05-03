import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import GPACalculator from "./pages/GPACalculator";
import Guide from "./pages/Guide";

export default function App() {
  return (
    <AppProvider>
      <Router basename="/CALG">
        <Routes>
          <Route path="/" element={<GPACalculator />} />
          <Route path="/guide" element={<Guide />} />
        </Routes>
      </Router>
    </AppProvider>
  );
}
