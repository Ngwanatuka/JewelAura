import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import Product from "./pages/Product";
import Home from "./pages/Home";
import ProductList from "./pages/ProductList";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Cart from "./pages/Cart";
import Success from "./pages/Success";
import { StyleSheetManager } from "styled-components";
import { useSelector } from "react-redux";

export const App = () => {
  const user = useSelector((state) => state.user.currentUser);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
    { path: "/products", element: <ProductList /> },

    {
      path: "/products/:category",
      element: <ProductList />,
    },
    {
      path: "/product/:id",
      element: <Product />,
    },
    {
      path: "/success",
      element: <Success />,
    },
    {
      path: "/cart",
      element: <Cart />,
    },
    {
      path: "/register",
      element: user ? <Navigate to="/" /> : <Register />,
    },
    {
      path: "/login",
      element: user ? <Navigate to="/" /> : <Login />,
    },
  ]);

  return (
    <StyleSheetManager
      shouldForwardProp={(prop) => prop !== "slideIndex" && prop !== "bg"}
    >
      <RouterProvider router={router} />
    </StyleSheetManager>
  );
};

export default App;
