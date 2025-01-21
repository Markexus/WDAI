import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Login from "./pages/Login/Login";
import Profile from "./pages/Profile/Profile";
import Register from "./pages/Register/Register";
import ProductPage from "./pages/ProductPage/ProductPage";
import OrderDetails from "./pages/OrderDetails/OrderDetails";
import Cart from "./pages/Cart/Cart";
import Checkout from "./pages/Checkout/Checkout";
import ThankYou from "./pages/Thanks/Thanks";
import ReviewPage from "./pages/ReviewPage/ReviewPage";
import "./App.css";

function App() {
  const [isLogged, setIsLogged] = useState(localStorage.getItem("accessToken") ? true : false);

  return (
    <>
      <Router>
        <Header isLogged={isLogged} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login setIsLogged={setIsLogged} />} />
          <Route path="/profile" element={<Profile setIsLogged={setIsLogged} />} />
          <Route path="/register" element={<Register setIsLogged={setIsLogged} />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/order/:id" element={<OrderDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/thank-you" element={<ThankYou />} />
          <Route path="/reviews/:productId" element={<ReviewPage />} />
        </Routes>
        <Footer />
      </Router>
    </>
  );
}

export default App;
