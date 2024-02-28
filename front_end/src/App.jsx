import Cart from "./pages/Cart";
import { StyleSheetManager } from "styled-components";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

const clientID = import.meta.env.VITE_PAYPAL_CLIENT_ID;

export const App = () => {
  return (
    <PayPalScriptProvider options={{ "client-id": clientID }}>
      <StyleSheetManager
        shouldForwardProp={(prop) => prop !== "slideIndex" && prop !== "bg"}
      >
        <Cart />
      </StyleSheetManager>
    </PayPalScriptProvider>
  );
};

export default App;
