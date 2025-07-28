import React from "react";
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
import { StyleSheetManager } from "styled-components";

export const App = () => {
  const user = useSelector((state) => state.user.currentUser);

  const routes = createBrowserRouter([
    { path: "/", element: user ? <Home /> : <Navigate to="/login" /> },
    { path: "/products", element: <ProductList /> },
    { path: "/products/:category", element: <ProductList /> },
    { path: "/product/:id", element: <Product /> },
    { path: "/success", element: <Success /> },
    { path: "/cart", element: <Cart /> },
    { path: "/checkout", element: user ? <Checkout /> : <Navigate to="/login" /> },
    { path: "/register", element: user ? <Navigate to="/" /> : <Register /> },
    { path: "/login", element: user ? <Navigate to="/" /> : <Login /> }
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