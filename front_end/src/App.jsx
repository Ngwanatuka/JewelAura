import Cart from "./pages/Cart";
import { StyleSheetManager } from "styled-components";

export const App = () => {
  return (
    <StyleSheetManager
      shouldForwardProp={(prop) => prop !== "slideIndex" && prop !== "bg"}
    >
      <Cart />
    </StyleSheetManager>
  );
};

export default App;
