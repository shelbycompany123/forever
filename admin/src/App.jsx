import { useEffect, useState } from "react";
import Navbar from "./Components/Navbar";
import Sidebar from "./Components/Sidebar";
import { Routes, Route } from "react-router-dom";
import AddProducts from "./Pages/AddProducts";
import ListProducts from "./Pages/ListProducts";
import Orders from "./Pages/Orders";
import OrderDetail from "./Pages/OrderDetail";
import Login from "./Components/Login";
import { Toaster } from "react-hot-toast";
import Overview from "./Pages/Overview";
import UpdateProduct from "./Pages/UpdateProduct";
import ListUser from "./Pages/ListUser";
import UserDetail from "./Pages/UserDetail";
import AddCategories from "./Pages/AddCategories";
import Inventory from "./Pages/Inventory";

export const backendUrl = import.meta.env.VITE_BACKEND_URL;

const App = () => {
  const [token, setToken] = useState(
    localStorage.getItem("token") ? localStorage.getItem("token") : ""
  );

  useEffect(() => {
    localStorage.setItem("token", token);
  }, [token]);

  return (
    <div className="bg-gray-100 min-h-screen">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#000000",
            color: "#ffffff",
            border: "1px solid #e5e5e5",
          },
        }}
      />
      {token === "" ? (
        <Login setToken={setToken} />
      ) : (
        <>
          <Navbar setToken={setToken} />
          <div className="flex">
            <Sidebar />
            <div className="flex-1 p-6 ml-[18%]">
              <div className="max-w-7xl mx-auto">
                <Routes>
                  <Route path="/" element={<Overview token={token} />} />
                  <Route path="/add" element={<AddProducts token={token} />} />
                  <Route path="/user" element={<ListUser token={token} />} />
                  <Route
                    path="/user/:userId"
                    element={<UserDetail token={token} />}
                  />
                  <Route
                    path="/list"
                    element={<ListProducts token={token} />}
                  />
                  <Route path="/orders" element={<Orders token={token} />} />
                  <Route
                    path="/orders/:orderId"
                    element={<OrderDetail token={token} />}
                  />
                  <Route
                    path="/update/:id"
                    element={<UpdateProduct token={token} />}
                  />
                  <Route
                    path="/category"
                    element={<AddCategories token={token} />}
                  />
                  <Route
                    path="/inventory"
                    element={<Inventory token={token} />}
                  />
                </Routes>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default App;
