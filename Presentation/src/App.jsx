import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CartPages from "./pages/CartPages";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/cart" element={<CartPages />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
