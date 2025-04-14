import React from "react";
import { Route, Switch, NavLink, useRouteMatch } from "react-router-dom";
import { LayoutDashboard, Users, Box, ClipboardList } from "lucide-react";
import Dashboard from "../pages/Dashboard"; // This one should be used
import UsersPage from "../pages/UsersPage"; // This one should be used
import ProductsPage from "../pages/ProductsPage"; // This one should be used
import OrdersPage from "../pages/OrdersPage"; // This one should be used
import '../styles/admin-dashboard.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h1 className="sidebar-title">Admin Panel</h1>
      <nav className="sidebar-nav">
        <NavLink exact to="/adminDashboard" className="sidebar-link" activeClassName="active">
          <LayoutDashboard size={20} /> Dashboard
        </NavLink>
        <NavLink to="/adminDashboard/users" className="sidebar-link" activeClassName="active">
          <Users size={20} /> Users
        </NavLink>
        <NavLink to="/adminDashboard/products" className="sidebar-link" activeClassName="active">
          <Box size={20} /> Products
        </NavLink>
        <NavLink to="/adminDashboard/orders" className="sidebar-link" activeClassName="active">
          <ClipboardList size={20} /> Orders
        </NavLink>
      </nav>
    </div>
  );
};

const AdminDashboard = () => {
  const match = useRouteMatch();

  return (
    <div className="admin-container offset-nav">
      <Sidebar />
      <div className="admin-main">
        <Switch>
          <Route exact path={match.path} component={Dashboard} /> {/* Fixed this */}
          <Route path={`${match.path}/users`} component={UsersPage} />
          <Route path={`${match.path}/products`} component={ProductsPage} />
          <Route path={`${match.path}/orders`} component={OrdersPage} />
        </Switch>
      </div>
    </div>
  );
};

export default AdminDashboard;
