import { useEffect } from "react";
import { useSelector } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/auth/RegisterPage";
import LoginPage from "./pages/auth/LoginPage";
import CartPage from "./pages/CartPage";
import BillPage from "./pages/BillPage";
import CustomerPage from "./pages/CustomerPage";
import StatisticPage from "./pages/StatisticPage";
import Products from "./pages/Products";
import NotFound from "./pages/NotFound";

function App() {
  const cart = useSelector((state) => state.cart);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/homepage" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/bills" element={<BillPage />} />
        <Route path="/customers" element={<CustomerPage />} />
        <Route path="/statistic" element={<StatisticPage />} />
        <Route path="/products" element={<Products />} />
        <Route path="/*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
