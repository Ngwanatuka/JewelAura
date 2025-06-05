import styled from "styled-components";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Announcement from "../components/Announcement";
import { Add, Remove } from "@material-ui/icons";
import { mobile } from "../responsive";
import { useSelector } from "react-redux";
import StripeCheckout from "react-stripe-checkout";
import { useEffect, useState } from "react";
import { userRequest } from "../requestMethods";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  decreaseQuantity,
  increaseQuantity,
  removeItem,
} from "../redux/cartRedux";
import { Link } from "react-router-dom";

const stripeKey = import.meta.env.VITE_STRIPE_KEY;

const Container = styled.div``;

const Wrapper = styled.div`
  padding: 20px;
  ${mobile({ padding: "10px" })}
`;

const Title = styled.h1`
  font-weight: 300;
  text-align: center;
`;

const Top = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
`;

const TopButton = styled.button`
  padding: 10px;
  font-weight: 600;
  cursor: pointer;
  border-radius: 5px;
  border: ${(props) => props.type === "filled" && "none"};
  background-color: ${(props) =>
    props.type === "filled" ? "teal" : "transparent"};
  color: ${(props) => props.type === "filled" && "white"};
  &:hover {
    background-color: ${(props) =>
      props.type === "filled" ? "rgb(110, 152, 152)" : "teal"};
    color: ${(props) => props.type === "filled" && "white"};
    border: ${(props) => props.type === "filled" && "none"};
  }
`;

// const TopText = styled.span`
//   ${mobile({ display: "none" })}
// `;

const TopTexts = styled.div`
  text-decoration: underline;
  cursor: pointer;
  font-weight: 600;
  font-size: 13px;
`;

const Bottom = styled.div`
  display: flex;
  justify-content: space-between;
  ${mobile({ flexDirection: "column" })}
`;

const Info = styled.div`
  flex: 3;
`;

const Product = styled.div`
  display: flex;
  justify-content: space-between;
  ${mobile({ flexDirection: "column" })}
`;

const ProductDetail = styled.div`
  flex: 2;
  display: flex;
`;

const Image = styled.img`
  width: 200px;
`;

const Details = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  gap: 20px;
`;

const ProductName = styled.span``;

const ProductId = styled.span``;

const ProductColor = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: ${(props) => props.color};
`;

const ProductSize = styled.span``;

const PriceDetail = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ProductAmountContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const ProductAmount = styled.div`
  font-size: 24px;
  margin: 5px;
  ${mobile({ margin: "5px 15px" })}
`;

const ProductPrice = styled.div`
  font-size: 30px;
  font-weight: 200;
  ${mobile({ marginBottom: "20px" })}
`;

const Hr = styled.hr`
  background-color: #eee;
  border: none;
  height: 1px;
  margin: 10px 0px;
`;

const Summary = styled.div`
  flex: 1;
  border: 0.5px solid lightgray;
  border-radius: 10px;
  padding: 20px;
  height: 50vh;
`;

const SummaryTitle = styled.h1`
  font-weight: 200;
`;

const SummaryItem = styled.div`
  margin: 30px 0px;
  display: flex;
  justify-content: space-between;
  font-weight: ${(props) => props.type === "total" && "500"};
  font-size: ${(props) => props.type === "total" && "24px"};
`;

const SummaryItemText = styled.span``;

const SummaryItemPrice = styled.span``;

const Button = styled.button`
  width: 100%;
  padding: 10px;
  background-color: teal;
  color: white;
  font-weight: 600;
  cursor: pointer;
  border: none;
  border-radius: 5px;
  &:hover {
    background-color: rgb(110, 152, 152);
  }
`;

/**
 * The Cart component, which displays the cart page.
 *
 * The Cart component displays the cart page, which includes the items in the cart,
 * the subtotal, estimated shipping, shipping discount, and total. It also includes
 * a button to checkout using Stripe.
 *
 * @returns {React.ReactElement} - The Cart component.
 */
