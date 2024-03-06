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
import { StyleSheetManager } from "styled-components";

export const App = () => {
  
  const user = true;

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/products/:category",
      element: <ProductList />,
    },
    {
      path: "/product/:id",
      element: <Product />,
    },
    {
      path: "/cart",
      element:  <Cart />,
    },
    {
      path: "/register",
      element: user ? <Navigate to='/'/> : <Register />,
    },
    {
      path: "/login",
      element: user ? <Navigate to='/'/> : <Login />,
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
