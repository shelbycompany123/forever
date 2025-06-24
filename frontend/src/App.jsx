import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import Collection from "./Pages/Collection";
import About from "./Pages/About";
import Contact from "./Pages/Contact";
import Product from "./Pages/Product";
import Cart from "./Pages/Cart";
import Login from "./Pages/Login";
import PlaceOrder from "./Pages/PlaceOrder";
import Orders from "./Pages/Orders";
import OrderDetails from "./Pages/OrderDetails";
import Review from "./Pages/Review";
import Navbar from "./Component/Navbar";
import Footer from "./Component/Footer";
import SearchBar from "./Component/SearchBar";
import SaleProducts from "./Pages/SaleProducts";
import Verify from "./Pages/Verify";
import { Toaster } from "react-hot-toast";
import Profile from "./Pages/Profile";
import UpdateUserInfo from "./Pages/UpdateUserInfo";
import OrderSuccess from "./Pages/OrderSuccess";

const App = () => {
  return (
    <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
      <Toaster />
      <Navbar />
      <SearchBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/product/:productId" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/place-order" element={<PlaceOrder />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/order-details/:orderId" element={<OrderDetails />} />
        <Route path="/review/:orderId" element={<Review />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/sale" element={<SaleProducts />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/update-user-info" element={<UpdateUserInfo />} />
        <Route path="/order-success" element={<OrderSuccess />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