const Cart = () => {
  const [stripeToken, setStripeToken] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

/**
 * Decreases the quantity of a product in the cart by one if the quantity is greater than one.
 * If the quantity is one, removes the product from the cart.
 *
 * @param {string} productId - The ID of the product whose quantity is to be decreased.
 */

  const handleDecreaseQuantity = (productId) => {
    const product = cart.products.find((product) => product._id === productId);

    if (product && product.quantity > 1) {
      dispatch(decreaseQuantity(productId));
    } else if (product && product.quantity === 1) {
      handleRemoveItem(productId);
    }
  };

/**
 * Increases the quantity of an item in the cart by one based on the given productId.
 *
 * @param {string} productId - The ID of the product to increase the quantity of in the cart.
 */
  const handleIncreaseQuantity = (productId) => {
    dispatch(increaseQuantity(productId));
  };

/**
 * Removes an item from the cart based on the given productId.
 *
 * @param {string} productId - The ID of the product to be removed from the cart.
 */

  const handleRemoveItem = (productId) => {
    dispatch(removeItem(productId));
  };

  const cart = useSelector((state) => state.cart);
/**
 * Callback function for when Stripe returns a token after
 * a charge card request. Stores the token in the state
 * for later use in the payment request to the server.
 *
 * @param {Object} token Stripe token object
 */
  const onToken = (token) => {
    setStripeToken(token);
  };
  console.log(stripeToken);

  useEffect(() => {
/**
 * Make a request to the server to process the payment using the Stripe
 * token and the total amount of the cart.
 *
 * @returns {Promise<void>}
 */
    const makeRequest = async () => {
      try {
        const res = await userRequest.post("/checkout/payment", {
          tokenId: stripeToken.id,
          amount: cart.total * 100,
        });
        navigate("/success");
        console.log(res.data);
      } catch (err) {
        console.log("error making the request:");
      }
    };
    stripeToken && cart.total && makeRequest();
  }, [stripeToken, cart.total, navigate]);

  return (
    <Container>
      <Announcement />
      <Navbar />
      <Wrapper>
        <Title>Your Bag</Title>
        <Top>
          <Link to="/products">
            <TopButton>CONTINUE SHOPPING</TopButton>
          </Link>
          <TopTexts>
            {/* <TopText>Shopping Bag(2)</TopText> */}
            {/* <TopText>Your Wishlist (0)</TopText> */}
          </TopTexts>
          <TopButton type="filled">CHECKOUT NOW</TopButton>
        </Top>
        <Bottom>
          <Info>
            {cart.products.map((product) => (
              <Product key={product._id}>
                <ProductDetail>
                  <Image src={product.img} />
                  <Details>
                    <ProductName>
                      <b>Product:</b> {product.title}
                    </ProductName>
                    <ProductId>
                      <b>ID:</b> {product._id}
                    </ProductId>
                    <ProductColor color={product.color} />
                    <ProductSize>
                      <b>Size:</b> {product.size}
                    </ProductSize>
                  </Details>
                </ProductDetail>
                <PriceDetail>
                  <ProductAmountContainer>
                    <Remove
                      onClick={() => handleDecreaseQuantity(product._id)}
                    />
                    <ProductAmount>{product.quantity}</ProductAmount>
                    <Add onClick={() => handleIncreaseQuantity(product._id)} />
                  </ProductAmountContainer>

                  <ProductPrice>
                    $ {product.price * product.quantity}
                  </ProductPrice>
                </PriceDetail>
              </Product>
            ))}
            <Hr />
          </Info>
          <Summary>
            <SummaryTitle>ORDER SUMMARY</SummaryTitle>
            <SummaryItem>
              <SummaryItemText>Subtotal</SummaryItemText>
              <SummaryItemPrice>$ {cart.total}</SummaryItemPrice>
            </SummaryItem>
            <SummaryItem>
              <SummaryItemText>Estimated Shipping</SummaryItemText>
              <SummaryItemPrice>$ 5.90</SummaryItemPrice>
            </SummaryItem>
            <SummaryItem>
              <SummaryItemText>Shipping Discount</SummaryItemText>
              <SummaryItemPrice>$ -5.90</SummaryItemPrice>
            </SummaryItem>
            <SummaryItem type="total">
              <SummaryItemText>Total</SummaryItemText>
              <SummaryItemPrice>$ {cart.total}</SummaryItemPrice>
            </SummaryItem>
            <StripeCheckout
              name="Glittering Rock Jewells"
              // image=""
              billingAddress
              shippingAddress
              description={`Your total is $${cart.total}`}
              amount={cart.total * 100}
              token={onToken}
              stripeKey={stripeKey}
            >
              <Button>CHECKOUT NOW</Button>
            </StripeCheckout>
          </Summary>
        </Bottom>
      </Wrapper>

      <Footer />
    </Container>
  );
};

export default Cart;
