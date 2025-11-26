
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './App.css'; // Include your CSS file
import Product from "./pages/Product";
import Home from "./pages/Home";
import ProductList from "./pages/ProductList";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Cart from "./pages/Cart";
import Success from "./pages/Success";
import Checkout from "./components/Checkout";
import Landing from "./pages/Landing";
import Profile from "./pages/Profile";
import Favorites from "./pages/Favorites";
import OrderHistory from "./pages/OrderHistory";
import OrderTracking from "./pages/OrderTracking";
import Returns from "./pages/Returns";
import AdminLayout from "./components/admin/AdminLayout";
import AdminHome from "./pages/admin/AdminHome";
import AdminProductList from "./pages/admin/ProductList";
import UserList from "./pages/admin/UserList";
import OrderList from "./pages/admin/OrderList";
import NewProduct from "./pages/admin/NewProduct";
import Analytics from "./pages/admin/Analytics";
import Sales from "./pages/admin/Sales";
import { StyleSheetManager } from "styled-components";

export const App = () => {
  const user = useSelector((state) => state.user.currentUser);
  const isAdmin = user?.isAdmin;

  const routes = createBrowserRouter([
    { path: "/", element: user ? <Home /> : <Landing /> },
    { path: "/home", element: user ? <Home /> : <Navigate to="/login" /> },
    { path: "/products", element: <ProductList /> },
    { path: "/products/:category", element: <ProductList /> },
    { path: "/product/:id", element: <Product /> },
    { path: "/success", element: <Success /> },
    { path: "/cart", element: <Cart /> },
    { path: "/checkout", element: user ? <Checkout /> : <Navigate to="/login" /> },
    { path: "/profile", element: user ? <Profile /> : <Navigate to="/login" /> },
    { path: "/favorites", element: user ? <Favorites /> : <Navigate to="/login" /> },
    { path: "/orders", element: user ? <OrderHistory /> : <Navigate to="/login" /> },
    { path: "/orders/:orderId/tracking", element: user ? <OrderTracking /> : <Navigate to="/login" /> },
    { path: "/returns", element: user ? <Returns /> : <Navigate to="/login" /> },
    { path: "/register", element: user ? <Navigate to="/" /> : <Register /> },
    { path: "/login", element: user ? <Navigate to="/" /> : <Login /> },
    {
      path: "/admin",
      element: isAdmin ? <AdminLayout /> : <Navigate to="/" />,
      children: [
        { path: "", element: <AdminHome /> },
        { path: "analytics", element: <Analytics /> },
        { path: "sales", element: <Sales /> },
        { path: "products", element: <AdminProductList /> },
        { path: "newproduct", element: <NewProduct /> },
        { path: "users", element: <UserList /> },
        { path: "orders", element: <OrderList /> },
      ],
    },
  ]);

  return (
    <StyleSheetManager shouldForwardProp={(prop) => prop !== "slideIndex" && prop !== "bg"}>
      <TransitionGroup>
        <CSSTransition
          key={window.location.pathname}
          classNames="fade"
          timeout={300}
        >
          <RouterProvider router={routes} />
        </CSSTransition>
      </TransitionGroup>
    </StyleSheetManager>
  );
};

export default App;