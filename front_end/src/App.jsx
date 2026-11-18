import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { StyleSheetManager } from "styled-components";
import "./App.css";
import ErrorBoundary from "./components/ErrorBoundary";
import Home from "./pages/Home";
import Landing from "./pages/Landing";

const Product = lazy(() => import("./pages/Product"));
const ProductList = lazy(() => import("./pages/ProductList"));
const Register = lazy(() => import("./pages/Register"));
const Login = lazy(() => import("./pages/Login"));
const Cart = lazy(() => import("./pages/Cart"));
const Success = lazy(() => import("./pages/Success"));
const Checkout = lazy(() => import("./components/Checkout"));
const Profile = lazy(() => import("./pages/Profile"));
const Favorites = lazy(() => import("./pages/Favorites"));
const OrderHistory = lazy(() => import("./pages/OrderHistory"));
const OrderTracking = lazy(() => import("./pages/OrderTracking"));
const Returns = lazy(() => import("./pages/Returns"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AdminLayout = lazy(() => import("./components/admin/AdminLayout"));
const AdminHome = lazy(() => import("./pages/admin/AdminHome"));
const AdminProductList = lazy(() => import("./pages/admin/ProductList"));
const UserList = lazy(() => import("./pages/admin/UserList"));
const OrderList = lazy(() => import("./pages/admin/OrderList"));
const NewProduct = lazy(() => import("./pages/admin/NewProduct"));
const Analytics = lazy(() => import("./pages/admin/Analytics"));
const Sales = lazy(() => import("./pages/admin/Sales"));

const PageLoader = () => (
  <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#666" }}>
    Loading...
  </div>
);

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
    { path: "*", element: <NotFound /> },
  ]);

  return (
    <ErrorBoundary>
      <StyleSheetManager shouldForwardProp={(prop) => prop !== "slideIndex" && prop !== "bg"}>
        <Suspense fallback={<PageLoader />}>
          <RouterProvider router={routes} />
        </Suspense>
      </StyleSheetManager>
    </ErrorBoundary>
  );
};

export default App;
