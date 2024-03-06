import StripeCheckout from "react-stripe-checkout";
import { useState, useEffect } from "react";
import axios from "axios";
import { useHistory } from "react-router";

const Pay = () => {
  const [stripeToken, setStripeToken] = useState(null);

  const history = useHistory();

  const onToken = (token) => {
    setStripeToken(token);
  };

  useEffect(() => {
    const makeRequest = async () => {
      try {
        const res = await axios.post(
          "http://localhost:5000/api/checkout/payment",
          {
            tokenId: stripeToken.id,
            amount: 1500,
          }
        );
        console.log(res.data);
        history.push("/success");
      } catch (error) {
        console.log(error);
      }
    };
    stripeToken && makeRequest();
  }, [stripeToken, history]);
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      {stripeToken ? (
        <span>Processing please wait...</span>
      ) : (
        <StripeCheckout
          name="Glitzz"
          billingAddress
          shippingAddress
          description=" Your total is $15"
          amount={1500}
          token={onToken}
          stripeKey="pk_test_51OcUrIIuwQSkOS4G2l0t2rZwfdUqF6KSUcYdxccD7AU79UkyUOHBg9HKMFYoTHk3WZ5HXveTMaHaskvYHQL9Zrl100UlHcDDnZ"
        >
          <button
            style={{
              backgroundColor: "blue",
              color: "white",
              padding: "10px 20px",
              borderRadius: "5px",
              border: "none",
              cursor: "pointer",
            }}
          >
            Pay Now
          </button>
        </StripeCheckout>
      )}
    </div>
  );
};

export default Pay;
