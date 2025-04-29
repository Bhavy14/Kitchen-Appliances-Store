import React from "react";
import { BrowserRouter as Router, Switch, Route, useLocation } from "react-router-dom";
import './App.css';
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from './pages/ProductDetails'; 
import Register from "./pages/Register";
import Login from "./pages/Login";
import ContactUs from "./pages/ContactUs";
import UserPanel from "./pages/UserPanel";
import UserOrdersPage from './pages/UserOrdersPage';
import OrderPage from "./pages/OrderPage";
import AdminDashboard from "./pages/admin-dashboard";

const AppRoutes = () => {
  const location = useLocation();

  // Hide navbar on adminDashboard routes
  const hideNavbar = location.pathname.startsWith("/adminDashboard");

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/home" component={Home} />
        <Route path="/products" component={Products} />
        <Route path="/product/:id" component={ProductDetail} />
        <Route path="/user-orders" component={UserOrdersPage} />
        <Route path="/contact" component={ContactUs} />
        <Route path="/userpanel" component={UserPanel} />
        <Route path="/order" component={OrderPage} />
        <Route path="/register" component={Register} />
        <Route path="/login" component={Login} />
        <Route path="/adminDashboard" component={AdminDashboard} />
      </Switch>
    </>
  );
};

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
